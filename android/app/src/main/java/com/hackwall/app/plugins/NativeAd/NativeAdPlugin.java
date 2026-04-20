package com.hackwall.app.plugins.NativeAd;

import android.app.Activity;
import android.graphics.Color;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.hackwall.app.R;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdLoader;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.nativead.NativeAd;
import com.google.android.gms.ads.nativead.NativeAdView;

@CapacitorPlugin(name = "NativeAd")
public class NativeAdPlugin extends Plugin {

    private NativeAd nativeAd;
    private FrameLayout overlayContainer;
    private NativeAdView nativeAdView;

    @PluginMethod()
    public void load(PluginCall call) {
        final String adUnitId = call.getString("adUnitId");
        if (adUnitId == null || adUnitId.trim().isEmpty()) {
            call.reject("adUnitId is required");
            return;
        }

        final Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity is null");
            return;
        }

        activity.runOnUiThread(() -> {
            AdLoader adLoader = new AdLoader.Builder(activity, adUnitId)
                    .forNativeAd(ad -> {
                        // Clean up previous ad instance
                        if (nativeAd != null) {
                            nativeAd.destroy();
                        }
                        nativeAd = ad;
                        JSObject ret = new JSObject();
                        ret.put("loaded", true);
                        call.resolve(ret);
                    })
                    .withAdListener(new AdListener() {
                        @Override
                        public void onAdFailedToLoad(LoadAdError adError) {
                            call.reject(adError.getMessage() + " (Code: " + adError.getCode() + ")");
                        }
                    })
                    .build();

            adLoader.loadAd(new AdRequest.Builder().build());
        });
    }

    @PluginMethod()
    public void show(PluginCall call) {
        if (nativeAd == null) {
            call.reject("Native ad is not loaded. Call load() first.");
            return;
        }

        Double x = call.getDouble("x", 0.0);
        Double y = call.getDouble("y", 0.0);
        Double width = call.getDouble("width");
        Double height = call.getDouble("height");

        if (width == null || height == null) {
            call.reject("width and height are required");
            return;
        }

        final Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity is null");
            return;
        }

        activity.runOnUiThread(() -> {
            ensureOverlayContainer(activity);

            // If it already has a parent, remove it to re-position
            if (nativeAdView != null && nativeAdView.getParent() != null) {
                ((ViewGroup) nativeAdView.getParent()).removeView(nativeAdView);
            }

            ensureNativeAdView(activity);

            final float density = activity.getResources().getDisplayMetrics().density;
            final int xPx = Math.round(x.floatValue() * density);
            final int yPx = Math.round(y.floatValue() * density);
            final int widthPx = Math.round(width.floatValue() * density);
            final int heightPx = Math.round(height.floatValue() * density);

            // getBoundingClientRect() coords are relative to the WebView viewport.
            // The overlay container may start at a different screen position (e.g., when
            // Capacitor runs edge-to-edge and the WebView extends under the status bar but
            // the overlay container does not). Compute the offset so the ad lands exactly
            // on top of the placeholder div.
            int[] webViewLoc = new int[2];
            getBridge().getWebView().getLocationOnScreen(webViewLoc);
            int[] overlayLoc = new int[2];
            overlayContainer.getLocationOnScreen(overlayLoc);
            final int offsetX = webViewLoc[0] - overlayLoc[0];
            final int offsetY = webViewLoc[1] - overlayLoc[1];

            FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(widthPx, heightPx);
            lp.leftMargin = xPx + offsetX;
            lp.topMargin = yPx + offsetY;
            lp.gravity = Gravity.TOP | Gravity.START;

            nativeAdView.setLayoutParams(lp);
            overlayContainer.addView(nativeAdView);

            bindNativeAd(nativeAdView, nativeAd);

            JSObject ret = new JSObject();
            ret.put("shown", true);
            call.resolve(ret);
        });
    }

    @PluginMethod()
    public void hide(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (nativeAdView != null && nativeAdView.getParent() != null) {
                ((ViewGroup) nativeAdView.getParent()).removeView(nativeAdView);
            }
            JSObject ret = new JSObject();
            ret.put("hidden", true);
            call.resolve(ret);
        });
    }

    @PluginMethod()
    public void destroy(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (nativeAdView != null && nativeAdView.getParent() != null) {
                ((ViewGroup) nativeAdView.getParent()).removeView(nativeAdView);
            }
            nativeAdView = null;
            if (nativeAd != null) {
                nativeAd.destroy();
                nativeAd = null;
            }
            JSObject ret = new JSObject();
            ret.put("destroyed", true);
            call.resolve(ret);
        });
    }

    private void ensureOverlayContainer(Activity activity) {
        if (overlayContainer != null) return;

        // Try finding by ID (defined in your styles/layouts)
        View overlay = activity.findViewById(R.id.native_ad_overlay_container);
        if (overlay instanceof FrameLayout) {
            overlayContainer = (FrameLayout) overlay;
        } else {
            // Fallback: Add it to the root content view
            ViewGroup root = activity.findViewById(android.R.id.content);
            overlayContainer = new FrameLayout(activity);
            overlayContainer.setLayoutParams(new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
            ));
            root.addView(overlayContainer);
        }

        overlayContainer.setClickable(false);
        overlayContainer.setFocusable(false);
    }

    private void ensureNativeAdView(Activity activity) {
        // Always inflate fresh if the previous one was null or we want to ensure clean state
        if (nativeAdView == null) {
            LayoutInflater inflater = LayoutInflater.from(activity);
            nativeAdView = (NativeAdView) inflater.inflate(R.layout.native_ad_card, null);
        }
    }

    private void bindNativeAd(NativeAdView adView, NativeAd ad) {
        adView.setHeadlineView(adView.findViewById(R.id.ad_headline));
        adView.setBodyView(adView.findViewById(R.id.ad_body));
        adView.setCallToActionView(adView.findViewById(R.id.ad_call_to_action));
        adView.setIconView(adView.findViewById(R.id.ad_app_icon));

        ((TextView) adView.getHeadlineView()).setText(ad.getHeadline());

        if (ad.getBody() == null) {
            adView.getBodyView().setVisibility(View.INVISIBLE);
        } else {
            adView.getBodyView().setVisibility(View.VISIBLE);
            ((TextView) adView.getBodyView()).setText(ad.getBody());
        }

        if (ad.getCallToAction() == null) {
            adView.getCallToActionView().setVisibility(View.INVISIBLE);
        } else {
            adView.getCallToActionView().setVisibility(View.VISIBLE);
            ((Button) adView.getCallToActionView()).setText(ad.getCallToAction());
        }

        if (ad.getIcon() == null) {
            adView.getIconView().setVisibility(View.GONE);
        } else {
            ((ImageView) adView.getIconView()).setImageDrawable(ad.getIcon().getDrawable());
            adView.getIconView().setVisibility(View.VISIBLE);
        }

        // IMPORTANT: Assign the ad object to the view last
        adView.setNativeAd(ad);
    }
}
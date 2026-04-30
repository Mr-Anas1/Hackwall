package com.hackwall.app;

import android.os.Bundle;
import android.webkit.WebSettings;

import com.getcapacitor.BridgeActivity;
import com.hackwall.app.plugins.NativeAd.NativeAdPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(NativeAdPlugin.class);
    super.onCreate(savedInstanceState);
  }

  @Override
  protected void onStart() {
    super.onStart();
    // Disable zoom in WebView
    if (this.bridge != null && this.bridge.getWebView() != null) {
      WebSettings webSettings = this.bridge.getWebView().getSettings();
      webSettings.setSupportZoom(false);
      webSettings.setBuiltInZoomControls(false);
      webSettings.setDisplayZoomControls(false);
    }
  }
}

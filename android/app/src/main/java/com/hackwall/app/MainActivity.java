package com.hackwall.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.hackwall.app.plugins.NativeAd.NativeAdPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(NativeAdPlugin.class);
    super.onCreate(savedInstanceState);
  }
}

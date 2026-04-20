'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { initializeAdMob, prepareInterstitial, prepareAppOpen, showHomeBanner } from '@/lib/admob';

export default function AdMobProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    (async () => {
      try {
        await initializeAdMob();
        await Promise.all([prepareInterstitial(), prepareAppOpen()]);
        await showHomeBanner();
      } catch (e) {
        console.error('[AdMobProvider] setup failed:', e);
      }
    })();
  }, []);

  return <>{children}</>;
}

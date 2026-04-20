'use client';

import { useEffect } from 'react';
import { initializeAdMob, prepareInterstitial, prepareAppOpen } from '@/lib/admob';

export default function AdMobProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      await initializeAdMob();
      await Promise.all([prepareInterstitial(), prepareAppOpen()]);
    })();
  }, []);

  return <>{children}</>;
}

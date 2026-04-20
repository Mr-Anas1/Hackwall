'use client';

import { useEffect, useRef } from 'react';
import { loadNativeAd, showNativeAd, hideNativeAd } from '@/lib/nativeAd';

const AD_UNIT_ID = 'ca-app-pub-6388743721359867/1524114083';
const BANNER_HEIGHT = 80;
const NAVBAR_HEIGHT = 64;

export default function NativeAdBanner({ hidden = false }: { hidden?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  // Load + show once on mount
  useEffect(() => {
    let destroyed = false;

    const show = async () => {
      if (destroyed || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      await showNativeAd({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });
    };

    (async () => {
      await loadNativeAd(AD_UNIT_ID);
      if (!destroyed) await show();
    })();

    // Reposition on screen rotation / resize only — no scroll listener needed
    // because the div is fixed-position and never moves with the page.
    window.addEventListener('resize', show);

    return () => {
      destroyed = true;
      window.removeEventListener('resize', show);
      hideNativeAd();
    };
  }, []);

  // Hide/restore when a modal opens over the banner
  useEffect(() => {
    if (!ref.current) return;
    if (hidden) {
      hideNativeAd();
    } else {
      const rect = ref.current.getBoundingClientRect();
      showNativeAd({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });
    }
  }, [hidden]);

  return (
    <div
      ref={ref}
      className="fixed left-0 right-0 z-40"
      style={{ bottom: NAVBAR_HEIGHT, height: BANNER_HEIGHT }}
    />
  );
}

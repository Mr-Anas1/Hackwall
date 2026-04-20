'use client';

import { useEffect, useMemo, useRef } from 'react';
import { hideNativeAd, loadNativeAd, showNativeAd } from '@/lib/nativeAd';

export default function NativeAdSlot({ adUnitId }: { adUnitId: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const slotId = useMemo(() => `native-ad-slot-${Math.random().toString(16).slice(2)}`, []);

  useEffect(() => {
    let destroyed = false;
    let rafId: ReturnType<typeof requestAnimationFrame> | null = null;

    const update = async () => {
      if (destroyed) return;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();

      // Only show the ad when the slot is fully within the viewport.
      // rect.top < 0 means the slot has scrolled above the visible area —
      // without this check the plugin receives a negative y and Android clamps
      // the overlay to the top of the screen, covering the header.
      const fullyVisible =
        rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (!fullyVisible) {
        await hideNativeAd();
      } else {
        await showNativeAd({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    const scheduleUpdate = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => { rafId = null; update(); });
    };

    (async () => {
      await loadNativeAd(adUnitId);
      await update();
    })();

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    const onVis = () => {
      if (document.hidden) {
        hideNativeAd();
      }
    };

    document.addEventListener('visibilitychange', onVis);

    return () => {
      destroyed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      hideNativeAd();
    };
  }, [adUnitId, slotId]);

  return (
    <div
      ref={ref}
      id={slotId}
      className="col-span-2 rounded-lg border border-cyber-border bg-cyber-gray/30"
      style={{ height: 120 }}
    />
  );
}

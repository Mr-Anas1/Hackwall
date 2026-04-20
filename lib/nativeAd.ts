'use client';

import { Capacitor } from '@capacitor/core';

type NativeAdPlugin = {
  load(options: { adUnitId: string }): Promise<{ loaded: boolean }>;
  show(options: { x: number; y: number; width: number; height: number }): Promise<{ shown: boolean }>;
  hide(): Promise<{ hidden: boolean }>;
  destroy(): Promise<{ destroyed: boolean }>;
};

function getPlugin(): NativeAdPlugin | null {
  if (!Capacitor.isNativePlatform()) return null;
  const p = (globalThis as typeof globalThis & {
    Capacitor?: { Plugins?: { NativeAd?: NativeAdPlugin } };
  })?.Capacitor?.Plugins?.NativeAd;
  return p ?? null;
}

let loadPromise: Promise<void> | null = null;
let loadedAdUnitId: string | null = null;

export async function loadNativeAd(adUnitId: string) {
  const plugin = getPlugin();
  if (!plugin) return;

  if (loadedAdUnitId === adUnitId && loadPromise) {
    return loadPromise;
  }

  loadedAdUnitId = adUnitId;
  loadPromise = plugin.load({ adUnitId }).then(() => undefined);
  return loadPromise;
}

export async function showNativeAd(rect: { x: number; y: number; width: number; height: number }) {
  const plugin = getPlugin();
  if (!plugin) return;
  await plugin.show(rect);
}

export async function hideNativeAd() {
  const plugin = getPlugin();
  if (!plugin) return;
  await plugin.hide();
}

export async function destroyNativeAd() {
  const plugin = getPlugin();
  if (!plugin) return;
  await plugin.destroy();
}

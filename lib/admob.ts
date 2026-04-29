'use client';

import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { App } from '@capacitor/app';

// Ad Unit IDs (Android)
const BANNER_AD_UNIT_ID = 'ca-app-pub-6388743721359867/3429589679';
const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-6388743721359867/8932138302';
const APP_OPEN_AD_UNIT_ID = 'ca-app-pub-6388743721359867/8932138302'; // Using interstitial as app open for now

// Rate limiting keys
const STORAGE_KEYS = {
  INTERSTITIAL_DOWNLOAD_COUNT: 'admob_interstitial_download_count',
  INTERSTITIAL_LAST_SHOWN: 'admob_interstitial_last_shown',
  APP_OPEN_LAST_SHOWN: 'admob_app_open_last_shown',
  APP_OPEN_BACKGROUND_TIME: 'admob_app_open_background_time',
  APP_OPEN_FIRST_LAUNCH: 'admob_app_open_first_launch',
};

// Rate limiting constants
const INTERSTITIAL_PER_DOWNLOADS = 2; // Show 1 interstitial per 2 downloads
const INTERSTITIAL_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes
const APP_OPEN_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes
const APP_OPEN_MIN_BACKGROUND_MS = 45 * 1000; // 45 seconds backgrounded

let isInterstitialReady = false;
let isAppOpenReady = false;
let homeBannerShown = false;
let modalBannerShown = false;

let initPromise: Promise<void> | null = null;

/**
 * Initialize AdMob (call once on app start)
 */
export async function initializeAdMob() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const { Capacitor } = await import('@capacitor/core');
      if (!Capacitor.isNativePlatform()) return;

      await AdMob.initialize({
        initializeForTesting: false,
      });

      console.log('[AdMob] Initialized');

      // Mark first launch for app open ad
      if (!localStorage.getItem(STORAGE_KEYS.APP_OPEN_FIRST_LAUNCH)) {
        localStorage.setItem(STORAGE_KEYS.APP_OPEN_FIRST_LAUNCH, 'true');
      }

      // Set up app state listeners for app open ad
      setupAppOpenListeners();
    } catch (error) {
      console.error('[AdMob] Initialization failed:', error);
      initPromise = null; // allow retry if failed
    }
  })();

  return initPromise;
}

/**
 * Show banner on home screen
 */
export async function showHomeBanner() {
  if (modalBannerShown) return; // Don't show if modal banner is active

  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) {
      console.log('[AdMob] Not on native platform, skipping banner');
      return;
    }
    if (modalBannerShown) return; // Don't show if modal banner is active

    console.log('[AdMob] Initializing and showing home banner...');
    await initializeAdMob(); // Ensure initialized before showing banner

    // Small delay to ensure WebView is fully ready
    await new Promise(resolve => setTimeout(resolve, 500));

    await AdMob.showBanner({
      adId: BANNER_AD_UNIT_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 64, // sits just above the 64px (h-16) bottom navbar
      isTesting: true,
    });

    homeBannerShown = true;
    console.log('[AdMob] Home banner shown successfully');
  } catch (error) {
    console.error('[AdMob] Failed to show home banner:', error);
  }
}

/**
 * Hide home banner (when modal opens)
 */
export async function hideHomeBanner() {
  if (!homeBannerShown) return;

  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;

    await AdMob.hideBanner();
    homeBannerShown = false;
    console.log('[AdMob] Home banner hidden');
  } catch (error) {
    console.error('[AdMob] Failed to hide home banner:', error);
  }
}

/**
 * Show banner in modal (and ensure home banner is hidden)
 */
export async function showModalBanner() {
  if (modalBannerShown) return;

  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;

    await initializeAdMob(); // Ensure initialized

    // Hide home banner first
    await hideHomeBanner();

    await AdMob.showBanner({
      adId: BANNER_AD_UNIT_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true,
    });

    modalBannerShown = true;
    console.log('[AdMob] Modal banner shown');
  } catch (error) {
    console.error('[AdMob] Failed to show modal banner:', error);
  }
}

/**
 * Hide modal banner (when modal closes)
 */
export async function hideModalBanner() {
  if (!modalBannerShown) return;

  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;

    await AdMob.hideBanner();
    modalBannerShown = false;
    console.log('[AdMob] Modal banner hidden');

    // Restore home banner
    await showHomeBanner();
  } catch (error) {
    console.error('[AdMob] Failed to hide modal banner:', error);
  }
}

/**
 * Prepare interstitial ad (call this early, e.g., on app start)
 */
export async function prepareInterstitial() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;

    await initializeAdMob(); // Ensure initialized

    await AdMob.prepareInterstitial({
      adId: INTERSTITIAL_AD_UNIT_ID,
      isTesting: true,
    });

    isInterstitialReady = true;
    console.log('[AdMob] Interstitial prepared');
  } catch (error) {
    console.error('[AdMob] Failed to prepare interstitial:', error);
  }
}

/**
 * Show an interstitial triggered explicitly by a user action (e.g. tapping an in-feed ad card).
 * This intentionally bypasses the download-based rate limiting.
 */
export async function showInterstitialFromAdCard() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;

    await initializeAdMob();

    if (!isInterstitialReady) {
      await prepareInterstitial();
    }

    if (!isInterstitialReady) return;

    await AdMob.showInterstitial();
    isInterstitialReady = false;

    // Prepare the next one
    await prepareInterstitial();
  } catch (error) {
    console.error('[AdMob] Failed to show interstitial from ad card:', error);
  }
}

/**
 * Check if interstitial should show based on rate limiting
 */
function shouldShowInterstitial(): boolean {
  const downloadCount = parseInt(localStorage.getItem(STORAGE_KEYS.INTERSTITIAL_DOWNLOAD_COUNT) || '0', 10);
  const lastShown = parseInt(localStorage.getItem(STORAGE_KEYS.INTERSTITIAL_LAST_SHOWN) || '0', 10);
  const now = Date.now();

  // Check if we've reached the download count threshold
  if (downloadCount < INTERSTITIAL_PER_DOWNLOADS) {
    return false;
  }

  // Check cooldown
  if (now - lastShown < INTERSTITIAL_COOLDOWN_MS) {
    return false;
  }

  return true;
}

/**
 * Call after successful download to increment counter and maybe show interstitial
 */
export async function maybeShowInterstitialAfterDownload() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;

    // Increment download count
    const downloadCount = parseInt(localStorage.getItem(STORAGE_KEYS.INTERSTITIAL_DOWNLOAD_COUNT) || '0', 10);
    const newCount = downloadCount + 1;
    localStorage.setItem(STORAGE_KEYS.INTERSTITIAL_DOWNLOAD_COUNT, newCount.toString());

    console.log(`[AdMob] Download count: ${newCount}/${INTERSTITIAL_PER_DOWNLOADS}`);

    // Check if we should show interstitial
    if (!shouldShowInterstitial()) {
      // Prepare next interstitial if we're close to the threshold
      if (newCount >= INTERSTITIAL_PER_DOWNLOADS - 1) {
        await prepareInterstitial();
      }
      return;
    }

    // Show interstitial
    if (isInterstitialReady) {
      await AdMob.showInterstitial();
      console.log('[AdMob] Interstitial shown after download');

      // Reset counter and update last shown time
      localStorage.setItem(STORAGE_KEYS.INTERSTITIAL_DOWNLOAD_COUNT, '0');
      localStorage.setItem(STORAGE_KEYS.INTERSTITIAL_LAST_SHOWN, Date.now().toString());
      isInterstitialReady = false;

      // Prepare next one
      await prepareInterstitial();
    }
  } catch (error) {
    console.error('[AdMob] Failed to show interstitial:', error);
  }
}

/**
 * Prepare app open ad (using interstitial as fallback)
 */
export async function prepareAppOpen() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;

    await initializeAdMob(); // Ensure initialized

    // Using interstitial as app open ad fallback
    await AdMob.prepareInterstitial({
      adId: APP_OPEN_AD_UNIT_ID,
      isTesting: true,
    });

    isAppOpenReady = true;
    console.log('[AdMob] App open ad prepared');
  } catch (error) {
    console.error('[AdMob] Failed to prepare app open ad:', error);
  }
}

/**
 * Check if app open ad should show
 */
function shouldShowAppOpen(): boolean {
  const lastShown = parseInt(localStorage.getItem(STORAGE_KEYS.APP_OPEN_LAST_SHOWN) || '0', 10);
  const backgroundTime = parseInt(localStorage.getItem(STORAGE_KEYS.APP_OPEN_BACKGROUND_TIME) || '0', 10);
  const isFirstLaunch = localStorage.getItem(STORAGE_KEYS.APP_OPEN_FIRST_LAUNCH) === 'true';
  const now = Date.now();

  // Don't show on first launch
  if (isFirstLaunch) {
    localStorage.removeItem(STORAGE_KEYS.APP_OPEN_FIRST_LAUNCH);
    return false;
  }

  // Check cooldown
  if (now - lastShown < APP_OPEN_COOLDOWN_MS) {
    return false;
  }

  // Check if app was backgrounded long enough
  if (backgroundTime === 0 || now - backgroundTime < APP_OPEN_MIN_BACKGROUND_MS) {
    return false;
  }

  return true;
}

/**
 * Show app open ad when app is brought to foreground
 */
async function maybeShowAppOpen() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;

    if (!shouldShowAppOpen()) {
      // Prepare next one anyway
      await prepareAppOpen();
      return;
    }

    if (isAppOpenReady) {
      await AdMob.showInterstitial();
      console.log('[AdMob] App open ad shown');

      // Update last shown time
      localStorage.setItem(STORAGE_KEYS.APP_OPEN_LAST_SHOWN, Date.now().toString());
      isAppOpenReady = false;

      // Prepare next one
      await prepareAppOpen();
    }
  } catch (error) {
    console.error('[AdMob] Failed to show app open ad:', error);
  }
}

/**
 * Set up app state listeners for app open ads
 */
function setupAppOpenListeners() {
  // Track when app goes to background
  App.addListener('appStateChange', (state) => {
    if (!state.isActive) {
      // App went to background
      localStorage.setItem(STORAGE_KEYS.APP_OPEN_BACKGROUND_TIME, Date.now().toString());
    }
  });

  // Try to show app open ad when app becomes active
  App.addListener('appStateChange', (state) => {
    if (state.isActive) {
      // App came to foreground
      maybeShowAppOpen();
    }
  });
}

/**
 * Clean up (call when app unmounts)
 */
export async function cleanupAdMob() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;

    await AdMob.removeBanner();
    homeBannerShown = false;
    modalBannerShown = false;
    console.log('[AdMob] Cleanup complete');
  } catch (error) {
    console.error('[AdMob] Cleanup failed:', error);
  }
}

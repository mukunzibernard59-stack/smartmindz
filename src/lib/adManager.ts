/**
 * AdManager - Centralized ad management for SmartMind
 * Handles web (AdSense) ads and provides hooks for Capacitor/AdMob native ads.
 * Uses test ad units in development mode.
 */

// Test/placeholder ad unit IDs — replace with real ones in production
const AD_CONFIG = {
  // Google AdSense Publisher ID (replace with your real one)
  publisherId: 'ca-pub-0000000000000000',

  // Web (AdSense) ad slot IDs
  web: {
    bannerHome: '1234567890',
    bannerLearn: '1234567891',
    bannerTools: '1234567892',
    interstitial: '1234567893',
  },

  // Native (AdMob) ad unit IDs for Android
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111', // Test banner
    interstitial: 'ca-app-pub-3940256099942544/1033173712', // Test interstitial
    rewarded: 'ca-app-pub-3940256099942544/5224354917', // Test rewarded
    appOpen: 'ca-app-pub-3940256099942544/9257395921', // Test app open
  },

  // Frequency caps (milliseconds)
  minInterstitialInterval: 60_000, // 1 minute between interstitials
  minAppOpenInterval: 300_000, // 5 minutes between app open ads
};

let lastInterstitialTime = 0;
let lastAppOpenTime = 0;
let adSenseLoaded = false;
let interstitialQueue: (() => void)[] = [];

// Check if we're in a Capacitor native context
export const isNativeApp = (): boolean => {
  return !!(window as any).Capacitor;
};

// Check if enough time has passed for an interstitial
export const canShowInterstitial = (): boolean => {
  return Date.now() - lastInterstitialTime >= AD_CONFIG.minInterstitialInterval;
};

// Check if enough time has passed for an app open ad
export const canShowAppOpen = (): boolean => {
  return Date.now() - lastAppOpenTime >= AD_CONFIG.minAppOpenInterval;
};

// Record that an interstitial was shown
export const recordInterstitialShown = (): void => {
  lastInterstitialTime = Date.now();
};

// Record that an app open ad was shown
export const recordAppOpenShown = (): void => {
  lastAppOpenTime = Date.now();
};

// Load AdSense script (web only)
export const loadAdSense = (): Promise<void> => {
  if (adSenseLoaded || isNativeApp()) return Promise.resolve();

  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="adsbygoogle"]')) {
      adSenseLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.publisherId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      adSenseLoaded = true;
      resolve();
    };
    script.onerror = () => {
      console.warn('[AdManager] AdSense failed to load (ad blocker?)');
      reject(new Error('AdSense failed to load'));
    };
    document.head.appendChild(script);
  });
};

// Push AdSense ad
export const pushAd = (): void => {
  try {
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  } catch (e) {
    console.warn('[AdManager] Ad push failed:', e);
  }
};

export const getAdConfig = () => AD_CONFIG;

export default AD_CONFIG;

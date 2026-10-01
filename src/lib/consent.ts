// Ad/analytics consent store (EEA, UK, CH compliance).
// Consent is required before any AdSense script loads or ad request is made.

export type AdConsent = 'accepted' | 'rejected' | null;

const KEY = 'smartmind-ad-consent';

export const getAdConsent = (): AdConsent => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'accepted' || v === 'rejected' ? v : null;
  } catch {
    return null;
  }
};

export const setAdConsent = (value: Exclude<AdConsent, null>) => {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent('ad-consent-changed', { detail: value }));
};

export const onAdConsentChange = (cb: (v: AdConsent) => void) => {
  const handler = (e: Event) => cb((e as CustomEvent).detail as AdConsent);
  window.addEventListener('ad-consent-changed', handler);
  return () => window.removeEventListener('ad-consent-changed', handler);
};

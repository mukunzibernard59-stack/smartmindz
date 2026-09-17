import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { supabase } from '@/integrations/supabase/client';

const appId = import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_APP_ID as string | undefined;
const vapidKey = import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_VAPID_KEY as string | undefined;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_WEB_API_KEY as string | undefined,
  projectId: import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_PROJECT_ID as string | undefined,
  appId,
  messagingSenderId: appId?.split(':')[1] ?? '',
};

export type PushResult =
  | { status: 'registered'; token: string }
  | { status: 'not-configured' | 'unsupported' | 'open-in-new-tab' | 'denied' };

export const pushAlreadyGranted = () =>
  typeof Notification !== 'undefined' && Notification.permission === 'granted';

export const pushDecisionMade = () =>
  typeof Notification !== 'undefined' && Notification.permission !== 'default';

/** Must be called from a click handler. */
export async function enablePush(): Promise<PushResult> {
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.projectId ||
    !appId ||
    !vapidKey ||
    !firebaseConfig.messagingSenderId
  ) {
    return { status: 'not-configured' };
  }
  if (!('Notification' in window) || !(await isSupported())) return { status: 'unsupported' };
  if (window.top !== window.self) return { status: 'open-in-new-tab' };

  const permission =
    Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
  if (permission !== 'granted') return { status: 'denied' };

  const query = new URLSearchParams({
    apiKey: firebaseConfig.apiKey,
    projectId: firebaseConfig.projectId,
    appId,
    messagingSenderId: firebaseConfig.messagingSenderId,
  }).toString();

  const serviceWorkerRegistration = await navigator.serviceWorker.register(
    `/firebase-messaging-sw.js?${query}`,
  );
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
  const messaging = getMessaging(app);
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration });
  if (!token) return { status: 'denied' };

  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (userId) {
    await supabase.from('push_tokens').upsert({ user_id: userId, token }, { onConflict: 'token' });
  }

  return { status: 'registered', token };
}

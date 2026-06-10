export async function clearAppCache(options?: { preserveChat?: boolean }) {
  const preserveChat = options?.preserveChat ?? true;

  // Unregister service workers
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
  } catch (e) {
    // ignore
  }

  // Clear Cache Storage
  try {
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.map(n => caches.delete(n)));
    }
  } catch (e) {
    // ignore
  }

  // Prune localStorage keys created by the app
  try {
    const keep = new Set<string>();
    if (preserveChat) keep.add('smartmind_chat_history');
    const keys = Object.keys(localStorage);
    keys.forEach((k) => {
      if (!keep.has(k) && (k.startsWith('smartmind') || k.startsWith('sm_') || k === 'smartmind_app_version')) {
        try { localStorage.removeItem(k); } catch {}
      }
    });
  } catch (e) {
    // ignore
  }

  // Remove common session keys
  try {
    sessionStorage.removeItem('sm_admin_unlocked_v1');
  } catch (e) {}
}

export default clearAppCache;

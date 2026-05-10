import DOMPurify from 'dompurify';

// ─── Sanitasi string dari input user sebelum ditampilkan ke DOM ───
export const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return DOMPurify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

// ─── Validasi email format ───
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// ─── Cek session masih valid ke backend ───
export const checkSession = async (apiBase) => {
  try {
    const res = await fetch(`${apiBase}/api/check-session`, {
      credentials: 'include',
    });
    const data = await res.json();
    return data?.isLoggedIn === true;
  } catch {
    return false;
  }
};

// ─── Redirect jika tidak login ───
export const requireAuth = async (apiBase, redirectTo = '/login') => {
  const loggedIn = await checkSession(apiBase);
  if (!loggedIn) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
};

// ─── Rate limiter sederhana di sisi client ───
const attemptMap = new Map();
export const clientRateLimit = (key, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const now = Date.now();
  const entry = attemptMap.get(key) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    attemptMap.set(key, { count: 1, start: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  if (entry.count >= maxAttempts) {
    const waitMs = windowMs - (now - entry.start);
    return { allowed: false, remaining: 0, waitMs };
  }
  entry.count += 1;
  attemptMap.set(key, entry);
  return { allowed: true, remaining: maxAttempts - entry.count };
};

// ─── Bersihkan semua storage saat logout ───
export const clearAllStorage = () => {
  const keysToKeep = ['theme']; // jaga preferensi tema user
  const saved = {};
  keysToKeep.forEach(k => { saved[k] = localStorage.getItem(k); });
  localStorage.clear();
  sessionStorage.clear();
  keysToKeep.forEach(k => { if (saved[k] !== null) localStorage.setItem(k, saved[k]); });
};

// ─── Deteksi tab/window duplikat (opsional) ───
export const detectDuplicateTab = (onDuplicate) => {
  const tabId = Math.random().toString(36).slice(2);
  const channel = new BroadcastChannel('app_tab_sync');
  channel.postMessage({ type: 'TAB_OPEN', tabId });
  channel.onmessage = (e) => {
    if (e.data.type === 'TAB_OPEN' && e.data.tabId !== tabId) {
      onDuplicate?.();
    }
  };
  return () => channel.close();
};

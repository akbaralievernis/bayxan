// Admin session helper — separate from staffSession because the admin gate
// requires `is_admin: true` and lives at /admin (not /staff).
// We keep it in sessionStorage so closing the tab logs out — appropriate
// for a panel that might be opened on a shared device.

const KEY = "bayhan-admin-session";

export function getAdminSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(session) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

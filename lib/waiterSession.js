// sessionStorage helper for waiter (and reused by cashier) portal sessions.
// Separate from adminSession because /waiter and /cashier are accessible to
// non-admin roles. Session dies with the tab — appropriate for shared devices.

const KEY = "bayhan-pos-session";

export function getPosSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setPosSession(session) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function clearPosSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

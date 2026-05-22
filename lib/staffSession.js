// Lightweight sessionStorage wrapper for the staff portal.
// sessionStorage (not localStorage) so the session dies with the tab —
// appropriate semantics for shared-device staff access.

const KEY = "bayhan-staff-session";

export function getStaffSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStaffSession(session) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function clearStaffSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

import { supabase } from "@/lib/supabase/client";

const AUTH_DELAY_MS = 1500;

/* ────────────────────────────── Helpers ────────────────────────────── */

/**
 * Helper to map database snake_case properties to UI camelCase properties
 * and resolve related staff profile information.
 */
export function mapShift(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.staff_id,
    userName: row.staff_profiles?.name || "Сотрудник",
    userRole: row.staff_profiles?.role || "Персонал",
    date: row.date,
    startTime: row.start_time?.slice(0, 5) || "",
    endTime: row.end_time?.slice(0, 5) || "",
    status: row.status,
  };
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* ─────────────────────────────── Auth ─────────────────────────────── */

/**
 * Verify a 4-digit PIN against the Supabase database.
 * Returns { ok, session } on success, { ok: false, error } otherwise.
 */
export async function verifyPin(pin) {
  // If Supabase is offline/stub, fall back to inline mock staff data
  if (!supabase) {
    await delay(AUTH_DELAY_MS);
    // Keep this in sync with STUB_STAFF in lib/api/admin.js — same PINs.
    const mockStaff = [
      { id: "s-1", pin: "0000", name: "Байхан Асанов",   role: "admin",   title: "Владелец",              is_admin: true },
      { id: "s-2", pin: "9012", name: "Эльдар Бекбаев",  role: "manager", title: "Старший администратор", is_admin: true },
      { id: "s-3", pin: "5678", name: "Айгуль Сатарова", role: "cook",    title: "Су-шеф",                is_admin: false },
      { id: "s-4", pin: "1234", name: "Нурлан Каримов",  role: "cook",    title: "Повар",                 is_admin: false },
      { id: "s-5", pin: "2222", name: "Алия Жунушева",   role: "waiter",  title: "Старший официант",      is_admin: false },
      { id: "s-6", pin: "3333", name: "Тимур Абдылдаев", role: "waiter",  title: "Официант",              is_admin: false },
      { id: "s-7", pin: "4444", name: "Назгуль Орозова", role: "cashier", title: "Кассир",                is_admin: false },
    ];
    const staff = mockStaff.find((s) => s.pin === pin);
    if (!staff) return { ok: false, error: "Неверный PIN-код", session: null };
    const { pin: _omit, ...session } = staff;
    return { ok: true, session };
  }

  try {
    const { data, error } = await supabase.rpc("verify_staff_pin", { p_pin: pin });
    if (error) {
      console.error("[supabase] verify_staff_pin RPC error:", error);
      return { ok: false, error: error.message, session: null };
    }

    const row = data?.[0];
    if (row && row.ok) {
      const session = {
        id: row.profile_id,
        name: row.profile_name,
        role: row.profile_role,
        title: row.profile_title || row.profile_role,
        department: row.profile_department,
        is_admin: row.is_admin === true,
      };
      return { ok: true, session };
    }

    return { ok: false, error: "Неверный PIN-код", session: null };
  } catch (err) {
    console.error("[supabase] verifyPin critical error:", err);
    return { ok: false, error: "Произошла системная ошибка при авторизации", session: null };
  }
}

/* ─────────────────────────────── Reads ─────────────────────────────── */

/**
 * Fetch shifts owned by a specific staff member.
 */
export async function getMyShifts(profileId) {
  if (!supabase) {
    console.warn("[supabase] getMyShifts running in offline/stub mode.");
    return [];
  }

  const { data, error } = await supabase
    .from("shifts")
    .select("*, staff_profiles(name, role)")
    .eq("staff_id", profileId);

  if (error) {
    console.error("[supabase] getMyShifts error:", error);
    return [];
  }
  return (data || []).map(mapShift);
}

/**
 * Fetch all shifts that have been offered on the exchange board and do not belong to the current user.
 */
export async function getAvailableExchanges(profileId) {
  if (!supabase) {
    console.warn("[supabase] getAvailableExchanges running in offline/stub mode.");
    return [];
  }

  let query = supabase
    .from("shifts")
    .select("*, staff_profiles(name, role)")
    .eq("status", "offered");

  if (profileId) {
    query = query.neq("staff_id", profileId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[supabase] getAvailableExchanges error:", error);
    return [];
  }
  return (data || []).map(mapShift);
}

/* ────────────────────────────── Writes ────────────────────────────── */

/**
 * Move a shift from the user's own roster onto the exchange board.
 */
export async function requestExchange(shiftId) {
  if (!supabase) {
    console.warn("[supabase] requestExchange running in offline/stub mode.");
    return { ok: false, error: "Supabase not configured" };
  }

  const { data, error } = await supabase
    .from("shifts")
    .update({ status: "offered" })
    .eq("id", shiftId)
    .select("*, staff_profiles(name, role)")
    .single();

  if (error) {
    console.error("[supabase] requestExchange error:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true, shift: mapShift(data) };
}

/**
 * Claim an offered shift for the given user.
 */
export async function claimExchange(shiftId, claimerProfileOrId) {
  if (!supabase) {
    console.warn("[supabase] claimExchange running in offline/stub mode.");
    return { ok: false, error: "Supabase not configured" };
  }

  const claimerId = typeof claimerProfileOrId === "object" ? claimerProfileOrId.id : claimerProfileOrId;

  const { data, error } = await supabase
    .from("shifts")
    .update({ status: "mine", staff_id: claimerId })
    .eq("id", shiftId)
    .select("*, staff_profiles(name, role)")
    .single();

  if (error) {
    console.error("[supabase] claimExchange error:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true, shift: mapShift(data) };
}


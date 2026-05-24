import { supabase } from "@/lib/supabase/client";
import { MOCK_MENU } from "@/lib/mockData";

export const STAFF_ROLES = [
  { id: "admin",   label: "Администратор",  hint: "Полный доступ к админ-панели" },
  { id: "manager", label: "Менеджер зала",  hint: "Управление сменой, чтение всего" },
  { id: "waiter",  label: "Официант",       hint: "Принимает заказы за столами" },
  { id: "cashier", label: "Кассир",         hint: "Расчёт и закрытие чеков" },
  { id: "kitchen", label: "Шеф / кухня",    hint: "Видит входящие позиции" },
  { id: "cook",    label: "Повар",          hint: "Линейный персонал кухни" },
];

const STUB_STAFF = [
  { id: "s-1", name: "Байхан Асанов",   role: "admin",   title: "Владелец",                department: "admin",   phone: "+996 553 30-04-01", login: "asanov",     password: "0000", is_admin: true,  active: true,  hired_at: "2017-04-12" },
  { id: "s-2", name: "Эльдар Бекбаев",  role: "manager", title: "Старший администратор",   department: "admin",   phone: "+996 700 111 222",  login: "bekbaev",    password: "9012", is_admin: true,  active: true,  hired_at: "2019-09-01" },
  { id: "s-3", name: "Айгуль Сатарова", role: "cook",    title: "Су-шеф",                  department: "kitchen", phone: "+996 770 555 333",  login: "satarova",   password: "5678", is_admin: false, active: true,  hired_at: "2020-03-15" },
  { id: "s-4", name: "Нурлан Каримов",  role: "cook",    title: "Повар",                   department: "kitchen", phone: "+996 555 222 111",  login: "karimov",    password: "1234", is_admin: false, active: true,  hired_at: "2022-06-20" },
  { id: "s-5", name: "Алия Жунушева",   role: "waiter",  title: "Старший официант",        department: "hall",    phone: "+996 700 333 444",  login: "zhunusheva", password: "2222", is_admin: false, active: true,  hired_at: "2021-02-10" },
  { id: "s-6", name: "Тимур Абдылдаев", role: "waiter",  title: "Официант",                department: "hall",    phone: "+996 770 444 555",  login: "abdyldaev",  password: "3333", is_admin: false, active: true,  hired_at: "2023-01-05" },
  { id: "s-7", name: "Назгуль Орозова", role: "cashier", title: "Кассир",                  department: "hall",    phone: "+996 555 666 777",  login: "orozova",    password: "4444", is_admin: false, active: true,  hired_at: "2022-11-15" },
];

/* ============================================================
   Local stub state — used when Supabase env isn't configured.
   This lets the admin UI be developed and demoed without a
   live database. State is module-scoped (resets on reload).
   ============================================================ */

const STUB = {
  bookings: [
    {
      id: "stub-1",
      booking_id: "BAY-4829",
      name: "Айгуль Касымова",
      phone: "+996 700 123 456",
      date: todayPlus(0),
      time: "19:30",
      guests: 4,
      table_type: "vip",
      event_type: "anniversary",
      requests: "Юбилей, нужны свечи на десерт.",
      pre_order: [
        { id: "1", name: "Бешбармак «Хан»",   price: 1200, quantity: 1 },
        { id: "2", name: "Каурдак на углях",  price: 950,  quantity: 2 },
      ],
      total: 3100,
      status: "pending",
      created_at: new Date(Date.now() - 35 * 60_000).toISOString(),
    },
    {
      id: "stub-2",
      booking_id: "BAY-7142",
      name: "Максим Дронов",
      phone: "+996 555 987 654",
      date: todayPlus(0),
      time: "20:00",
      guests: 2,
      table_type: "terrace",
      event_type: "casual",
      requests: null,
      pre_order: [],
      total: 0,
      status: "confirmed",
      created_at: new Date(Date.now() - 4 * 3_600_000).toISOString(),
    },
    {
      id: "stub-3",
      booking_id: "BAY-5577",
      name: "Эрлан Турдубаев",
      phone: "+996 770 555 222",
      date: todayPlus(1),
      time: "13:00",
      guests: 6,
      table_type: "standard",
      event_type: "corporate",
      requests: "Бизнес-обед, нужен счёт.",
      pre_order: [
        { id: "3", name: "Айран-сорпа", price: 680, quantity: 6 },
      ],
      total: 4080,
      status: "confirmed",
      created_at: new Date(Date.now() - 26 * 3_600_000).toISOString(),
    },
    {
      id: "stub-4",
      booking_id: "BAY-9103",
      name: "Дамира Сулайманова",
      phone: "+996 705 444 333",
      date: todayPlus(2),
      time: "19:00",
      guests: 3,
      table_type: "standard",
      event_type: "casual",
      requests: null,
      pre_order: [],
      total: 0,
      status: "cancelled",
      created_at: new Date(Date.now() - 50 * 3_600_000).toISOString(),
    },
  ],
  menu: MOCK_MENU.map((m, i) => ({ ...m, id: m.id || `stub-m-${i}` })),
};

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

/* ────────────────────────── Bookings ────────────────────────── */

/**
 * Fetch all bookings ordered by date desc, time desc.
 * Optionally filter by status or date range.
 */
export async function listBookings({ status, fromDate, toDate } = {}) {
  if (!supabase) {
    let rows = [...STUB.bookings];
    if (status) rows = rows.filter((b) => b.status === status);
    if (fromDate) rows = rows.filter((b) => b.date >= fromDate);
    if (toDate) rows = rows.filter((b) => b.date <= toDate);
    return rows.sort((a, b) =>
      (b.date + b.time).localeCompare(a.date + a.time)
    );
  }

  try {
    let q = supabase
      .from("bookings")
      .select("*")
      .order("date", { ascending: false })
      .order("time", { ascending: false });
    if (status)   q = q.eq("status", status);
    if (fromDate) q = q.gte("date", fromDate);
    if (toDate)   q = q.lte("date", toDate);

    const { data, error } = await q;
    if (error) {
      console.error("[admin.listBookings]", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("[admin.listBookings] critical error:", err);
    return [];
  }
}

export async function updateBookingStatus(id, status) {
  if (!supabase) {
    const idx = STUB.bookings.findIndex((b) => b.id === id);
    if (idx === -1) return { ok: false, error: "not found" };
    STUB.bookings[idx] = { ...STUB.bookings[idx], status };
    return { ok: true, booking: STUB.bookings[idx] };
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin.updateBookingStatus]", error);
    return { ok: false, error: error.message };
  }
  return { ok: true, booking: data };
}

/* ────────────────────────── Menu items ────────────────────────── */

/**
 * Like the public fetchMenu, but returns inactive items too (admin needs
 * to see the whole catalogue) and includes all columns.
 */
export async function listMenuItems() {
  if (!supabase) return [...STUB.menu];

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("[admin.listMenuItems]", error);
    return [];
  }
  return (data || []).map((row) => ({
    id: String(row.id),
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    imagePlaceholder: row.image_url || null,
    active: row.active,
  }));
}

export async function createMenuItem(input) {
  const payload = sanitizeMenuPayload(input);
  if (!supabase) {
    const item = { id: `stub-m-${Date.now()}`, ...payload };
    STUB.menu.push(item);
    return { ok: true, item };
  }

  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      image_url: payload.imagePlaceholder,
      active: payload.active,
    })
    .select()
    .single();

  if (error) {
    console.error("[admin.createMenuItem]", error);
    return { ok: false, error: error.message };
  }
  return { ok: true, item: data };
}

export async function updateMenuItem(id, input) {
  const payload = sanitizeMenuPayload(input);
  if (!supabase) {
    const idx = STUB.menu.findIndex((m) => m.id === id);
    if (idx === -1) return { ok: false, error: "not found" };
    STUB.menu[idx] = { ...STUB.menu[idx], ...payload };
    return { ok: true, item: STUB.menu[idx] };
  }

  const { data, error } = await supabase
    .from("menu_items")
    .update({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      image_url: payload.imagePlaceholder,
      active: payload.active,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin.updateMenuItem]", error);
    return { ok: false, error: error.message };
  }
  return { ok: true, item: data };
}

export async function deleteMenuItem(id) {
  if (!supabase) {
    const before = STUB.menu.length;
    const remaining = STUB.menu.filter((m) => m.id !== id);
    STUB.menu.length = 0;
    STUB.menu.push(...remaining);
    return { ok: STUB.menu.length < before };
  }

  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) {
    console.error("[admin.deleteMenuItem]", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

function sanitizeMenuPayload(input) {
  return {
    name:             String(input.name || "").trim(),
    description:      String(input.description || "").trim() || null,
    price:            Number(input.price) || 0,
    category:         String(input.category || "main").trim(),
    imagePlaceholder: input.imagePlaceholder || input.image_url || null,
    active:           input.active !== false,
  };
}

/* ────────────────────────── Staff ────────────────────────── */

export async function listStaff() {
  if (!supabase) return [...STUB_STAFF];

  const { data, error } = await supabase
    .from("staff_profiles")
    .select("*")
    .order("role")
    .order("name");

  if (error) {
    console.error("[admin.listStaff]", error);
    return [];
  }
  return data || [];
}

export async function createStaff(input) {
  const payload = sanitizeStaffPayload(input);
  if (!supabase) {
    if (STUB_STAFF.some((s) => s.login === payload.login)) {
      return { ok: false, error: "Логин уже занят другим сотрудником" };
    }
    const s = { id: `s-${Date.now()}`, hired_at: new Date().toISOString().split("T")[0], ...payload };
    STUB_STAFF.push(s);
    return { ok: true, staff: s };
  }

  const { data, error } = await supabase
    .from("staff_profiles")
    .insert(payload)
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, staff: data };
}

export async function updateStaff(id, input) {
  const payload = sanitizeStaffPayload(input);
  if (!supabase) {
    const idx = STUB_STAFF.findIndex((s) => s.id === id);
    if (idx === -1) return { ok: false, error: "not found" };
    // Disallow duplicate Login
    const conflict = STUB_STAFF.find((s) => s.login === payload.login && s.id !== id);
    if (conflict) return { ok: false, error: "Логин уже занят другим сотрудником" };
    STUB_STAFF[idx] = { ...STUB_STAFF[idx], ...payload };
    return { ok: true, staff: STUB_STAFF[idx] };
  }

  const { data, error } = await supabase
    .from("staff_profiles")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, staff: data };
}

export async function deleteStaff(id) {
  if (!supabase) {
    const before = STUB_STAFF.length;
    const remaining = STUB_STAFF.filter((s) => s.id !== id);
    STUB_STAFF.length = 0;
    STUB_STAFF.push(...remaining);
    return { ok: STUB_STAFF.length < before };
  }
  const { error } = await supabase.from("staff_profiles").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

function sanitizeStaffPayload(input) {
  return {
    name:       String(input.name || "").trim(),
    role:       String(input.role || "cook").trim(),
    title:      String(input.title || "").trim() || null,
    department: String(input.department || "").trim() || null,
    phone:      String(input.phone || "").trim() || null,
    login:      String(input.login || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, ""),
    password:   String(input.password || "").trim(),
    is_admin:   input.role === "admin" || input.is_admin === true,
    active:     input.active !== false,
  };
}

/* ────────────────────────── Dashboard ────────────────────────── */

/**
 * Roll-up stats for the dashboard. Single call so the admin home renders
 * with one round-trip instead of N.
 */
export async function getDashboardStats() {
  const today = todayPlus(0);
  const tomorrow = todayPlus(1);
  const bookings = await listBookings();

  const todays = bookings.filter((b) => b.date === today);
  const upcoming = bookings
    .filter((b) => b.date >= today && b.status !== "cancelled" && b.status !== "no_show")
    .slice(0, 10);
  const todayRevenue = todays
    .filter((b) => b.status === "confirmed" || b.status === "seated" || b.status === "completed")
    .reduce((s, b) => s + Number(b.total || 0), 0);
  const pending = bookings.filter((b) => b.status === "pending").length;

  return {
    today: {
      total: todays.length,
      revenue: todayRevenue,
      guests: todays.reduce((s, b) => s + Number(b.guests || 0), 0),
    },
    pending,
    upcoming,
    nextDay: {
      date: tomorrow,
      count: bookings.filter((b) => b.date === tomorrow && b.status !== "cancelled").length,
    },
  };
}

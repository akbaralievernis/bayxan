import { supabase } from "@/lib/supabase/client";

/* ============================================================
   Module-level stub state for tables + orders. Mirrors what
   would live in Supabase so the waiter/cashier portals can be
   demoed end-to-end without a database connection.
   ============================================================ */

const STUB = {
  tables: [
    { id: "t-1",  number: 1,  zone: "main",    seats: 4, status: "free",      current_order_id: null },
    { id: "t-2",  number: 2,  zone: "main",    seats: 4, status: "occupied",  current_order_id: "o-101" },
    { id: "t-3",  number: 3,  zone: "main",    seats: 2, status: "free",      current_order_id: null },
    { id: "t-4",  number: 4,  zone: "main",    seats: 2, status: "occupied",  current_order_id: "o-102" },
    { id: "t-5",  number: 5,  zone: "main",    seats: 6, status: "reserved",  current_order_id: null },
    { id: "t-6",  number: 6,  zone: "main",    seats: 4, status: "free",      current_order_id: null },
    { id: "t-7",  number: 7,  zone: "vip",     seats: 8, status: "occupied",  current_order_id: "o-103" },
    { id: "t-8",  number: 8,  zone: "vip",     seats: 6, status: "free",      current_order_id: null },
    { id: "t-9",  number: 9,  zone: "terrace", seats: 2, status: "free",      current_order_id: null },
    { id: "t-10", number: 10, zone: "terrace", seats: 4, status: "cleaning",  current_order_id: null },
    { id: "t-11", number: 11, zone: "terrace", seats: 4, status: "free",      current_order_id: null },
    { id: "t-12", number: 12, zone: "terrace", seats: 6, status: "occupied",  current_order_id: "o-104" },
  ],
  orders: [
    {
      id: "o-101",
      order_code: "ORD-4021",
      table_id: "t-2",
      table_number: 2,
      waiter_id: "w-1",
      waiter_name: "Алия Жунушева",
      status: "open",
      guests: 3,
      total: 0,
      opened_at: new Date(Date.now() - 22 * 60_000).toISOString(),
      items: [
        { id: "i-1", name: "Плов по-байхански", price: 320, quantity: 3, status: "served"    },
        { id: "i-2", name: "Айран",             price: 80,  quantity: 3, status: "served"    },
      ],
    },
    {
      id: "o-102",
      order_code: "ORD-4022",
      table_id: "t-4",
      table_number: 4,
      waiter_id: "w-2",
      waiter_name: "Тимур Абдылдаев",
      status: "preparing",
      guests: 2,
      total: 0,
      opened_at: new Date(Date.now() - 7 * 60_000).toISOString(),
      items: [
        { id: "i-3", name: "Бешбармак «Хан»", price: 1200, quantity: 1, status: "preparing" },
        { id: "i-4", name: "Каурдак на углях", price: 950, quantity: 1, status: "pending"   },
      ],
    },
    {
      id: "o-103",
      order_code: "ORD-4023",
      table_id: "t-7",
      table_number: 7,
      waiter_id: "w-1",
      waiter_name: "Алия Жунушева",
      status: "paying",
      guests: 6,
      total: 0,
      opened_at: new Date(Date.now() - 95 * 60_000).toISOString(),
      items: [
        { id: "i-5",  name: "Бешбармак «Хан»",   price: 1200, quantity: 2, status: "served" },
        { id: "i-6",  name: "Каурдак на углях",  price: 950,  quantity: 3, status: "served" },
        { id: "i-7",  name: "Айран-сорпа",       price: 680,  quantity: 6, status: "served" },
        { id: "i-8",  name: "Курут-десерт",      price: 420,  quantity: 6, status: "served" },
      ],
    },
    {
      id: "o-104",
      order_code: "ORD-4024",
      table_id: "t-12",
      table_number: 12,
      waiter_id: "w-2",
      waiter_name: "Тимур Абдылдаев",
      status: "served",
      guests: 4,
      total: 0,
      opened_at: new Date(Date.now() - 45 * 60_000).toISOString(),
      items: [
        { id: "i-9",  name: "Манты (5 шт)",  price: 280, quantity: 2, status: "served" },
        { id: "i-10", name: "Шашлык говяжий", price: 360, quantity: 4, status: "served" },
      ],
    },
  ],
};

// Compute totals from items on every read so we never desync.
function withTotal(o) {
  const total = (o.items || [])
    .filter((it) => it.status !== "cancelled")
    .reduce((s, it) => s + it.price * it.quantity, 0);
  return { ...o, total };
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/* ────────────────────────── Tables ────────────────────────── */

export async function listTables() {
  if (!supabase) return [...STUB.tables];

  const { data, error } = await supabase
    .from("tables")
    .select("*, orders!orders_table_id_fkey(id, status)")
    .order("number");

  if (error) {
    console.error("[ops.listTables]", error);
    return [];
  }
  return (data || []).map((row) => ({
    ...row,
    current_order_id:
      (row.orders || []).find((o) => o.status !== "closed" && o.status !== "cancelled")?.id || null,
  }));
}

export async function updateTableStatus(id, status) {
  if (!supabase) {
    const t = STUB.tables.find((x) => x.id === id);
    if (!t) return { ok: false, error: "not found" };
    t.status = status;
    return { ok: true, table: t };
  }

  const { data, error } = await supabase
    .from("tables")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, table: data };
}

export async function createTable(input) {
  const payload = {
    number: Number(input.number),
    zone: input.zone || "main",
    seats: Number(input.seats) || 2,
    status: "free",
    note: input.note || null,
  };
  if (!supabase) {
    const t = { id: uid("t"), ...payload, current_order_id: null };
    STUB.tables.push(t);
    return { ok: true, table: t };
  }

  const { data, error } = await supabase.from("tables").insert(payload).select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, table: data };
}

export async function updateTable(id, input) {
  const payload = {
    number: Number(input.number),
    zone: input.zone,
    seats: Number(input.seats),
    note: input.note ?? null,
  };
  if (!supabase) {
    const idx = STUB.tables.findIndex((t) => t.id === id);
    if (idx === -1) return { ok: false, error: "not found" };
    STUB.tables[idx] = { ...STUB.tables[idx], ...payload };
    return { ok: true, table: STUB.tables[idx] };
  }

  const { data, error } = await supabase
    .from("tables").update(payload).eq("id", id).select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, table: data };
}

export async function deleteTable(id) {
  if (!supabase) {
    STUB.tables = STUB.tables.filter((t) => t.id !== id);
    return { ok: true };
  }
  const { error } = await supabase.from("tables").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/* ────────────────────────── Orders ────────────────────────── */

/**
 * List orders. Pass `{ openOnly: true }` to get just active (non-closed)
 * orders. The waiter and cashier portals both want this filter.
 */
export async function listOrders({ openOnly = false } = {}) {
  if (!supabase) {
    let rows = STUB.orders.map(withTotal);
    if (openOnly) rows = rows.filter((o) => o.status !== "closed" && o.status !== "cancelled");
    return rows.sort((a, b) => b.opened_at.localeCompare(a.opened_at));
  }

  let q = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("opened_at", { ascending: false });
  if (openOnly) q = q.not("status", "in", '("closed","cancelled")');

  const { data, error } = await q;
  if (error) {
    console.error("[ops.listOrders]", error);
    return [];
  }
  return (data || []).map((row) => ({ ...row, items: row.order_items || [] }));
}

export async function getOrder(id) {
  if (!supabase) {
    const o = STUB.orders.find((x) => x.id === id);
    return o ? withTotal(o) : null;
  }
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  return { ...data, items: data.order_items || [] };
}

/**
 * Open a new order on a table. Marks table as occupied.
 */
export async function openOrder({ tableId, waiter, guests = 1 }) {
  if (!supabase) {
    const table = STUB.tables.find((t) => t.id === tableId);
    if (!table) return { ok: false, error: "table not found" };
    const code = `ORD-${4100 + STUB.orders.length}`;
    const o = {
      id: uid("o"),
      order_code: code,
      table_id: tableId,
      table_number: table.number,
      waiter_id: waiter?.id || null,
      waiter_name: waiter?.name || null,
      status: "open",
      guests,
      total: 0,
      opened_at: new Date().toISOString(),
      items: [],
    };
    STUB.orders.push(o);
    table.status = "occupied";
    table.current_order_id = o.id;
    return { ok: true, order: o };
  }

  const { data: table } = await supabase.from("tables").select("number").eq("id", tableId).single();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_code: `ORD-${Math.floor(4000 + Math.random() * 5999)}`,
      table_id: tableId,
      table_number: table?.number,
      waiter_id: waiter?.id || null,
      waiter_name: waiter?.name || null,
      guests,
      status: "open",
    })
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  await supabase.from("tables").update({ status: "occupied" }).eq("id", tableId);
  return { ok: true, order: { ...data, items: [] } };
}

export async function addOrderItem(orderId, { menuItemId, name, price, quantity = 1, notes }) {
  if (!supabase) {
    const o = STUB.orders.find((x) => x.id === orderId);
    if (!o) return { ok: false, error: "not found" };
    const item = {
      id: uid("i"),
      menu_item_id: menuItemId || null,
      name,
      price: Number(price),
      quantity: Number(quantity),
      status: "pending",
      notes: notes || null,
    };
    o.items.push(item);
    return { ok: true, item, order: withTotal(o) };
  }

  const { data, error } = await supabase
    .from("order_items")
    .insert({
      order_id: orderId,
      menu_item_id: menuItemId || null,
      name,
      price: Number(price),
      quantity: Number(quantity),
      notes: notes || null,
    })
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, item: data };
}

export async function removeOrderItem(orderId, itemId) {
  if (!supabase) {
    const o = STUB.orders.find((x) => x.id === orderId);
    if (!o) return { ok: false, error: "not found" };
    o.items = o.items.filter((it) => it.id !== itemId);
    return { ok: true, order: withTotal(o) };
  }
  const { error } = await supabase.from("order_items").delete().eq("id", itemId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateOrderStatus(orderId, status) {
  if (!supabase) {
    const o = STUB.orders.find((x) => x.id === orderId);
    if (!o) return { ok: false, error: "not found" };
    o.status = status;
    return { ok: true, order: withTotal(o) };
  }
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, order: data };
}

/**
 * Close an order: mark paid, free the table, set timestamps.
 */
export async function closeOrder(orderId, { paymentMethod, cashierId }) {
  if (!supabase) {
    const o = STUB.orders.find((x) => x.id === orderId);
    if (!o) return { ok: false, error: "not found" };
    o.status = "closed";
    o.payment_method = paymentMethod;
    o.cashier_id = cashierId;
    o.closed_at = new Date().toISOString();
    const table = STUB.tables.find((t) => t.id === o.table_id);
    if (table) {
      table.status = "cleaning";
      table.current_order_id = null;
    }
    return { ok: true, order: withTotal(o) };
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "closed",
      payment_method: paymentMethod,
      cashier_id: cashierId,
      closed_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();
  if (error) return { ok: false, error: error.message };

  if (data?.table_id) {
    await supabase.from("tables").update({ status: "cleaning" }).eq("id", data.table_id);
  }
  return { ok: true, order: data };
}

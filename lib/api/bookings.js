import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Generate a unique 4-digit booking code, e.g. BAY-4829
 */
function generateBookingId() {
  return `BAY-${Math.floor(1000 + Math.random() * 9000)}`;
}

/**
 * Submit a booking — optionally with a pre-order from the cart.
 *
 * Returns: { ok, bookingId, payload, error }
 *
 * Connects to public.bookings Supabase table, serializes cart items to JSONB
 * and maps all UI fields gracefully.
 */
export async function submitBooking(formData, cartItems = [], cartTotal) {
  const supabase = getSupabaseBrowserClient();

  const bookingId = generateBookingId();
  
  // Use cartTotal if provided, otherwise compute it dynamically
  const total = typeof cartTotal === "number" 
    ? cartTotal 
    : cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const payload = {
    booking_id: bookingId,
    name: formData.name,
    phone: formData.phone,
    date: formData.date,
    time: formData.time,
    guests: Number(formData.guests),
    table_type: formData.tableType || formData.table_type,
    event_type: formData.eventType || formData.event_type || "casual",
    requests: formData.requests || null,
    pre_order: cartItems.map((i) => ({
      id: String(i.id),
      name: i.name,
      price: Number(i.price),
      quantity: Number(i.quantity),
    })),
    total,
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    console.info("[bookings] offline stub mode — payload:", payload);
    // Mimic database latency for a consistent spinner UX in stub mode
    await new Promise((r) => setTimeout(r, 1200));
    return { ok: true, bookingId, payload };
  }

  try {
    const { error } = await supabase.from("bookings").insert(payload);
    if (error) {
      console.error("[supabase] bookings insert error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true, bookingId, payload };
  } catch (err) {
    console.error("[supabase] submitBooking critical error:", err);
    return { ok: false, error: "Системная ошибка при оформлении бронирования" };
  }
}

// Compat alias for any earlier callers
export const createBooking = submitBooking;


import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { MOCK_MENU } from "@/lib/mockData";

/**
 * Map database columns to the properties expected by DishGrid and DishCard.
 * Ensures the ID is always cast to String and price to Number.
 */
export function mapMenuItem(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    imagePlaceholder: row.imagePlaceholder || row.image_url || null,
    active: row.active,
  };
}

/**
 * Fetch all active menu items from Supabase.
 * Falls back to MOCK_MENU on error or stub mode.
 */
export async function fetchMenu() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    console.warn("[supabase] menu running in offline/stub mode.");
    return MOCK_MENU;
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("active", true)
    .order("category");

  if (error) {
    console.error("[supabase] fetchMenu error:", error);
    return MOCK_MENU;
  }

  return (data || []).map(mapMenuItem);
}


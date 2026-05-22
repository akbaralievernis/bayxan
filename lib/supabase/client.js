import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Export the singleton supabase instance
export const supabase = (url && key) ? createClient(url, key) : null;

// Retain getSupabaseBrowserClient for backwards-compatibility with bookings and menu APIs
export function getSupabaseBrowserClient() {
  if (!supabase) {
    console.warn(
      "[supabase] env not configured — running in offline/stub mode."
    );
  }
  return supabase;
}

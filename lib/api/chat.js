import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const LOCAL_KEY = "bayhan_chat_thread";

function readLocal() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(messages) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(messages));
}

export async function fetchMessages(threadId) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return readLocal();

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[chat] fetchMessages", error);
    return readLocal();
  }
  return data ?? [];
}

export async function sendMessage({ threadId, body, sender = "guest" }) {
  const msg = {
    id: crypto.randomUUID(),
    thread_id: threadId,
    sender,
    body,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const all = [...readLocal(), msg];
    writeLocal(all);
    return msg;
  }

  const { error } = await supabase.from("chat_messages").insert(msg);
  if (error) console.error("[chat] sendMessage", error);
  return msg;
}

export function subscribeMessages(threadId, onMessage) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`chat:${threadId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `thread_id=eq.${threadId}`,
      },
      (payload) => onMessage(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

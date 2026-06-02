"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { fetchMessages, sendMessage, subscribeMessages } from "@/lib/api/chat";
import { cn } from "@/lib/utils";
import { RESTAURANT } from "@/lib/constants";

const WELCOME = {
  id: "welcome",
  sender: "host",
  body: `Добро пожаловать в ${RESTAURANT.name}. Чем мы можем вам помочь — забронировать стол, посмотреть меню или что-то другое?`,
  created_at: new Date().toISOString(),
};

export default function ChatWidget() {
  const {
    threadId, open, unread, messages,
    init, openChat, closeChat, toggleChat,
    pushMessage, setMessages,
  } = useChatStore();

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollerRef = useRef(null);
  const inputRef = useRef(null);

  // First mount — generate threadId + seed welcome
  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!threadId) return;
    if (messages.length === 0) {
      setMessages([WELCOME]);
    }
  }, [threadId, messages.length, setMessages]);

  // Hydrate from Supabase + subscribe (no-op if env missing)
  useEffect(() => {
    if (!threadId) return;
    let unsub = () => {};
    (async () => {
      const remote = await fetchMessages(threadId);
      if (remote && remote.length) setMessages(remote);
      unsub = subscribeMessages(threadId, (msg) => pushMessage(msg));
    })();
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  // Autoscroll on new message / open
  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  async function handleSend(e) {
    e?.preventDefault();
    const body = text.trim();
    if (!body || sending) return;

    setSending(true);
    setText("");

    const local = {
      id: `local-${Date.now()}`,
      thread_id: threadId,
      sender: "guest",
      body,
      created_at: new Date().toISOString(),
    };
    pushMessage(local);

    try {
      await sendMessage({ threadId, body, sender: "guest" });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Trigger button — fixed bottom-right, premium gold gradient */}
      <motion.button
        type="button"
        aria-label={open ? "Закрыть чат" : "Открыть чат"}
        onClick={toggleChat}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 240, damping: 18 }}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        className={cn(
          "group fixed z-50 bottom-5 right-5 sm:bottom-7 sm:right-7",
          "w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full",
          "grid place-items-center",
          "bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600",
          "text-stone-900",
          "shadow-gold hover:shadow-gold-lg transition-shadow",
          "ring-1 ring-white/40 dark:ring-gold-200/30",
          "no-tap-highlight"
        )}
      >
        {/* Soft inner sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(120% 80% at 30% 20%, rgba(255,255,255,0.45) 0%, transparent 55%)",
          }}
        />

        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative"
            >
              <X size={22} strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative"
            >
              <MessageCircle size={22} strokeWidth={2.25} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {unread > 0 && !open && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center border-2 border-white dark:border-[#120D0A] shadow-lg"
            >
              {unread > 9 ? "9+" : unread}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Subtle ring pulse — only when no unread, fewer distractions */}
        {unread === 0 && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border border-gold-300/50 dark:border-gold-400/40 animate-ping opacity-40"
          />
        )}
      </motion.button>

      {/* Pop-up window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={cn(
              "fixed z-50",
              "bottom-24 right-3 sm:bottom-28 sm:right-7",
              "w-[min(94vw,380px)] h-[min(72vh,560px)]",
              "flex flex-col overflow-hidden rounded-3xl",
              "glass-panel gold-ring"
            )}
            role="dialog"
            aria-label="Bayhan chat"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-stone-200/60 dark:border-gold-500/20 bg-white/60 dark:bg-stone-900/60">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 grid place-items-center font-display text-stone-900 shadow-gold-soft">
                    B
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white dark:border-stone-900" />
                </div>
                <div className="leading-tight">
                  <div className="text-stone-900 dark:text-[#FDF6E2] text-sm font-medium">Консьерж {RESTAURANT.name}</div>
                  <div className="text-stone-500 dark:text-stone-400 text-[11px] inline-flex items-center gap-1">
                    <Sparkles size={10} className="text-amber-600 dark:text-gold-400" /> обычно отвечает в течение минуты
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={closeChat}
                aria-label="Свернуть чат"
                className="w-8 h-8 grid place-items-center rounded-full text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-gold-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
              >
                <X size={16} />
              </button>
            </header>

            {/* Messages */}
            <div
              ref={scrollerRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 bg-gradient-to-b from-white/30 to-stone-50/40 dark:from-stone-900/30 dark:to-[#120D0A]/60"
            >
              {messages.map((m) => (
                <Bubble key={m.id} message={m} />
              ))}
            </div>

            {/* Composer */}
            <form
              onSubmit={handleSend}
              className="px-3 py-3 border-t border-stone-200/60 dark:border-gold-500/20 bg-white/60 dark:bg-stone-900/60 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Напишите сообщение…"
                className={cn(
                  "flex-1 bg-white/80 dark:bg-stone-800/70 text-stone-900 dark:text-[#FDF6E2] text-sm rounded-full px-4 py-2.5",
                  "border border-stone-200 dark:border-stone-700/60 focus:border-gold-400 dark:focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/20",
                  "placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-colors"
                )}
              />
              <motion.button
                type="submit"
                disabled={!text.trim() || sending}
                whileHover={text.trim() ? { scale: 1.05 } : undefined}
                whileTap={text.trim() ? { scale: 0.92 } : undefined}
                className={cn(
                  "shrink-0 w-10 h-10 rounded-full grid place-items-center transition-all",
                  text.trim()
                    ? "bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 text-stone-900 shadow-gold-soft hover:shadow-gold"
                    : "bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed"
                )}
                aria-label="Отправить сообщение"
              >
                <Send size={16} strokeWidth={2.4} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ message }) {
  const mine = message.sender === "guest";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn("flex w-full", mine ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[78%] px-3.5 py-2 rounded-2xl text-sm leading-snug break-words",
          mine
            ? "bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 text-stone-900 rounded-br-md shadow-gold-soft"
            : "bg-white/85 dark:bg-stone-800/80 text-stone-800 dark:text-stone-100 rounded-bl-md border border-stone-200/70 dark:border-stone-700/50"
        )}
      >
        {message.body}
        <div
          className={cn(
            "mt-1 text-[10px] tracking-wide",
            mine ? "text-stone-900/60" : "text-stone-500 dark:text-stone-400"
          )}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  );
}

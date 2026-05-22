"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

export const useChatStore = create(
  persist(
    (set, get) => ({
      threadId: null,
      open: false,
      unread: 0,
      messages: [],

      init: () => {
        if (!get().threadId) set({ threadId: uid() });
      },

      openChat: () => set({ open: true, unread: 0 }),
      closeChat: () => set({ open: false }),
      toggleChat: () =>
        set((s) => ({ open: !s.open, unread: !s.open ? 0 : s.unread })),

      pushMessage: (msg) =>
        set((s) => ({
          messages: [...s.messages, msg],
          unread: !s.open && msg.sender !== "guest" ? s.unread + 1 : s.unread,
        })),

      setMessages: (messages) => set({ messages }),
      clearUnread: () => set({ unread: 0 }),
    }),
    {
      name: "bayhan-chat",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        threadId: s.threadId,
        messages: s.messages,
        unread: s.unread,
      }),
    }
  )
);

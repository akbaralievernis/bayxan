"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      // ── state ──────────────────────────────────────────────
      items: [],     // [{ id, name, price, imagePlaceholder, quantity }]
      isOpen: false, // drawer open/close

      // ── drawer controls ────────────────────────────────────
      openDrawer:   () => set({ isOpen: true }),
      closeDrawer:  () => set({ isOpen: false }),
      toggleDrawer: () => set((s) => ({ isOpen: !s.isOpen })),

      // ── cart actions ───────────────────────────────────────
      addItem: (dish) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === dish.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: dish.id,
                name: dish.name,
                price: dish.price,
                imagePlaceholder: dish.imagePlaceholder,
                quantity: 1,
              },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          };
        }),

      increment: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),

      decrement: (id) =>
        set((state) => {
          const target = state.items.find((i) => i.id === id);
          if (!target) return state;
          if (target.quantity <= 1) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      // ── derived getters (call as fns from components) ──────
      cartTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      cartCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "bayhan-cart",
      storage: createJSONStorage(() => localStorage),
      // Only persist the cart contents — drawer open-state is per-session.
      partialize: (state) => ({ items: state.items }),
      version: 1,
    }
  )
);

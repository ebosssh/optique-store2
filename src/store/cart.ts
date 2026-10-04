"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  colorHex: string;
  imageEmoji: string;
  imageUrl: string | null;
  diopter: string | null;
  quantity: number;
};

function sameLine(a: Pick<CartItem, "productId" | "diopter">, b: Pick<CartItem, "productId" | "diopter">): boolean {
  return a.productId === b.productId && a.diopter === b.diopter;
}

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (productId: string, diopter?: string | null) => void;
  setQuantity: (productId: string, quantity: number, diopter?: string | null) => void;
  clear: () => void;
  totalCount: () => number;
  totalPrice: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => sameLine(i, item));
          if (existing) {
            return {
              items: state.items.map((i) => (sameLine(i, item) ? { ...i, quantity: i.quantity + quantity } : i)),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },
      remove: (productId, diopter = null) =>
        set((state) => ({ items: state.items.filter((i) => !sameLine(i, { productId, diopter })) })),
      setQuantity: (productId, quantity, diopter = null) =>
        set((state) => ({
          items: state.items
            .map((i) => (sameLine(i, { productId, diopter }) ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    }),
    { name: "optikazir-cart" }
  )
);

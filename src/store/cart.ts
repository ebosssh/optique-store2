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
  sphere: string | null;
  cylinder: string | null;
  axis: string | null;
  quantity: number;
};

type LineKey = Pick<CartItem, "productId" | "diopter" | "sphere" | "cylinder" | "axis">;

function sameLine(a: LineKey, b: LineKey): boolean {
  return a.productId === b.productId && a.diopter === b.diopter && a.sphere === b.sphere && a.cylinder === b.cylinder && a.axis === b.axis;
}

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (line: LineKey) => void;
  setQuantity: (line: LineKey, quantity: number) => void;
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
      remove: (line) => set((state) => ({ items: state.items.filter((i) => !sameLine(i, line)) })),
      setQuantity: (line, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (sameLine(i, line) ? { ...i, quantity } : i)).filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    }),
    { name: "optikazir-cart" }
  )
);

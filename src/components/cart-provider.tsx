"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  size: string | null;
  color: string | null;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  hydrated: boolean;
  addItem: (slug: string, size: string | null, color: string | null, qty: number) => void;
  updateQty: (slug: string, size: string | null, color: string | null, qty: number) => void;
  removeItem: (slug: string, size: string | null, color: string | null) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "eyc-cart-v1";

const sameLine = (a: CartItem, slug: string, size: string | null, color: string | null) =>
  a.slug === slug && a.size === size && a.color === color;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CartItem>[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed
              .filter(
                (i) =>
                  typeof i?.slug === "string" &&
                  typeof i?.qty === "number" &&
                  i.qty > 0,
              )
              .map((i) => ({
                slug: i.slug as string,
                size: i.size ?? null,
                color: i.color ?? null,
                qty: i.qty as number,
              })),
          );
        }
      }
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable — cart still works in-memory
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (slug: string, size: string | null, color: string | null, qty: number) => {
      setItems((prev) => {
        const idx = prev.findIndex((i) => sameLine(i, slug, size, color));
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + qty, 99) };
          return next;
        }
        return [...prev, { slug, size, color, qty }];
      });
    },
    [],
  );

  const updateQty = useCallback(
    (slug: string, size: string | null, color: string | null, qty: number) => {
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => !sameLine(i, slug, size, color))
          : prev.map((i) =>
              sameLine(i, slug, size, color) ? { ...i, qty: Math.min(qty, 99) } : i,
            ),
      );
    },
    [],
  );

  const removeItem = useCallback((slug: string, size: string | null, color: string | null) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, slug, size, color)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      count: items.reduce((n, i) => n + i.qty, 0),
      addItem,
      updateQty,
      removeItem,
      clear,
    }),
    [items, hydrated, addItem, updateQty, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

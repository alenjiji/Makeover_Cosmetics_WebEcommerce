"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { addItem, fetchCart, removeItem, saveNote, setItemQuantity } from "@/app/(site)/cart/actions";
import { localCart, type StoredLine } from "@/lib/commerce/local-cart";
import type { Cart, CartResult } from "@/lib/commerce/types";

type CartContext = {
  cart: Cart;
  /** True until the stored cart has been read on the client. */
  loading: boolean;
  pending: boolean;
  error: string | null;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (slug: string, quantity?: number) => Promise<boolean>;
  setQuantity: (lineId: string, quantity: number) => void;
  remove: (lineId: string) => void;
  /** Saves the order note (Shopify mode). Resolves true when saved. */
  setNote: (note: string) => Promise<boolean>;
  clear: () => void;
  /** Shopify customer account page, when the store is connected. */
  accountUrl?: string;
};

const Context = createContext<CartContext | null>(null);

const LOCAL_KEY = "mo-cart";
const CART_ID_KEY = "mo-shopify-cart";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked (private mode): the cart still works for this visit.
  }
};

/**
 * Cart state for the whole site. In Shopify mode the cart lives in Shopify and only its id
 * is kept in the browser; until Shopify is connected the lines themselves are kept here.
 */
export function CartProvider({
  shopify,
  accountUrl,
  children,
}: {
  shopify: boolean;
  accountUrl?: string;
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart>({ mode: shopify ? "shopify" : "local", lines: [], totalQuantity: 0 });
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load the stored cart, and follow changes made in other tabs.
  useEffect(() => {
    const load = async () => {
      if (shopify) {
        const id = read<string | null>(CART_ID_KEY, null);
        const remote = id ? await fetchCart(id) : null;
        // A missing cart has expired or been checked out: start afresh.
        if (id && !remote) write(CART_ID_KEY, null);
        setCart(remote ?? { mode: "shopify", lines: [], totalQuantity: 0 });
      } else {
        setCart(localCart(read<StoredLine[]>(LOCAL_KEY, [])));
      }
      setLoading(false);
    };
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_KEY || e.key === CART_ID_KEY) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [shopify]);

  const saveLocal = useCallback((lines: StoredLine[]) => {
    write(LOCAL_KEY, lines);
    setCart(localCart(lines));
  }, []);

  const apply = useCallback((result: CartResult) => {
    if (result.ok) {
      write(CART_ID_KEY, result.cart.id ?? null);
      setCart(result.cart);
      setError(null);
      return true;
    }
    setError(result.error);
    return false;
  }, []);

  const add = useCallback(
    (slug: string, quantity = 1) =>
      new Promise<boolean>((resolve) => {
        setError(null);
        if (!shopify) {
          const lines = read<StoredLine[]>(LOCAL_KEY, []);
          const existing = lines.find((l) => l.slug === slug);
          saveLocal(
            existing
              ? lines.map((l) => (l.slug === slug ? { ...l, quantity: Math.min(99, l.quantity + quantity) } : l))
              : [...lines, { slug, quantity }],
          );
          resolve(true);
          return;
        }
        startTransition(async () => {
          resolve(apply(await addItem(read<string | null>(CART_ID_KEY, null), slug, quantity)));
        });
      }),
    [shopify, saveLocal, apply],
  );

  const setQuantity = useCallback(
    (lineId: string, quantity: number) => {
      setError(null);
      if (!shopify) {
        const lines = read<StoredLine[]>(LOCAL_KEY, []);
        saveLocal(
          quantity <= 0
            ? lines.filter((l) => l.slug !== lineId)
            : lines.map((l) => (l.slug === lineId ? { ...l, quantity: Math.min(99, quantity) } : l)),
        );
        return;
      }
      const id = read<string | null>(CART_ID_KEY, null);
      if (!id) return;
      startTransition(async () => {
        apply(await setItemQuantity(id, lineId, quantity));
      });
    },
    [shopify, saveLocal, apply],
  );

  const remove = useCallback(
    (lineId: string) => {
      setError(null);
      if (!shopify) {
        saveLocal(read<StoredLine[]>(LOCAL_KEY, []).filter((l) => l.slug !== lineId));
        return;
      }
      const id = read<string | null>(CART_ID_KEY, null);
      if (!id) return;
      startTransition(async () => {
        apply(await removeItem(id, lineId));
      });
    },
    [shopify, saveLocal, apply],
  );

  const setNote = useCallback(
    (note: string) =>
      new Promise<boolean>((resolve) => {
        const id = read<string | null>(CART_ID_KEY, null);
        if (!shopify || !id) return resolve(false);
        startTransition(async () => {
          resolve(apply(await saveNote(id, note)));
        });
      }),
    [shopify, apply],
  );

  const clear = useCallback(() => {
    if (shopify) {
      write(CART_ID_KEY, null);
      setCart({ mode: "shopify", lines: [], totalQuantity: 0 });
    } else {
      saveLocal([]);
    }
  }, [shopify, saveLocal]);

  const value = useMemo<CartContext>(
    () => ({
      cart,
      loading,
      pending,
      error,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      add,
      setQuantity,
      remove,
      setNote,
      clear,
      accountUrl,
    }),
    [cart, loading, pending, error, drawerOpen, add, setQuantity, remove, setNote, clear, accountUrl],
  );

  return (
    <Context value={value}>
      {children}
      {/* Announce cart changes to screen readers. */}
      <p aria-live="polite" className="sr-only">
        {loading ? "" : `${cart.totalQuantity} ${cart.totalQuantity === 1 ? "item" : "items"} in your cart`}
      </p>
    </Context>
  );
}

export function useCart() {
  const value = useContext(Context);
  if (!value) throw new Error("useCart must be used inside <CartProvider>.");
  return value;
}

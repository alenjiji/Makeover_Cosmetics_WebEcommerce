"use server";

import {
  addToCart,
  getCart,
  removeCartLine,
  setCartNote,
  ShopifyError,
  shopifyEnabled,
  updateCartLine,
} from "@/lib/commerce/shopify";
import type { Cart, CartResult } from "@/lib/commerce/types";

/* Shopify cart operations for the client cart (Shopify mode only; the local cart never calls these). */

const MAX_QTY = 99;

async function run(action: () => Promise<Cart>): Promise<CartResult> {
  if (!shopifyEnabled) return { ok: false, error: "Online ordering isn't available yet." };
  try {
    return { ok: true, cart: await action() };
  } catch (error) {
    console.error("[cart]", error);
    return {
      ok: false,
      error: error instanceof ShopifyError ? error.message : "We couldn't update your cart. Please try again.",
    };
  }
}

const quantity = (value: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(value)));

export async function fetchCart(cartId: string): Promise<Cart | null> {
  if (!shopifyEnabled || !cartId) return null;
  try {
    return await getCart(cartId);
  } catch (error) {
    console.error("[cart]", error);
    return null;
  }
}

export async function addItem(cartId: string | null, slug: string, qty = 1): Promise<CartResult> {
  return run(() => addToCart(cartId, slug, Math.max(1, quantity(qty))));
}

export async function setItemQuantity(cartId: string, lineId: string, qty: number): Promise<CartResult> {
  return run(() => updateCartLine(cartId, lineId, quantity(qty)));
}

export async function removeItem(cartId: string, lineId: string): Promise<CartResult> {
  return run(() => removeCartLine(cartId, lineId));
}

export async function saveNote(cartId: string, note: string): Promise<CartResult> {
  return run(() => setCartNote(cartId, note.trim().slice(0, 1000)));
}

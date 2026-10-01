"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const CartContext = createContext(null);

// Only ids and quantities are stored: food images are base64 data URLs,
// too large for localStorage. Look food details up from the menu instead.
const STORAGE_KEY = "cart";

const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const getSnapshot = () => localStorage.getItem(STORAGE_KEY);

const getServerSnapshot = () => undefined;

function parseItems(raw) {
  try {
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items)
      ? items.filter((item) => item?.foodId && item.quantity > 0)
      : [];
  } catch {
    return [];
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((listener) => listener());
}

function addToCart(foodId, quantity = 1) {
  const items = parseItems(localStorage.getItem(STORAGE_KEY));
  const existing = items.find((item) => item.foodId === foodId);
  saveItems(
    existing
      ? items.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      : [...items, { foodId, quantity }],
  );
}

// A quantity of 0 removes the food from the cart.
function updateQuantity(foodId, quantity) {
  const items = parseItems(localStorage.getItem(STORAGE_KEY));
  saveItems(
    quantity > 0
      ? items.map((item) =>
          item.foodId === foodId ? { ...item, quantity } : item,
        )
      : items.filter((item) => item.foodId !== foodId),
  );
}

function clearCart() {
  saveItems([]);
}

export function CartProvider({ children }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = parseItems(stored);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, count, addToCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

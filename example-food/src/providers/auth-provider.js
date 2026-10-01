"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import {
  getErrorMessage,
  loginUser,
  saveDeliveryAddress,
  signupUser,
} from "@/app/_api/api";

const AuthContext = createContext(null);

const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

const getSnapshot = () =>
  localStorage.getItem("token") ? localStorage.getItem("user") : null;

const getServerSnapshot = () => undefined;

function parseUser(raw) {
  try {
    const user = raw ? JSON.parse(raw) : null;
    return user && typeof user === "object" ? user : null;
  } catch {
    return null;
  }
}

function saveSession({ user, token }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  notify();
}

function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  notify();
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  notify();
}

export function AuthProvider({ children }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = stored !== undefined;
  const user = parseUser(stored);

  async function login(email, password) {
    try {
      const data = await loginUser(email, password);
      saveSession(data);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async function signup(email, password) {
    try {
      await signupUser(email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  // address: { street, details, lat, lng }
  async function saveAddress(address) {
    try {
      saveUser(await saveDeliveryAddress(address));
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, login, signup, saveAddress, logout: clearSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

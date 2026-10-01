"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function showToast(message) {
    clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = setTimeout(() => setToast(null), 2500);
  }

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-24 z-70 flex justify-center px-4"
      >
        {toast ? (
          <div
            key={toast.id}
            className="flex animate-in items-center gap-2.5 rounded-lg border border-white/70 bg-zinc-900 px-6 py-3 text-white shadow-lg fade-in slide-in-from-top-2"
          >
            <Check className="size-4" />
            {toast.message}
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

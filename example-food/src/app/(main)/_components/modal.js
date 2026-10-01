"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";

const backdropClass =
  "fixed inset-0 bg-black/50 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0";

// Centered white dialog. Pass a max-w-* class to size it.
// It sits a layer above the Sheet (z-60 vs z-50) because a modal opened from
// inside the sheet is portaled next to it, where DOM order isn't guaranteed.
// forceRender keeps the backdrop when nested, so the sheet is dimmed too.
export function Modal({ open, onOpenChange, className = "", children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop forceRender className={`z-60 ${backdropClass}`} />
        <Dialog.Popup
          className={`fixed top-1/2 left-1/2 z-60 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[20px] bg-white p-6 text-zinc-900 outline-none transition-[opacity,scale] duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 ${className}`}
        >
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Panel that slides in from the right edge.
export function Sheet({ open, onOpenChange, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={`z-50 ${backdropClass}`} />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-full max-w-134 flex-col gap-6 overflow-y-auto bg-neutral-700 p-4 outline-none transition-transform duration-300 data-ending-style:translate-x-full data-starting-style:translate-x-full sm:rounded-l-[20px] sm:p-8">
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ModalTitle({ className = "", children }) {
  return <Dialog.Title className={className}>{children}</Dialog.Title>;
}

const closeVariants = {
  light: "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100",
  muted: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  dark: "border border-white/50 text-white hover:bg-white/10",
};

export function CloseButton({ variant = "light", className = "" }) {
  return (
    <Dialog.Close
      aria-label="Close"
      className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors ${closeVariants[variant]} ${className}`}
    >
      <X className="size-4" />
    </Dialog.Close>
  );
}

import { ChefHat } from "lucide-react";
import { Modal, ModalTitle } from "./modal";

export function OrderSuccessDialog({ open, onOpenChange, onBackHome }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-xl">
      <div className="flex flex-col items-center gap-6 py-2">
        <ModalTitle className="text-center text-2xl font-semibold">
          Your order has been successfully placed !
        </ModalTitle>

        {/* Logo balloon on a string. */}
        <div aria-hidden className="flex flex-col items-center">
          <div className="flex size-26 items-center justify-center rounded-full bg-red-500">
            <ChefHat className="size-12 text-white" />
          </div>
          <svg width="40" height="96" viewBox="0 0 40 96" className="-mt-1 text-zinc-900">
            <path d="M16 0 L24 0 L20 8 Z" fill="#ef4444" />
            <path
              d="M20 8 C 6 32, 34 56, 18 96"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <button
          type="button"
          onClick={onBackHome}
          className="h-10 rounded-full bg-zinc-100 px-10 text-sm font-medium transition-colors hover:bg-zinc-200"
        >
          Back to home
        </button>
      </div>
    </Modal>
  );
}

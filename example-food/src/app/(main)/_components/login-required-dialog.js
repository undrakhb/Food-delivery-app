import Link from "next/link";
import { CloseButton, Modal, ModalTitle } from "./modal";

const linkClass =
  "flex h-10 items-center justify-center rounded-md text-sm font-medium transition-colors";

export function LoginRequiredDialog({ open, onOpenChange }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-md">
      <ModalTitle className="px-10 pt-1 text-center text-2xl font-semibold">
        You need to log in first
      </ModalTitle>
      <CloseButton variant="muted" className="absolute top-6 right-6" />

      <div className="mt-12 grid grid-cols-2 gap-4">
        <Link
          href="/login"
          className={`${linkClass} bg-zinc-900 text-white hover:bg-zinc-800`}
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className={`${linkClass} border border-zinc-200 hover:bg-zinc-100`}
        >
          Sign up
        </Link>
      </div>
    </Modal>
  );
}

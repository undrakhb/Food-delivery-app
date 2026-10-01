"use client";

import { useRouter } from "next/navigation";
import { Popover } from "@base-ui/react/popover";
import { User } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function AccountMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleSignOut() {
    logout();
    router.push("/login");
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Account"
        className="flex size-9 items-center justify-center rounded-full bg-red-500 text-white outline-none transition-colors hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-300"
      >
        <User className="size-4" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="end" className="z-50">
          <Popover.Popup className="flex w-56 flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg outline-none transition-[opacity,scale] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <p className="truncate text-sm font-semibold text-zinc-900">{user?.email}</p>
            <button
              type="button"
              onClick={handleSignOut}
              className="h-9 rounded-full bg-zinc-100 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Sign out
            </button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

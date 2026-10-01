"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { AddressDialog } from "../_features/address-dialog";
import { CartSheet } from "../_features/cart-sheet";
import { LoginRequiredDialog } from "./login-required-dialog";
import { Logo } from "./logo";

const iconButtonClass =
  "flex size-9 items-center justify-center rounded-full transition-colors";

export function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const street = user?.address?.street;

  return (
    <header className="bg-zinc-900">
      <div className="mx-auto flex h-17 w-full max-w-324 items-center justify-between px-4">
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`Delivery address: ${street ?? "Add location"}`}
            aria-haspopup="dialog"
            onClick={() => (user ? setAddressOpen(true) : setLoginOpen(true))}
            className="flex h-9 min-w-0 items-center gap-1 rounded-full bg-white px-3 text-xs transition-colors hover:bg-zinc-200"
          >
            <MapPin className="size-5 shrink-0 text-red-500" />
            <span className="hidden shrink-0 text-red-500 sm:inline">Delivery address:</span>
            <span className="hidden max-w-48 truncate text-zinc-500 sm:inline">
              {street ?? "Add Location"}
            </span>
            <ChevronRight className="size-5 shrink-0 text-zinc-500" />
          </button>

          <button
            type="button"
            aria-label={count ? `Cart, ${count} items` : "Cart"}
            aria-haspopup="dialog"
            onClick={() => setCartOpen(true)}
            className={`relative ${iconButtonClass} bg-white text-zinc-900 hover:bg-zinc-200`}
          >
            <ShoppingCart className="size-4" />
            {count ? (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-label="Account"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className={`${iconButtonClass} bg-red-500 text-white hover:bg-red-600`}
              >
                <User className="size-4" />
              </button>

              {menuOpen ? (
                <div className="absolute top-11 right-0 z-20 flex w-52 flex-col gap-2 rounded-xl bg-white p-4 shadow-lg">
                  <p className="truncate text-sm font-semibold text-zinc-900">
                    {user.email}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="h-9 rounded-full bg-zinc-100 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/login"
              aria-label="Log in"
              className={`${iconButtonClass} bg-red-500 text-white hover:bg-red-600`}
            >
              <User className="size-4" />
            </Link>
          )}
        </div>
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <AddressDialog open={addressOpen} onOpenChange={setAddressOpen} />
      <LoginRequiredDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </header>
  );
}

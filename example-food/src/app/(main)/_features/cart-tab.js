"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { createOrder, getErrorMessage } from "@/app/_api/api";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { CartItem, CartItemSkeleton } from "../_components/cart-item";
import { EmptyState } from "../_components/empty-state";
import { SheetCard, sheetTitleClass } from "../_components/sheet-card";
import { AddressDialog } from "./address-dialog";

// Keep in sync with SHIPPING_FEE on the server.
const SHIPPING_FEE = 0.99;

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}

export function CartTab({
  foods,
  foodsError,
  onNeedLogin,
  onOrderPlaced,
}) {
  const { user } = useAuth();
  const { items, updateQuantity, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [addressOpen, setAddressOpen] = useState(false);
  // Set when Checkout opened the address dialog, so saving goes on to
  // place the order instead of leaving the customer back in the cart.
  const [checkoutAfterAddress, setCheckoutAfterAddress] = useState(false);
  const address = user?.address;

  // The cart only stores ids; details come from the menu. Foods deleted
  // from the menu since they were added are left out.
  const foodsById = new Map((foods ?? []).map((food) => [food._id, food]));
  const cartItems = items
    .map((item) => ({ ...item, food: foodsById.get(item.foodId) }))
    .filter((item) => item.food);
  const itemsTotal = cartItems.reduce(
    (sum, { food, quantity }) => sum + food.price * quantity,
    0,
  );
  const hasItems = cartItems.length > 0;

  function openAddress(thenCheckout) {
    setCheckoutAfterAddress(thenCheckout);
    setAddressOpen(true);
  }

  function handleCheckout() {
    if (!user) {
      onNeedLogin();
      return;
    }
    if (!address) {
      openAddress(true);
      return;
    }
    placeOrder(address);
  }

  // Takes the address as an argument: right after it's saved, `user` in
  // this render doesn't have it yet.
  async function placeOrder(deliveryAddress) {
    setSubmitting(true);
    setError("");
    try {
      await createOrder({
        foodOrderItems: cartItems.map(({ foodId, quantity }) => ({
          food: foodId,
          quantity,
        })),
        deliveryAddress: [deliveryAddress.street, deliveryAddress.details]
          .filter(Boolean)
          .join(", "),
        deliveryLocation: { lat: deliveryAddress.lat, lng: deliveryAddress.lng },
      });
      clearCart();
      onOrderPlaced();
    } catch (err) {
      if (err?.response?.status === 401) {
        onNeedLogin();
      } else {
        setError(getErrorMessage(err, "Couldn't place your order. Please try again."));
      }
    } finally {
      setSubmitting(false);
    }
  }

  let content;
  if (items.length > 0 && !foods && foodsError) {
    content = (
      <p className="py-8 text-center text-sm text-zinc-500">
        Couldn&apos;t load your cart. Please try again later.
      </p>
    );
  } else if (items.length > 0 && !foods) {
    content = (
      <ul className="divide-y divide-dashed divide-zinc-300">
        {items.map((item) => (
          <CartItemSkeleton key={item.foodId} />
        ))}
      </ul>
    );
  } else if (!hasItems) {
    content = (
      <EmptyState title="Your cart is empty">
        Hungry? 🍔 Add some delicious dishes to your cart and satisfy your
        cravings!
      </EmptyState>
    );
  } else {
    content = (
      <>
        <ul className="divide-y divide-dashed divide-zinc-300">
          {cartItems.map(({ food, quantity }) => (
            <CartItem
              key={food._id}
              food={food}
              quantity={quantity}
              onQuantityChange={(value) => updateQuantity(food._id, value)}
              onRemove={() => updateQuantity(food._id, 0)}
            />
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          <h4 className={sheetTitleClass}>Delivery location</h4>
          {address ? (
            <div className="flex items-start gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-red-500" />
              <div className="min-w-0 flex-1">
                <p>{address.street}</p>
                {address.details ? (
                  <p className="text-zinc-500">{address.details}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => openAddress(false)}
                className="shrink-0 font-medium underline underline-offset-4"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => (user ? openAddress(false) : onNeedLogin())}
              className="flex h-10 items-center justify-center gap-2 rounded-md border border-dashed border-zinc-300 text-sm font-medium transition-colors hover:bg-zinc-100"
            >
              <MapPin className="size-4 text-red-500" />
              Add delivery address
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <SheetCard title="My cart" className={hasItems ? "" : "flex-1"}>
        {content}
      </SheetCard>

      <SheetCard title="Payment info">
        <dl className="flex flex-col gap-2">
          <Row label="Items" value={hasItems ? formatPrice(itemsTotal) : "-"} />
          <Row label="Shipping" value={hasItems ? formatPrice(SHIPPING_FEE) : "-"} />
        </dl>
        <dl className="border-t border-dashed border-zinc-300 pt-5">
          <Row
            label="Total"
            value={hasItems ? formatPrice(itemsTotal + SHIPPING_FEE) : "-"}
          />
        </dl>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={!hasItems || submitting}
          className="h-11 rounded-full bg-red-500 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-500/20"
        >
          {submitting ? "Placing order..." : "Checkout"}
        </button>
      </SheetCard>

      {/* Inside the sheet, so it counts as a nested dialog. */}
      <AddressDialog
        open={addressOpen}
        onOpenChange={setAddressOpen}
        onSaved={(saved) => {
          if (checkoutAfterAddress) placeOrder(saved);
        }}
      />
    </>
  );
}

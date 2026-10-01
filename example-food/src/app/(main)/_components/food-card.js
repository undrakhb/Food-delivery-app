"use client";

import { Check, Plus } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/providers/cart-provider";

export function FoodCard({ food, onSelect }) {
  const { items } = useCart();
  const inCart = items.some((item) => item.foodId === food._id);

  // Clicking anywhere on the card selects it; the + button is the keyboard
  // target and its click bubbles up here.
  return (
    <article
      onClick={() => onSelect(food)}
      className="flex cursor-pointer flex-col gap-5 rounded-[20px] bg-white p-4"
    >
      <div className="relative h-52.5 overflow-hidden rounded-xl bg-neutral-100">
        {food.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={food.image}
            alt={food.name}
            className="size-full object-cover"
          />
        ) : null}
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label={
            inCart
              ? `${food.name} is in your cart, add more`
              : `Add ${food.name} to cart`
          }
          className={`absolute right-5 bottom-5 flex size-11 items-center justify-center rounded-full shadow-sm transition-colors ${
            inCart
              ? "bg-zinc-900 text-white hover:bg-zinc-800"
              : "bg-white text-red-500 hover:bg-red-50"
          }`}
        >
          {inCart ? <Check className="size-4" /> : <Plus className="size-4" />}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-2xl font-semibold text-red-500">
            {food.name}
          </h3>
          <span className="shrink-0 text-lg font-semibold text-zinc-900">
            {formatPrice(food.price)}
          </span>
        </div>
        {food.ingredients?.length ? (
          <p className="text-sm text-zinc-900">{food.ingredients.join(", ")}</p>
        ) : null}
      </div>
    </article>
  );
}

export function FoodCardSkeleton() {
  return (
    <div className="flex flex-col gap-5 rounded-[20px] bg-white p-4">
      <div className="h-52.5 animate-pulse rounded-xl bg-neutral-200" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="h-8 w-1/2 animate-pulse rounded-md bg-neutral-200" />
          <div className="h-7 w-16 animate-pulse rounded-md bg-neutral-200" />
        </div>
        <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
      </div>
    </div>
  );
}

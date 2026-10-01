"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/providers/toast-provider";
import { CloseButton, Modal, ModalTitle } from "../_components/modal";
import { QuantityStepper } from "../_components/quantity-stepper";

export function FoodDialog({ food, open, onOpenChange }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-206">
      {/* Remounts on every open, so the quantity starts back at 1. */}
      <FoodDialogBody food={food} onAdded={() => onOpenChange(false)} />
    </Modal>
  );
}

function FoodDialogBody({ food, onAdded }) {
  const { addToCart } = useCart();
  const showToast = useToast();
  const [quantity, setQuantity] = useState(1);

  function handleAdd() {
    addToCart(food._id, quantity);
    showToast("Food is being added to the cart!");
    onAdded();
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="h-60 overflow-hidden rounded-xl bg-neutral-100 md:h-91">
        {food.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={food.image} alt={food.name} className="size-full object-cover" />
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3 pt-6">
            <ModalTitle className="text-3xl font-semibold text-red-500">
              {food.name}
            </ModalTitle>
            {food.ingredients?.length ? (
              <p>{food.ingredients.join(", ")}</p>
            ) : null}
          </div>
          <CloseButton />
        </div>

        <div className="mt-auto flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p>Total price</p>
              <p className="text-2xl font-semibold">
                {formatPrice(food.price * quantity)}
              </p>
            </div>
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              label={food.name}
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="h-11 rounded-full bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

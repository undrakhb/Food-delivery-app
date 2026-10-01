import { X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { QuantityStepper } from "./quantity-stepper";

export function CartItem({ food, quantity, onQuantityChange, onRemove }) {
  return (
    <li className="flex gap-2.5 py-5 first:pt-0 last:pb-0">
      <div className="h-30 w-31 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        {food.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={food.image} alt={food.name} className="size-full object-cover" />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="min-w-0 flex-1">
            <p className="font-bold text-red-500">{food.name}</p>
            {food.ingredients?.length ? (
              <p className="text-xs">{food.ingredients.join(", ")}</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={`Remove ${food.name} from cart`}
            onClick={onRemove}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-red-500 text-red-500 transition-colors hover:bg-red-50"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <QuantityStepper
            value={quantity}
            onChange={onQuantityChange}
            variant="small"
            label={food.name}
          />
          <p className="font-bold">{formatPrice(food.price * quantity)}</p>
        </div>
      </div>
    </li>
  );
}

export function CartItemSkeleton() {
  return (
    <li className="flex gap-2.5 py-5 first:pt-0 last:pb-0">
      <div className="h-30 w-31 shrink-0 animate-pulse rounded-xl bg-neutral-200" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-5 w-1/2 animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
        <div className="mt-auto h-6 w-24 animate-pulse rounded bg-neutral-200" />
      </div>
    </li>
  );
}

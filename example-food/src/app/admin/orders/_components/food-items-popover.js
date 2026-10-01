"use client";

import { Popover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";

// images: Map of food id -> image, from the food list. Orders only carry
// food names, because images are large.
export function FoodItemsPopover({ items, images }) {
  const count = items.length;

  return (
    <Popover.Root>
      <Popover.Trigger className="group flex w-36 items-center justify-between gap-2 rounded-md py-1 text-left text-zinc-500 outline-none transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 data-popup-open:text-zinc-900">
        {count} {count === 1 ? "food" : "foods"}
        <ChevronDown className="size-4 transition-transform group-data-popup-open:rotate-180" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={4} align="start" className="z-50">
          <Popover.Popup className="flex w-64 flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-md outline-none transition-[opacity,scale] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            {items.map((item) => {
              const image = item.food ? images.get(item.food._id) : null;

              return (
                <div key={item._id} className="flex items-center gap-2.5 text-xs">
                  <div className="size-8 shrink-0 overflow-hidden rounded bg-zinc-100">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="" className="size-full object-cover" />
                    ) : null}
                  </div>
                  <span className="min-w-0 flex-1 truncate">
                    {item.food?.name ?? "Removed dish"}
                  </span>
                  <span className="shrink-0">x {item.quantity}</span>
                </div>
              );
            })}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

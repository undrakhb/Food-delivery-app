"use client";

import { Select } from "@base-ui/react/select";
import { Check, ChevronsUpDown } from "lucide-react";

export const STATUSES = [
  { value: "PENDING", label: "Pending", className: "border-red-500" },
  { value: "DELIVERED", label: "Delivered", className: "border-green-500" },
  { value: "CANCELED", label: "Cancelled", className: "border-zinc-200" },
];

const statusByValue = Object.fromEntries(
  STATUSES.map((status) => [status.value, status]),
);

export function StatusSelect({ value, onChange }) {
  const status = statusByValue[value] ?? STATUSES[0];

  return (
    <Select.Root
      items={STATUSES}
      value={value}
      onValueChange={(next) => {
        if (next && next !== value) onChange(next);
      }}
    >
      <Select.Trigger
        aria-label="Delivery state"
        className={`flex h-8 items-center gap-2 rounded-full border bg-white px-2.5 text-xs font-semibold whitespace-nowrap text-zinc-900 outline-none transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-400 ${status.className}`}
      >
        <Select.Value />
        <Select.Icon>
          <ChevronsUpDown className="size-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner
          alignItemWithTrigger={false}
          sideOffset={4}
          className="z-50 outline-none"
        >
          <Select.Popup className="min-w-(--anchor-width) rounded-lg border border-zinc-200 bg-white p-1 shadow-md outline-none transition-[opacity,scale] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <Select.List>
              {STATUSES.map((item) => (
                <Select.Item
                  key={item.value}
                  value={item.value}
                  className="flex cursor-default items-center gap-2 rounded-md py-1.5 pr-3 pl-2 text-xs font-medium outline-none select-none data-highlighted:bg-zinc-100"
                >
                  <span className="flex w-3.5 justify-center">
                    <Select.ItemIndicator>
                      <Check className="size-3.5" />
                    </Select.ItemIndicator>
                  </span>
                  <Select.ItemText>{item.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

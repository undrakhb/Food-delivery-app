"use client";

import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { DayPicker } from "react-day-picker";
import { CalendarDays } from "lucide-react";
import "react-day-picker/style.css";

const calendarStyle = {
  "--rdp-accent-color": "#18181b",
  "--rdp-accent-background-color": "#f4f4f5",
  "--rdp-day-height": "36px",
  "--rdp-day-width": "36px",
  "--rdp-day_button-height": "34px",
  "--rdp-day_button-width": "34px",
};

const formatDay = (date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const buttonClass =
  "h-9 rounded-full px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed";

// value: { from, to } of local-midnight dates, or undefined for all dates.
// Picks are kept in a draft until Apply, so half a range never reloads
// the table.
export function DateRangePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [month, setMonth] = useState();

  function handleOpenChange(next) {
    setOpen(next);
    if (next) {
      setDraft(value);
      // Show last month and this one, since orders are in the past.
      const today = new Date();
      setMonth(value?.from ?? new Date(today.getFullYear(), today.getMonth() - 1));
    }
  }

  function apply(range) {
    onChange(range);
    setOpen(false);
  }

  const label = value?.from
    ? `${formatDay(value.from)} - ${formatDay(value.to ?? value.from)}`
    : "All dates";

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger className="flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-400">
        <CalendarDays className="size-4" />
        {label}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="end" className="z-50">
          <Popover.Popup className="rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-lg outline-none transition-[opacity,scale] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <DayPicker
              mode="range"
              numberOfMonths={2}
              selected={draft}
              onSelect={setDraft}
              month={month}
              onMonthChange={setMonth}
              style={calendarStyle}
            />
            <div className="mt-3 flex justify-end gap-2 border-t border-zinc-100 pt-3">
              <button
                type="button"
                onClick={() => apply(undefined)}
                className={`${buttonClass} border border-zinc-200 hover:bg-zinc-100`}
              >
                All dates
              </button>
              <button
                type="button"
                disabled={!draft?.from}
                onClick={() => apply(draft)}
                className={`${buttonClass} bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300`}
              >
                Apply
              </button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

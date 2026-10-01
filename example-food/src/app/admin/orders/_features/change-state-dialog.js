"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { STATUSES } from "../_components/status-select";

// onSave(status) resolves to true once the selected orders are updated.
export function ChangeStateDialog({ count, onSave }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleOpenChange(next) {
    setOpen(next);
    if (next) setStatus(null);
  }

  async function handleSave() {
    if (!status) return;

    setSaving(true);
    const saved = await onSave(status);
    setSaving(false);
    if (saved) setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        disabled={count === 0}
        className="h-9 rounded-full bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200"
      >
        Change delivery state{count > 0 ? ` (${count})` : ""}
      </DialogTrigger>
      <DialogContent className="gap-6 p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Change delivery state
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3">
          {STATUSES.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={status === item.value}
              onClick={() => setStatus(item.value)}
              className={`h-9 flex-1 rounded-full text-sm font-medium transition-colors ${
                status === item.value
                  ? "bg-red-50 text-red-500 ring-1 ring-red-500"
                  : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!status || saving}
          className="h-9 rounded-full bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteFood, getErrorMessage, updateFood } from "@/app/_api/api";

const inputClass =
  "h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function EditDishButton({ food, onSaved }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(food.name ?? "");
  const [price, setPrice] = useState(food.price != null ? String(food.price) : "");
  const [image, setImage] = useState(food.image ?? "");
  const [ingredients, setIngredients] = useState((food.ingredients ?? []).join(", "));
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !price) return;

    setSubmitting(true);
    try {
      await updateFood(food._id, {
        name: name.trim(),
        price: Number(price),
        image: image.trim(),
        ingredients: ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        category: food.category?._id,
      });
      setOpen(false);
      onSaved();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!window.confirm(`Remove ${food.name}?`)) return;

    setDeleting(true);
    try {
      await deleteFood(food._id);
      setOpen(false);
      onSaved();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex size-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition-colors hover:bg-red-50">
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit dish</DialogTitle>
          <DialogDescription>Update the details for {food.name}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dish name"
            className={inputClass}
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
          />
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL (optional)"
            className={inputClass}
          />
          <input
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ingredients, comma separated"
            className={inputClass}
          />
          <DialogFooter>
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting || submitting}
              className="h-10 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Removing..." : "Remove"}
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !price || submitting || deleting}
              className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

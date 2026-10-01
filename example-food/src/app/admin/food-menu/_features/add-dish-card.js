"use client";

import { useRef, useState } from "react";
import { ImagePlus, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createFood, getErrorMessage } from "@/app/_api/api";

const inputClass =
  "h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const labelClass = "text-sm font-medium text-slate-700";

export function AddDishCard({ categoryId, categoryName, onCreated }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  function readImageFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function handleImageChange(event) {
    readImageFile(event.target.files?.[0]);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    readImageFile(event.dataTransfer.files?.[0]);
  }

  function clearImage() {
    setImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !price) return;

    setSubmitting(true);
    try {
      await createFood({
        name: name.trim(),
        price: Number(price),
        image,
        ingredients: ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        category: categoryId,
      });
      setName("");
      setPrice("");
      clearImage();
      setIngredients("");
      setOpen(false);
      onCreated();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-red-300 text-center transition-colors hover:bg-red-50/50">
        <span className="flex size-11 items-center justify-center rounded-full bg-red-500 text-white">
          <Plus className="size-5" />
        </span>
        <span className="px-6 text-sm font-medium text-slate-700">
          Add new Dish to {categoryName}
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new Dish to {categoryName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Food name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type food name"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Food price</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$0.00"
                type="number"
                step="0.01"
                min="0"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Ingredients</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar."
              rows={3}
              className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Food image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {image ? (
              <div className="relative h-40 w-full overflow-hidden rounded-lg border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Food preview"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-white text-slate-700 shadow hover:bg-slate-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-slate-500 transition-colors hover:bg-slate-50 ${
                  isDragging ? "border-slate-400 bg-slate-50" : ""
                }`}
              >
                <ImagePlus className="size-6" />
                <span className="text-sm font-medium">
                  {isDragging
                    ? "Drop image to upload"
                    : "Click or drag image to upload"}
                </span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !price || submitting}
            className="ml-auto h-10 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Dish"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

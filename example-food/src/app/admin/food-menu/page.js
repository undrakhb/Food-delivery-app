"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  deleteFoodCategory,
  fetchFoodCategories,
  fetchFoods,
  getErrorMessage,
  updateFoodCategory,
} from "@/app/_api/api";
import { AddCategoryDialog } from "./_features/add-category-dialog";
import { AddDishCard } from "./_features/add-dish-card";
import { EditDishButton } from "./_features/edit-dish-button";

export default function AdminFoodMenuPage() {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  function refresh() {
    return Promise.all([fetchFoodCategories(), fetchFoods()])
      .then(([cats, fds]) => {
        setCategories(cats);
        setFoods(fds);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleDeleteCategory = async (id) => {
    if (!confirm("Энэ ангиллыг устгахдаа итгэлтэй байна уу?")) return;

    try {
      await deleteFoodCategory(id);
      if (selectedCategoryId === id) setSelectedCategoryId(null);
      refresh();
    } catch (error) {
      alert(getErrorMessage(error, "Ангилал устгахад алдаа гарлаа."));
    }
  };

  const handleDoubleClick = (category) => {
    setEditingId(category._id);
    setEditName(category.categoryName);
  };

  const handleSaveCategory = async (id) => {
    const original = categories.find((c) => c._id === id);
    const name = editName.trim();

    if (name !== "" && name !== original?.categoryName) {
      try {
        await updateFoodCategory(id, name);
        refresh();
      } catch (error) {
        alert(getErrorMessage(error, "Ангиллын нэр засахад алдаа гарлаа."));
      }
    }
    setEditingId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
    if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading menu…</p>;
  }

  const visibleCategories = selectedCategoryId
    ? categories.filter((category) => category._id === selectedCategoryId)
    : categories;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Dishes category</h1>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategoryId === null
                ? "border-red-500 bg-white text-slate-900 font-semibold"
                : "border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            All Dishes
            <span className="flex size-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {foods.length}
            </span>
          </button>

          {categories.map((category) => {
            const count = foods.filter(
              (food) => food.category?._id === category._id,
            ).length;
            const selected = selectedCategoryId === category._id;
            const isEditing = editingId === category._id;

            if (isEditing) {
              return (
                <input
                  key={category._id}
                  type="text"
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleSaveCategory(category._id)}
                  onKeyDown={handleKeyDown}
                  className="w-36 rounded-full border-2 border-red-500 bg-white px-4 py-1.5 text-sm font-medium outline-none"
                />
              );
            }

            return (
              <button
                key={category._id}
                type="button"
                onClick={() => setSelectedCategoryId(category._id)}
                onDoubleClick={() => handleDoubleClick(category)}
                title="Хоёр дараад нэрийг солино уу"
                className={`group flex items-center gap-2 rounded-full border py-1.5 pl-4 pr-2 text-sm font-medium transition-colors cursor-pointer ${
                  selected
                    ? "border-red-500 bg-white text-slate-900 font-semibold"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {category.categoryName}
                <span className="flex size-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {count}
                </span>

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category._id);
                  }}
                  className="ml-1 rounded-full p-1 text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}

          <AddCategoryDialog onCreated={refresh} />
        </div>
      </div>

      {visibleCategories.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          No categories yet — add one above to get started.
        </div>
      ) : (
        visibleCategories.map((category) => {
          const categoryFoods = foods.filter(
            (food) => food.category?._id === category._id,
          );

          return (
            <div
              key={category._id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900">
                {category.categoryName} ({categoryFoods.length})
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AddDishCard
                  categoryId={category._id}
                  categoryName={category.categoryName}
                  onCreated={refresh}
                />

                {categoryFoods.map((food) => (
                  <div
                    key={food._id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-slate-100">
                      {food.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={food.image}
                          alt={food.name}
                          className="h-36 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-36 w-full items-center justify-center text-sm text-slate-400">
                          No image
                        </div>
                      )}
                      <div className="absolute right-2 top-2">
                        <EditDishButton food={food} onSaved={refresh} />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="font-semibold text-red-500">
                        {food.name}
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        ${Number(food.price ?? 0).toFixed(2)}
                      </span>
                    </div>
                    {food.ingredients?.length ? (
                      <p className="mt-1 text-sm text-slate-500">
                        {food.ingredients.join(", ")}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

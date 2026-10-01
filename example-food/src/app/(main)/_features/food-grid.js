"use client";

import { useEffect, useState } from "react";
import { fetchFoodCategories, fetchFoods } from "@/app/_api/api";
import { FoodCard, FoodCardSkeleton } from "../_components/food-card";
import { FoodDialog } from "./food-dialog";

const gridClass = "grid gap-9 sm:grid-cols-2 lg:grid-cols-3";

function SectionSkeleton({ cards }) {
  return (
    <section className="flex flex-col gap-13.5">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-neutral-600" />
      <div className={gridClass}>
        {Array.from({ length: cards }, (_, i) => (
          <FoodCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

function Message({ children }) {
  return <p className="py-20 text-center text-neutral-300">{children}</p>;
}

export function FoodGrid() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(false);
  // Kept after closing so the dialog can animate out with its content.
  const [selectedFood, setSelectedFood] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function openFood(food) {
    setSelectedFood(food);
    setDialogOpen(true);
  }

  useEffect(() => {
    Promise.all([fetchFoodCategories(), fetchFoods()])
      .then(([categories, foods]) => {
        setMenu(
          categories
            .map((category) => ({
              ...category,
              foods: foods.filter((food) => food.category?._id === category._id),
            }))
            .filter((category) => category.foods.length > 0),
        );
      })
      .catch(() => setError(true));
  }, []);

  let content;
  if (error) {
    content = <Message>Couldn&apos;t load the menu. Please try again later.</Message>;
  } else if (!menu) {
    content = (
      <>
        <SectionSkeleton cards={6} />
        <SectionSkeleton cards={3} />
      </>
    );
  } else if (menu.length === 0) {
    content = <Message>No dishes yet.</Message>;
  } else {
    content = menu.map((category) => (
      <section
        key={category._id}
        id={category._id}
        className="flex scroll-mt-8 flex-col gap-13.5"
      >
        <h2 className="text-3xl font-semibold text-white">
          {category.categoryName}
        </h2>
        <div className={gridClass}>
          {category.foods.map((food) => (
            <FoodCard key={food._id} food={food} onSelect={openFood} />
          ))}
        </div>
      </section>
    ));
  }

  return (
    <div className="mx-auto flex w-full max-w-324 flex-col gap-18 px-4 py-22">
      {content}
      {selectedFood ? (
        <FoodDialog
          food={selectedFood}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      ) : null}
    </div>
  );
}

import mongoose from "mongoose";
import { Food } from "../../schemas/food.js";
import { FoodCategory } from "../../schemas/food-category-schema.js";

export const updateFoodController = async (request, response) => {
  try {
    const { id } = request.params;
    const { name, price, image, ingredients, category } = request.body;

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return response.status(400).json({ message: "invalid category id" });
      }
      const categoryExists = await FoodCategory.findById(category);
      if (!categoryExists) {
        return response.status(400).json({ message: "category not found" });
      }
    }

    const food = await Food.findByIdAndUpdate(
      id,
      { name, price, image, ingredients, category },
      { new: true },
    ).populate("category");

    if (!food) {
      return response.status(404).json({ message: "food not found" });
    }

    response.status(200).json({ message: "food updated", food });
  } catch (err) {
    console.error("updateFoodController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};

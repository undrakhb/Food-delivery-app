import mongoose from "mongoose";
import { Food } from "../../schemas/food.js";
import { FoodCategory } from "../../schemas/food-category-schema.js";

export const createFoodController = async (request, response) => {
  try {
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

    const food = await Food.create({ name, price, image, ingredients, category });
    await food.populate("category");

    response.status(201).json({ message: "food created", food });
  } catch (err) {
    console.error("createFoodController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};

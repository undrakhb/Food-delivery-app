import mongoose from "mongoose";
import { Food } from "../../schemas/food.js";
import { FoodCategory } from "../../schemas/food-category-schema.js";

export const deleteFoodCategoryController = async (request, response) => {
  try {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ message: "invalid category id" });
    }

    // Deleting it would leave its dishes pointing at nothing, and they would
    // disappear from the menu.
    if (await Food.exists({ category: id })) {
      return response
        .status(409)
        .json({ message: "This category still has dishes. Delete them first." });
    }

    const foodCategory = await FoodCategory.findByIdAndDelete(id);

    if (!foodCategory) {
      return response.status(404).json({ message: "Food category not found" });
    }

    return response
      .status(200)
      .json({ message: "Food category deleted successfully", foodCategory });
  } catch (err) {
    console.error("deleteFoodCategoryController error:", err);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

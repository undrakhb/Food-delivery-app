import { FoodCategory } from "../../schemas/food-category-schema.js";

export const updateFoodCategoryController = async (request, response) => {
  try {
    const { id } = request.params;
    const { categoryName } = request.body;
    const foodCategory = await FoodCategory.findByIdAndUpdate(
      id,
      { categoryName },
      { new: true },
    );
    if (!foodCategory) {
      return response.status(404).json({ message: "food category not found" });
    }
    response.status(200).json({ message: "food category updated", foodCategory });
  } catch (err) {
    console.error("updateFoodCategoryController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};

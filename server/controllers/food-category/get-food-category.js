import { FoodCategory } from "../../schemas/food-category-schema.js";

export const getFoodCategoryController = async (request, response) => {
  try {
    const foodCategories = await FoodCategory.find();
    response.status(200).json({ message: "food category list", foodCategories });
  } catch (err) {
    console.error("getFoodCategoryController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};

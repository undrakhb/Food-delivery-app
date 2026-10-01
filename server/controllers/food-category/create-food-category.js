import { FoodCategory } from "../../schemas/food-category-schema.js";

export const createFoodCategoryController = async (request, response) => {
  try {
    const { categoryName } = request.body;
    const foodCategory = await FoodCategory.create({ categoryName});
    response.status(201).json({ message: "food category created", foodCategory });
  } catch (err) {
    console.error("createFoodCategoryController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};

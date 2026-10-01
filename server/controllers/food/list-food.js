import mongoose from "mongoose";
import { Food } from "../../schemas/food.js";

export const listFoodController = async (request, response) => {
  try {
    const { category } = request.query;
    const filter = {};

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return response.status(400).json({ message: "invalid category id" });
      }
      filter.category = category;
    }

    const foods = await Food.find(filter).populate("category");
    response.status(200).json({ message: "food list", foods });
  } catch (err) {
    console.error("listFoodController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};

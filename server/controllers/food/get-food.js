import mongoose from "mongoose";
import { Food } from "../../schemas/food.js";

export const getFoodController = async (request, response) => {
  try {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ message: "invalid food id" });
    }

    const food = await Food.findById(id).populate("category");
    if (!food) {
      return response.status(404).json({ message: "food not found" });
    }

    response.status(200).json({ message: "food found", food });
  } catch (err) {
    console.error("getFoodController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};

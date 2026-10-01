import { Food } from "../../schemas/food.js";

export const deleteFoodController = async (request, response) => {
  try {
    const { id } = request.params;

    const food = await Food.findByIdAndDelete(id);
    if (!food) {
      return response.status(404).json({ message: "food not found" });
    }

    return response.status(200).json({ message: "food deleted", food });
  } catch (err) {
    console.error("deleteFoodController error:", err);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
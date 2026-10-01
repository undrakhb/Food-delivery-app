import { FoodOrder } from "../../schemas/food-order.js";
import { User } from "../../schemas/user-schema.js";

export const listMyFoodOrdersController = async (request, response) => {
  try {
    const user = await User.findOne({ email: request.user.email });
    if (!user) {
      return response.status(404).json({ message: "user not found" });
    }

    // Only the food name: images are large base64 strings.
    const foodOrders = await FoodOrder.find({ user: user._id })
      .sort({ created_at: -1 })
      .populate("foodOrderItems.food", "name");

    response.status(200).json({ message: "my orders", foodOrders });
  } catch (err) {
    console.error("listMyFoodOrdersController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};

import mongoose from "mongoose";
import { FoodOrder } from "../../schemas/food-order.js";

const STATUSES = FoodOrder.schema.path("status").enumValues;

// Admin: set the status of one or more orders at once.
export const updateFoodOrderStatusController = async (request, response) => {
  try {
    const { orderIds, status } = request.body;

    if (
      !Array.isArray(orderIds) ||
      orderIds.length === 0 ||
      !orderIds.every((id) => mongoose.Types.ObjectId.isValid(id))
    ) {
      return response.status(400).json({ message: "orderIds is required" });
    }
    if (!STATUSES.includes(status)) {
      return response.status(400).json({ message: "invalid status" });
    }

    const result = await FoodOrder.updateMany(
      { _id: { $in: orderIds } },
      { status },
    );

    response
      .status(200)
      .json({ message: "order status updated", modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("updateFoodOrderStatusController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};

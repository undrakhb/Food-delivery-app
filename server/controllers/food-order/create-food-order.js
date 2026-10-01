import mongoose from "mongoose";
import { Food } from "../../schemas/food.js";
import { FoodOrder } from "../../schemas/food-order.js";
import { User } from "../../schemas/user-schema.js";
import { isValidLocation } from "../../utils/location.js";

// Keep in sync with SHIPPING_FEE in the frontend cart.
const SHIPPING_FEE = 0.99;

const isValidItem = (item) =>
  mongoose.Types.ObjectId.isValid(item?.food) &&
  Number.isInteger(item.quantity) &&
  item.quantity > 0;

export const createFoodOrderController = async (request, response) => {
  try {
    const { foodOrderItems, deliveryAddress, deliveryLocation } = request.body;

    if (!Array.isArray(foodOrderItems) || foodOrderItems.length === 0) {
      return response.status(400).json({ message: "foodOrderItems is required" });
    }
    if (!foodOrderItems.every(isValidItem)) {
      return response.status(400).json({ message: "invalid order item" });
    }
    if (typeof deliveryAddress !== "string" || !deliveryAddress.trim()) {
      return response.status(400).json({ message: "deliveryAddress is required" });
    }
    if (deliveryLocation != null && !isValidLocation(deliveryLocation)) {
      return response.status(400).json({ message: "invalid deliveryLocation" });
    }

    // The token only carries email and role, so look the user up by email.
    const user = await User.findOne({ email: request.user.email });
    if (!user) {
      return response.status(404).json({ message: "user not found" });
    }

    // Prices come from the database, never from the client.
    const foods = await Food.find({
      _id: { $in: foodOrderItems.map((item) => item.food) },
    });
    const priceById = new Map(foods.map((food) => [String(food._id), food.price]));

    if (!foodOrderItems.every((item) => priceById.has(String(item.food)))) {
      return response.status(400).json({ message: "food not found" });
    }

    const itemsTotal = foodOrderItems.reduce(
      (sum, item) => sum + priceById.get(String(item.food)) * item.quantity,
      0,
    );

    const foodOrder = await FoodOrder.create({
      user: user._id,
      totalPrice: Math.round((itemsTotal + SHIPPING_FEE) * 100) / 100,
      foodOrderItems: foodOrderItems.map(({ food, quantity }) => ({ food, quantity })),
      deliveryAddress: deliveryAddress.trim(),
      deliveryLocation: deliveryLocation
        ? { lat: deliveryLocation.lat, lng: deliveryLocation.lng }
        : undefined,
    });

    response.status(201).json({ message: "order created", foodOrder });
  } catch (err) {
    console.error("createFoodOrderController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};

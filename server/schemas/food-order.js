import mongoose from "mongoose";

const foodOrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalPrice: { type: Number, required: true },
    foodOrderItems: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    deliveryAddress: { type: String, required: true },
    deliveryLocation: { lat: Number, lng: Number },
    status: {
      type: String,
      enum: ["PENDING", "CANCELED", "DELIVERED"],
      default: "PENDING",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export const FoodOrder = mongoose.model("FoodOrder", foodOrderSchema);

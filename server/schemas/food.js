import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    ingredients: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "FoodCategory" },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export const Food = mongoose.model("Food", foodSchema);

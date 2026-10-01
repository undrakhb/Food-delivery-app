import express from "express";

import { createFoodCategoryController } from "../../controllers/food-category/create-food-category.js";
import { deleteFoodCategoryController } from "../../controllers/food-category/delete-food-category.js";
import { updateFoodCategoryController } from "../../controllers/food-category/update-food-category.js";
import { getFoodCategoryController } from "../../controllers/food-category/get-food-category.js";
import { requireToken } from "../../middleware/require-token.js";
import { requireAdmin } from "../../middleware/require-admin.js";

const router = express.Router();

const requireCategoryName = (request, response, next) => {
  const { categoryName } = request.body;

  if (!categoryName) {
    return response.status(400).json({ message: "categoryName is required" });
  } else {
    next();
  }
};

router.post(
  "/create",
  requireToken,
  requireAdmin,
  requireCategoryName,
  createFoodCategoryController,
);

router.delete(
  "/delete/:id",
  requireToken,
  requireAdmin,
  deleteFoodCategoryController,
);

router.put(
  "/update/:id",
  requireToken,
  requireAdmin,
  requireCategoryName,
  updateFoodCategoryController,
);

router.get("/get", getFoodCategoryController);

export default router;
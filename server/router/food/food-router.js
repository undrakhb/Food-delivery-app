import express from "express";
import { listFoodController } from "../../controllers/food/list-food.js";
import { getFoodController } from "../../controllers/food/get-food.js";
import { createFoodController } from "../../controllers/food/create-food.js";
import { updateFoodController } from "../../controllers/food/update-food.js";
import { deleteFoodController } from "../../controllers/food/delete-food.js";
import { requireToken } from "../../middleware/require-token.js";
import { requireAdmin } from "../../middleware/require-admin.js";

const router = express.Router();

router.get("/list", listFoodController);
router.get("/:id", getFoodController);
router.post("/create", requireToken, requireAdmin, createFoodController);
router.put("/update/:id", requireToken, requireAdmin, updateFoodController);
router.delete("/delete/:id", requireToken, requireAdmin, deleteFoodController);

export default router;

import express from "express";
import { createFoodOrderController } from "../../controllers/food-order/create-food-order.js";
import { listFoodOrdersController } from "../../controllers/food-order/list-food-orders.js";
import { listMyFoodOrdersController } from "../../controllers/food-order/list-my-food-orders.js";
import { updateFoodOrderStatusController } from "../../controllers/food-order/update-food-order-status.js";
import { requireToken } from "../../middleware/require-token.js";
import { requireAdmin } from "../../middleware/require-admin.js";

const router = express.Router();

router.post("/", requireToken, createFoodOrderController);
router.get("/", requireToken, requireAdmin, listFoodOrdersController);
router.get("/my", requireToken, listMyFoodOrdersController);
router.patch("/status", requireToken, requireAdmin, updateFoodOrderStatusController);

export default router;

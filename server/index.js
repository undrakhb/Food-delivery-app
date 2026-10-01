import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./connectDB.js";
import authRouter from "./router/auth/auth.js";
import foodCategoryRouter from "./router/food-category/food-category-router.js";
import foodRouter from "./router/food/food-router.js";
import foodOrderRouter from "./router/food-order/food-order-router.js";

const app = express();
// Hosting services pass their own port in PORT.
const PORT = process.env.PORT || 1000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

connectDB();

app.get("/api/health", (request, response) => {
  response.json({ message: `API HEALTHY RUNNING ON ${PORT}` });
});

app.use("/auth", authRouter);
app.use("/food-category", foodCategoryRouter);
app.use("/food", foodRouter);
app.use("/food-order", foodOrderRouter);

app.listen(PORT, () => {
  console.log(`server is runnning, on port ${PORT}`);
}); 
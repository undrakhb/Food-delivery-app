import express from "express";
import cors from "cors";
import mongoose from "mongoose";
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

connectDB()
  .then(() => console.log("mongoDB connected"))
  .catch((err) => {
    console.log("mongoDB connection failed:", err.message);
    // On Vercel, exiting crashes the function (FUNCTION_INVOCATION_FAILED),
    // so keep it alive; the next request will try to connect again.
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  });

app.get("/api/health", (request, response) => {
  response.json({
    message: `API HEALTHY RUNNING ON ${PORT}`,
    database: mongoose.STATES[mongoose.connection.readyState],
  });
});

// Every route below needs the database, so wait for it (or retry) first.
app.use(async (request, response, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.log("mongoDB connection failed:", err.message);
    response
      .status(503)
      .json({ message: "Can't reach the database. Please try again later." });
  }
});

app.use("/auth", authRouter);
app.use("/food-category", foodCategoryRouter);
app.use("/food", foodRouter);
app.use("/food-order", foodOrderRouter);

app.listen(PORT, () => {
  console.log(`server is runnning, on port ${PORT}`);
}); 
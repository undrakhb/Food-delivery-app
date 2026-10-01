import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_DB;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("mongoDB connected");
  } catch (err) {
    console.log("mongoDB connection failed:", err.message);
    process.exit(1);
  }
};

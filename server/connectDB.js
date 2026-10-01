import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_DB;

export const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_DB environment variable is not set");
    }
    await mongoose.connect(MONGO_URI);
    console.log("mongoDB connected");
  } catch (err) {
    console.log("mongoDB connection failed:", err.message);
    // On Vercel, exiting crashes the function (FUNCTION_INVOCATION_FAILED),
    // so keep it alive and let /api/health show the database state.
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

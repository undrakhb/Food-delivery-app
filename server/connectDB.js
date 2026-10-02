import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_DB;

let connecting = null;

// On Vercel one running function serves many requests, so every request
// shares a single connection. If connecting fails, the next call tries again
// instead of staying disconnected until Vercel restarts the function.
export const connectDB = () => {
  if (!MONGO_URI) {
    return Promise.reject(
      new Error("MONGO_DB environment variable is not set"),
    );
  }
  connecting ??= mongoose
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
    .catch((err) => {
      connecting = null;
      throw err;
    });
  return connecting;
};

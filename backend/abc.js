import mongoose from "mongoose";
import Profile from "../models/Profile.js"; // adjust path
import dotenv from "dotenv";

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const result = await Profile.updateMany(
      { profileEmbedding: { $exists: false } },
      { $set: { profileEmbedding: [] } }
    );

    console.log("Update result:", result);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();

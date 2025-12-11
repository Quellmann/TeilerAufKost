import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectToDatabase() {
    try {
    const atlasURI = process.env.ATLAS_URI;
    if (!atlasURI) {
      throw new Error("ATLAS_URI not defined in environment");
    }

    await mongoose.connect(atlasURI, {}); 
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
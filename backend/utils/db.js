import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "config.env" });


export async function connectToDatabase() {
    try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI not defined in environment");
    }

    await mongoose.connect(mongoURI, {});

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
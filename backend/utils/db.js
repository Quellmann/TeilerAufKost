import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "config.env" });


export async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
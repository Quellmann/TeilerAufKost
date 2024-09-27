import { model, Schema } from "mongoose";

const SpendingSchema = new Schema(
    {
        groupId: { type: Schema.ObjectId, required: true },
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        from: { type: String, required: true },
        to: { type: Array, required: true },
    },
    { timestamps: true }
);

export const Spending = model("Spendings", SpendingSchema);
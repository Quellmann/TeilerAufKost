import { model, Schema } from "mongoose";

const GroupSchema = new Schema(
    {
        groupName: { type: String, required: true },
        groupMember: { type: Array, required: true },
    },
    { timestamps: true }
);

export const Group = model("Groups", GroupSchema);
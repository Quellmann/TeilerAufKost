import mongoose from "mongoose";
import { Spending } from "../models/spending.js";


export async function getSpendingsByGroup(req, res) {
    try {
        const groupId = req.params.groupId;
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            res.status(404).json("Id is invalid");
        } else {
            const spendings = await Spending.find({ groupId: groupId })
            if (!spendings) {
                res.status(404).json("No results where found")
            }
            else {
                res.status(200).json(spendings);
            }
        }
    } catch (error) {
        console.error("Error fetching spending:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function newSpending(req, res) {
    try {
        const newSpending = new Spending({
            groupId: req.params.groupId,
            title: req.body.title,
            amount: req.body.amount,
            from: req.body.from,
            to: req.body.to,
            individualValueHistory: req.body.individualValueHistory,
            isBalancingTransaction: req.body.isBalancingTransaction,
        })
        const spending = await newSpending.save();
        res.status(200).json(spending);
    } catch (error) {
        console.error("Error creating spending:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
import mongoose from "mongoose";
import { Group } from "../models/group.js";
import { Spending } from "../models/spending.js";

export async function getAllGroups(req, res) {
  try {
    const group = await Group.find({});
    res.status(200).json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getGroups(req, res) {
  try {
    const groupIds = JSON.parse(req.query.groupIds);
    const group = await Group.find({ _id: { $in: groupIds } });
    res.status(200).json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getGroupById(req, res) {
  try {
    const groupId = req.params.groupId;
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      res.status(404).json("Id is invalid");
    } else {
      const group = await Group.findById(groupId);
      if (!group) {
        res.status(404).json("No results where found");
      } else {
        res.status(200).json(group);
      }
    }
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createGroup(req, res) {
  try {
    const newGroup = new Group({
      groupName: req.body.groupName,
      groupMember: req.body.groupMember,
    });
    const group = await newGroup.save();
    res.status(200).json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateGroup(req, res) {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { $addToSet: { groupMember: { $each: req.body.groupMember } } },
      { new: true }
    );
    res.status(200).json(group);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteGroup(req, res) {
  try {
    const group = await Group.findByIdAndDelete(req.params.groupId)
    const spending = await Spending.deleteMany({ groupId: req.params.groupId})
    res.status(200).json(group);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

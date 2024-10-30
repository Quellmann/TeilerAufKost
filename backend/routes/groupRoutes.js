import { Router } from "express";
import {
  createGroup,
  getGroupById,
  getGroups,
  getAllGroups,
  updateGroup,
  deleteGroup,
} from "../controller/groupController.js";

const router = Router();

router.get("/groups", getGroups);
router.get("/allGroups", getAllGroups);
router.get("/:groupId", getGroupById);
router.post("/newGroup", createGroup);
router.patch("/:groupId/updateGroup", updateGroup);
router.delete("/:groupId/deleteGroup", deleteGroup)

export default router;

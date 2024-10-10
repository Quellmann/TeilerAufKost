import { Router } from "express";
import {
  createGroup,
  getGroupById,
  getGroups,
  getAllGroups,
  updateGroup,
} from "../controller/groupController.js";

const router = Router();

router.get("/groups", getGroups);
router.get("/allGroups", getAllGroups);
router.get("/:groupId", getGroupById);
router.post("/newGroup", createGroup);
router.patch("/:groupId/updateGroup", updateGroup);

export default router;

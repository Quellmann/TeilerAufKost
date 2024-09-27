import { Router } from "express";
import { createGroup, getGroupById, getGroups, updateGroup } from "../controller/groupController.js";

const router = Router();

router.get("/groups", getGroups);
router.get("/:groupId", getGroupById);
router.post("/newGroup", createGroup);
router.patch("/:groupId/updateGroup", updateGroup);


export default router;
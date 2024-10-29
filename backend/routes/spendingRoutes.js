import { Router } from "express";
import { deleteSpending, getSpendingsByGroup, newSpending, updateSpending } from "../controller/spendingController.js";


const router = Router();


router.get("/:groupId/spendings", getSpendingsByGroup);
router.post("/:groupId/newSpending", newSpending);
router.patch("/:spendingId/updateSpending", updateSpending);
router.delete("/:spendingId/deleteSpending", deleteSpending)


export default router;
import { Router } from "express";
import { getSpendingsByGroup, newSpending } from "../controller/spendingController.js";


const router = Router();


router.get("/:groupId/spendings", getSpendingsByGroup);
router.post("/:groupId/newSpending", newSpending);


export default router;
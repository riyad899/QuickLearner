import { Router } from "express";
import { validateZodSchema } from "../../../middleware/validateReq.js";
import { MilestoneController } from "./milestone.controller.js";
import { createMilestoneZodSchema, updateMilestoneZodSchema } from "./milestone.validation.js";

const router = Router();

router.post("/", validateZodSchema(createMilestoneZodSchema), MilestoneController.createMilestone);
router.get("/", MilestoneController.getAllMilestone);
router.get("/:id", MilestoneController.getMilestoneById);
router.patch("/:id", validateZodSchema(updateMilestoneZodSchema), MilestoneController.updateMilestone);
router.delete("/:id", MilestoneController.deleteMilestone);

export const MilestoneRoute = router;

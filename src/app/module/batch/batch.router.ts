import { Router } from "express";
import { validateZodSchema } from "../../../middleware/validateReq.js";
import { BatchController } from "./batch.controller.js";
import { createBatchZodSchema, updateBatchZodSchema } from "./batch.validation.js";

const router = Router();

router.post("/", validateZodSchema(createBatchZodSchema), BatchController.createBatch);
router.get("/", BatchController.getAllBatch);
router.get("/:id", BatchController.getBatchById);
router.patch("/:id", validateZodSchema(updateBatchZodSchema), BatchController.updateBatch);
router.delete("/:id", BatchController.deleteBatch);

export const BatchRoute = router;

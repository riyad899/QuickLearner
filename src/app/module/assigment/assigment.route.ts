import { Router } from "express";
import { validateZodSchema } from "../../../middleware/validateReq.js";
import { AssigmentController } from "./assigment.controller.js";
import { createAssigmentZodSchema, updateAssigmentZodSchema } from "./assigment.validation.js";

const router = Router();

router.post("/", validateZodSchema(createAssigmentZodSchema), AssigmentController.createAssigment);
router.get("/", AssigmentController.getAllAssigment);
router.get("/:id", AssigmentController.getAssigmentById);
router.patch("/:id", validateZodSchema(updateAssigmentZodSchema), AssigmentController.updateAssigment);
router.delete("/:id", AssigmentController.deleteAssigment);

export const AssigmentRoute = router;

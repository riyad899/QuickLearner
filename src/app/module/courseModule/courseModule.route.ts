import { Router } from "express";
import { validateZodSchema } from "../../../middleware/validateReq.js";
import { CourseModuleController } from "./courseModule.controller.js";
import { createCourseModuleZodSchema, updateCourseModuleZodSchema } from "./courseModule.validation.js";

const router = Router();

router.post("/", validateZodSchema(createCourseModuleZodSchema), CourseModuleController.createCourseModule);
router.get("/", CourseModuleController.getAllCourseModule);
router.get("/:id", CourseModuleController.getCourseModuleById);
router.patch("/:id", validateZodSchema(updateCourseModuleZodSchema), CourseModuleController.updateCourseModule);
router.delete("/:id", CourseModuleController.deleteCourseModule);

export const CourseModuleRoute = router;

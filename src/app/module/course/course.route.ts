import { Router } from "express";
import { validateZodSchema } from "../../../middleware/validateReq.js";
import { CourseController } from "./course.controller.js";
import { createCourseZodSchema, updateCourseZodSchema } from "./course.validation.js";

const router = Router();

router.post("/", validateZodSchema(createCourseZodSchema), CourseController.createCourse);
router.get("/", CourseController.getAllCourse);
router.get("/:id", CourseController.getCourseById);
router.patch("/:id", validateZodSchema(updateCourseZodSchema), CourseController.updateCourse);
router.delete("/:id", CourseController.deleteCourse);

export const CourseRoute = router;

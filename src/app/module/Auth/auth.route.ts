import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateZodSchema } from "../../../middleware/validateReq.js";
import {
	loginUserZodSchema,
	registerStudentZodSchema,
	updateStudentZodSchema,
} from "./auth.validation.js";

const router = Router();

router.post("/regsiter", validateZodSchema(registerStudentZodSchema), AuthController.register);
router.post("/login", validateZodSchema(loginUserZodSchema), AuthController.LoginUser);
router.patch("/student/:id", validateZodSchema(updateStudentZodSchema), AuthController.updateStudent);

export const AuthRoute = router;
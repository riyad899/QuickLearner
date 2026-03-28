import { Router } from "express";
import { InstructorController } from "./instructor.controller.js";


const router = Router();

router.post("/create-doctor",InstructorController.createInstructor);

export const InstructorRoute = router;
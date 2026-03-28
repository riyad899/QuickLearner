import { Router } from "express";
import { InstructorController } from "./instructor.controller.js";


const router = Router();

router.post("/create-instructor",InstructorController.createInstructor);
router.get("/get-all",InstructorController.getAllInstructor);

export const InstructorRoute = router;
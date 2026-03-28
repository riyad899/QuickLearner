import { Router } from "express";
import { InstructorController } from "./instructor.controller.js";


const router = Router();

router.post("/create-instructor",InstructorController.createInstructor);
router.get("/get-all",InstructorController.getAllInstructor);
router.delete("/delete/:id",InstructorController.deleteInstructor);
router.patch("/update/:id",InstructorController.updateInstructor);
router.get("/get-instructor/:id",InstructorController.getInstructorById);

export const InstructorRoute = router;
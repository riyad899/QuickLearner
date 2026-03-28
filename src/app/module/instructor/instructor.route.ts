import { Router } from "express";
import app from "../../../app";
import { InstructorController } from "./instructor.controller";


const router = Router();

router.post("/create-doctor",InstructorController.createInstructor);

export const InstructorRoute = router;
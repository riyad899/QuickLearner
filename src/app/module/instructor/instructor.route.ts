import { Router } from "express";
import { InstructorController } from "./instructor.controller.js";
import { validateZodSchema } from "../../../middleware/validateReq.js";
import { createInstructorZodSchema, updateInstructorZodSchema } from "./instructor.validation.js";


const router = Router();



router.post("/create-instructor",validateZodSchema(createInstructorZodSchema),InstructorController.createInstructor);
router.get("/get-all",InstructorController.getAllInstructor);
router.delete("/delete/:id",InstructorController.deleteInstructor);
router.patch("/update/:id",validateZodSchema(updateInstructorZodSchema),InstructorController.updateInstructor);
router.get("/get-instructor/:id",InstructorController.getInstructorById);

export const InstructorRoute = router;


// {
//   "password": "StrongPass123!",
//   "instrucotor": {
//     "name": "Ostad akbar ali",
//     "email": "ostad@example.com",
//     "age": 35,
//     "profilePhoto": "https://example.com/john.jpg",
//     "address": "Dhaka, Bangladesh",
//     "contact": "01700000004",
//     "instuctorFee": 1500,
//     "exprerince": 8,
//     "gender": "MALE",
//     "instructorBio": "Senior web development instructor."
//   },
//   "specialityId": ["df3423d8-f0b6-4e80-9a4e-d89acce55773"]
// }
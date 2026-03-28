import { Router } from "express";
import { SpacialityController } from "./spaciality.controller.js";


const router = Router();
router.post("/", SpacialityController.createspaciality);
router.get("/", SpacialityController.getAllSpeciality);
router.delete("/:id", SpacialityController.deleteSpeciality);
export const SpacialityRoute = router
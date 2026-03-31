import { Router } from "express";
import { SpacialityController } from "./spaciality.controller.js";
import { checkAuth } from "../../../middleware/checkAuth.js";
import { Role } from "@prisma/client";


const router = Router();
router.post("/", SpacialityController.createspaciality);
router.get("/", checkAuth(Role.STUDENT), SpacialityController.getAllSpeciality);
router.delete("/:id", SpacialityController.deleteSpeciality);
export const SpacialityRoute = router
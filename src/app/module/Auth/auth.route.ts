import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/regsiter", AuthController.register);
router.post("/login", AuthController.LoginUser);

export const AuthRoute = router;
import {Router } from 'express';
import { SpacialityRoute } from '../module/speciality/spaciality.route.js';
import { AuthRoute } from '../module/Auth/auth.route.js';
import { InstructorRoute } from '../module/instructor/instructor.route.js';
const router = Router();

router.use("/auth", AuthRoute);
router.use("/spaciality", SpacialityRoute);
router.use("/instructor", InstructorRoute);

export const IndexRoute = router;
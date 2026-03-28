import {Router } from 'express';
import { SpacialityRoute } from '../module/speciality/spaciality.route';
import { AuthRoute } from '../module/Auth/auth.route';
import { InstructorRoute } from '../module/instructor/instructor.route';
const router = Router();

router.use("/auth", AuthRoute);
router.use("/spaciality", SpacialityRoute);
router.use("/instructor", InstructorRoute);

export const IndexRoute = router;
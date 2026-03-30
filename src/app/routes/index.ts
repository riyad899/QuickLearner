import {Router } from 'express';
import { SpacialityRoute } from '../module/speciality/spaciality.route.js';
import { AuthRoute } from '../module/Auth/auth.route.js';
import { InstructorRoute } from '../module/instructor/instructor.route.js';
import { AdminRoute } from '../module/admin/admin.route.js';
const router = Router();

router.use("/auth", AuthRoute);
router.use("/spaciality", SpacialityRoute);
router.use("/instructor", InstructorRoute);
router.use("/admin", AdminRoute);

export const IndexRoute = router;
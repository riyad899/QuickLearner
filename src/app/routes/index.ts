import {Router } from 'express';
import { SpacialityRoute } from '../module/speciality/spaciality.route.js';
import { AuthRoute } from '../module/Auth/auth.route.js';
import { InstructorRoute } from '../module/instructor/instructor.route.js';
import { AdminRoute } from '../module/admin/admin.route.js';
import { BatchRoute } from '../module/batch/batch.router.js';
import { CourseRoute } from '../module/course/course.route.js';
import { MilestoneRoute } from '../module/milestone/milestone.route.js';
import { CourseModuleRoute } from '../module/courseModule/courseModule.route.js';
import { QuizRoute } from '../module/quiz/quiz.route.js';
import { AssigmentRoute } from '../module/assigment/assigment.route.js';
const router = Router();

router.use("/auth", AuthRoute);
router.use("/spaciality", SpacialityRoute);
router.use("/instructor", InstructorRoute);
router.use("/admin", AdminRoute);
router.use("/batch", BatchRoute);
router.use("/course", CourseRoute);
router.use("/milestone", MilestoneRoute);
router.use("/course-module", CourseModuleRoute);
router.use("/quiz", QuizRoute);
router.use("/assigment", AssigmentRoute);

export const IndexRoute = router;
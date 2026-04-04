import { Router } from "express";
import { validateZodSchema } from "../../../middleware/validateReq.js";
import { QuizController } from "./quiz.controller.js";
import {
	createAnswerZodSchema,
	createOptionZodSchema,
	createQuestionZodSchema,
	createQuizSubmissionZodSchema,
	createQuizZodSchema,
	updateQuizZodSchema,
} from "./quiz.validation.js";

const router = Router();

router.post("/", validateZodSchema(createQuizZodSchema), QuizController.createQuiz);
router.post("/question", validateZodSchema(createQuestionZodSchema), QuizController.createQuestion);
router.post("/option", validateZodSchema(createOptionZodSchema), QuizController.createOption);
router.post(
	"/submission",
	validateZodSchema(createQuizSubmissionZodSchema),
	QuizController.createQuizSubmission,
);
router.post("/answer", validateZodSchema(createAnswerZodSchema), QuizController.createAnswer);
router.get("/", QuizController.getAllQuiz);
router.get("/:id", QuizController.getQuizById);
router.patch("/:id", validateZodSchema(updateQuizZodSchema), QuizController.updateQuiz);
router.delete("/:id", QuizController.deleteQuiz);

export const QuizRoute = router;

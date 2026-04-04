import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { QuizService } from "./quiz.service.js";

const createQuiz = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizService.createQuiz(req.body);

  sendResponse(res, {
    httpStatus: status.CREATED,
    success: true,
    message: "Quiz created successfully",
    data: result,
  });
});

const getAllQuiz = catchAsync(async (_req: Request, res: Response) => {
  const result = await QuizService.getAllQuiz();

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Quizzes retrieved successfully",
    data: result,
  });
});

const getQuizById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    throw new AppError("Invalid quiz id", status.BAD_REQUEST);
  }

  const result = await QuizService.getQuizById(id);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Quiz retrieved successfully",
    data: result,
  });
});

const updateQuiz = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    throw new AppError("Invalid quiz id", status.BAD_REQUEST);
  }

  const result = await QuizService.updateQuiz(id, req.body);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Quiz updated successfully",
    data: result,
  });
});

const deleteQuiz = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    throw new AppError("Invalid quiz id", status.BAD_REQUEST);
  }

  const result = await QuizService.deleteQuiz(id);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Quiz deleted successfully",
    data: result,
  });
});

const createQuestion = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizService.createQuestion(req.body);

  sendResponse(res, {
    httpStatus: status.CREATED,
    success: true,
    message: "Question created successfully",
    data: result,
  });
});

const createOption = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizService.createOption(req.body);

  sendResponse(res, {
    httpStatus: status.CREATED,
    success: true,
    message: "Option created successfully",
    data: result,
  });
});

const createQuizSubmission = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizService.createQuizSubmission(req.body);

  sendResponse(res, {
    httpStatus: status.CREATED,
    success: true,
    message: "Quiz submission created successfully",
    data: result,
  });
});

const createAnswer = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizService.createAnswer(req.body);

  sendResponse(res, {
    httpStatus: status.CREATED,
    success: true,
    message: "Answer created successfully",
    data: result,
  });
});

export const QuizController = {
  createQuiz,
  getAllQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  createQuestion,
  createOption,
  createQuizSubmission,
  createAnswer,
};

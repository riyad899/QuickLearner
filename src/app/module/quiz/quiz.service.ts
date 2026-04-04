import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import { prisma } from "../../lib/prisma.js";
import {
  ICreateAnswerPayload,
  ICreateOptionPayload,
  ICreateQuestionPayload,
  ICreateQuizPayload,
  ICreateQuizSubmissionPayload,
  IUpdateQuizPayload,
} from "./quiz.interface.js";

const ensureCourseExists = async (courseId: number) => {
  const courseExists = await prisma.course.findFirst({
    where: {
      id: courseId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!courseExists) {
    throw new AppError("Course not found", status.NOT_FOUND);
  }
};

const ensureModuleExists = async (moduleID: number) => {
  const moduleExists = await prisma.module.findFirst({
    where: {
      id: moduleID,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!moduleExists) {
    throw new AppError("Course module not found", status.NOT_FOUND);
  }
};

const createQuiz = async (payload: ICreateQuizPayload) => {
  await ensureCourseExists(payload.courseId);
  await ensureModuleExists(payload.moduleID);

  const duplicateByModule = await prisma.quiz.findFirst({
    where: {
      moduleID: payload.moduleID,
    },
    select: {
      id: true,
    },
  });

  if (duplicateByModule) {
    throw new AppError("Quiz already exists for this module", status.CONFLICT);
  }

  const result = await prisma.quiz.create({
    data: {
      title: payload.title,
      courseId: payload.courseId,
      moduleID: payload.moduleID,
    },
  });

  return result;
};

const getAllQuiz = async () => {
  const result = await prisma.quiz.findMany({
    orderBy: {
      title: "asc",
    },
  });

  return result;
};

const getQuizById = async (id: string) => {
  const result = await prisma.quiz.findFirst({
    where: {
      id,
    },
  });

  if (!result) {
    throw new AppError("Quiz not found", status.NOT_FOUND);
  }

  return result;
};

const updateQuiz = async (id: string, payload: IUpdateQuizPayload) => {
  const quizExists = await prisma.quiz.findUnique({
    where: {
      id,
    },
  });

  if (!quizExists) {
    throw new AppError("Quiz not found", status.NOT_FOUND);
  }

  if (payload.courseId !== undefined) {
    await ensureCourseExists(payload.courseId);
  }

  if (payload.moduleID !== undefined) {
    await ensureModuleExists(payload.moduleID);

    if (payload.moduleID !== quizExists.moduleID) {
      const duplicateByModule = await prisma.quiz.findFirst({
        where: {
          moduleID: payload.moduleID,
          id: {
            not: id,
          },
        },
        select: {
          id: true,
        },
      });

      if (duplicateByModule) {
        throw new AppError("Quiz already exists for this module", status.CONFLICT);
      }
    }
  }

  const result = await prisma.quiz.update({
    where: {
      id,
    },
    data: {
      title: payload.title,
      courseId: payload.courseId,
      moduleID: payload.moduleID,
    },
  });

  return result;
};

const deleteQuiz = async (id: string) => {
  const quizExists = await prisma.quiz.findUnique({
    where: {
      id,
    },
  });

  if (!quizExists) {
    throw new AppError("Quiz not found", status.NOT_FOUND);
  }

  const result = await prisma.quiz.delete({
    where: {
      id,
    },
  });

  return result;
};

const ensureQuizExists = async (quizId: string) => {
  const quizExists = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
    },
  });

  if (!quizExists) {
    throw new AppError("Quiz not found", status.NOT_FOUND);
  }
};

const ensureQuestionExists = async (questionId: string) => {
  const questionExists = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    select: {
      id: true,
      quizId: true,
    },
  });

  if (!questionExists) {
    throw new AppError("Question not found", status.NOT_FOUND);
  }

  return questionExists;
};

const ensureOptionExists = async (optionId: string) => {
  const optionExists = await prisma.option.findUnique({
    where: {
      id: optionId,
    },
    select: {
      id: true,
      questionId: true,
    },
  });

  if (!optionExists) {
    throw new AppError("Option not found", status.NOT_FOUND);
  }

  return optionExists;
};

const createQuestion = async (payload: ICreateQuestionPayload) => {
  await ensureQuizExists(payload.quizId);

  const result = await prisma.question.create({
    data: {
      text: payload.text,
      quizId: payload.quizId,
      correctId: payload.correctId,
    },
  });

  return result;
};

const createOption = async (payload: ICreateOptionPayload) => {
  await ensureQuestionExists(payload.questionId);

  const result = await prisma.option.create({
    data: {
      id: payload.id,
      text: payload.text,
      questionId: payload.questionId,
    },
  });

  return result;
};

const createQuizSubmission = async (payload: ICreateQuizSubmissionPayload) => {
  await ensureQuizExists(payload.quizId);

  const result = await prisma.quizSubmission.create({
    data: {
      quizId: payload.quizId,
      studentId: payload.studentId,
      score: payload.score,
    },
  });

  return result;
};

const createAnswer = async (payload: ICreateAnswerPayload) => {
  const question = await ensureQuestionExists(payload.questionId);
  const option = await ensureOptionExists(payload.selectedOptionId);

  if (option.questionId !== payload.questionId) {
    throw new AppError("Selected option does not belong to this question", status.BAD_REQUEST);
  }

  const submission = await prisma.quizSubmission.findUnique({
    where: {
      id: payload.submissionId,
    },
    select: {
      id: true,
      quizId: true,
    },
  });

  if (!submission) {
    throw new AppError("Quiz submission not found", status.NOT_FOUND);
  }

  if (submission.quizId !== question.quizId) {
    throw new AppError("Question does not belong to submission quiz", status.BAD_REQUEST);
  }

  const result = await prisma.answer.create({
    data: {
      questionId: payload.questionId,
      selectedOptionId: payload.selectedOptionId,
      submissionId: payload.submissionId,
    },
  });

  return result;
};

export const QuizService = {
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

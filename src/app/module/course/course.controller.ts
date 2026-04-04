import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { CourseService } from "./course.service.js";

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourse(req.body);

  sendResponse(res, {
    httpStatus: status.CREATED,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});

const getAllCourse = catchAsync(async (_req: Request, res: Response) => {
  const result = await CourseService.getAllCourse();

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Courses retrieved successfully",
    data: result,
  });
});

const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid course id", status.BAD_REQUEST);
  }

  const result = await CourseService.getCourseById(id);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result,
  });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid course id", status.BAD_REQUEST);
  }

  const result = await CourseService.updateCourse(id, req.body);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid course id", status.BAD_REQUEST);
  }

  const result = await CourseService.deleteCourse(id);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Course deleted successfully",
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
};

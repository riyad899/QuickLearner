import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { CourseModuleService } from "./courseModule.service.js";

const createCourseModule = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseModuleService.createCourseModule(req.body);

  sendResponse(res, {
    httpStatus: status.CREATED,
    success: true,
    message: "Course module created successfully",
    data: result,
  });
});

const getAllCourseModule = catchAsync(async (_req: Request, res: Response) => {
  const result = await CourseModuleService.getAllCourseModule();

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Course modules retrieved successfully",
    data: result,
  });
});

const getCourseModuleById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid course module id", status.BAD_REQUEST);
  }

  const result = await CourseModuleService.getCourseModuleById(id);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Course module retrieved successfully",
    data: result,
  });
});

const updateCourseModule = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid course module id", status.BAD_REQUEST);
  }

  const result = await CourseModuleService.updateCourseModule(id, req.body);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Course module updated successfully",
    data: result,
  });
});

const deleteCourseModule = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid course module id", status.BAD_REQUEST);
  }

  const result = await CourseModuleService.deleteCourseModule(id);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Course module deleted successfully",
    data: result,
  });
});

export const CourseModuleController = {
  createCourseModule,
  getAllCourseModule,
  getCourseModuleById,
  updateCourseModule,
  deleteCourseModule,
};

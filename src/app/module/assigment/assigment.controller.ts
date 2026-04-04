import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { AssigmentService } from "./assigment.service.js";

const createAssigment = catchAsync(async (req: Request, res: Response) => {
  const result = await AssigmentService.createAssigment(req.body);

  sendResponse(res, {
    httpStatus: status.CREATED,
    success: true,
    message: "Assignment created successfully",
    data: result,
  });
});

const getAllAssigment = catchAsync(async (_req: Request, res: Response) => {
  const result = await AssigmentService.getAllAssigment();

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Assignments retrieved successfully",
    data: result,
  });
});

const getAssigmentById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid assignment id", status.BAD_REQUEST);
  }

  const result = await AssigmentService.getAssigmentById(id);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Assignment retrieved successfully",
    data: result,
  });
});

const updateAssigment = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid assignment id", status.BAD_REQUEST);
  }

  const result = await AssigmentService.updateAssigment(id, req.body);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Assignment updated successfully",
    data: result,
  });
});

const deleteAssigment = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid assignment id", status.BAD_REQUEST);
  }

  const result = await AssigmentService.deleteAssigment(id);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Assignment deleted successfully",
    data: result,
  });
});

export const AssigmentController = {
  createAssigment,
  getAllAssigment,
  getAssigmentById,
  updateAssigment,
  deleteAssigment,
};

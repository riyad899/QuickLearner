import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { MilestoneService } from "./milestone.service.js";

const createMilestone = catchAsync(async (req: Request, res: Response) => {
  const result = await MilestoneService.createMilestone(req.body);

  sendResponse(res, {
    httpStatus: status.CREATED,
    success: true,
    message: "Milestone created successfully",
    data: result,
  });
});

const getAllMilestone = catchAsync(async (_req: Request, res: Response) => {
  const result = await MilestoneService.getAllMilestone();

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Milestones retrieved successfully",
    data: result,
  });
});

const getMilestoneById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid milestone id", status.BAD_REQUEST);
  }

  const result = await MilestoneService.getMilestoneById(id);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Milestone retrieved successfully",
    data: result,
  });
});

const updateMilestone = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid milestone id", status.BAD_REQUEST);
  }

  const result = await MilestoneService.updateMilestone(id, req.body);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Milestone updated successfully",
    data: result,
  });
});

const deleteMilestone = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid milestone id", status.BAD_REQUEST);
  }

  const result = await MilestoneService.deleteMilestone(id);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Milestone deleted successfully",
    data: result,
  });
});

export const MilestoneController = {
  createMilestone,
  getAllMilestone,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
};

import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { BatchService } from "./batch.service.js";

const createBatch = catchAsync(async (req: Request, res: Response) => {
	const result = await BatchService.createBatch(req.body);

	sendResponse(res, {
		httpStatus: status.CREATED,
		success: true,
		message: "Batch created successfully",
		data: result,
	});
});

const getAllBatch = catchAsync(async (_req: Request, res: Response) => {
	const result = await BatchService.getAllBatch();

	sendResponse(res, {
		httpStatus: status.OK,
		success: true,
		message: "Batches retrieved successfully",
		data: result,
	});
});

const getBatchById = catchAsync(async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	if (Number.isNaN(id)) {
		throw new AppError("Invalid batch id", status.BAD_REQUEST);
	}

	const result = await BatchService.getBatchById(id);

	sendResponse(res, {
		httpStatus: status.OK,
		success: true,
		message: "Batch retrieved successfully",
		data: result,
	});
});

const updateBatch = catchAsync(async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	if (Number.isNaN(id)) {
		throw new AppError("Invalid batch id", status.BAD_REQUEST);
	}

	const result = await BatchService.updateBatch(id, req.body);

	sendResponse(res, {
		httpStatus: status.OK,
		success: true,
		message: "Batch updated successfully",
		data: result,
	});
});

const deleteBatch = catchAsync(async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	if (Number.isNaN(id)) {
		throw new AppError("Invalid batch id", status.BAD_REQUEST);
	}

	const result = await BatchService.deleteBatch(id);

	sendResponse(res, {
		httpStatus: status.OK,
		success: true,
		message: "Batch deleted successfully",
		data: result,
	});
});

export const BatchController = {
	createBatch,
	getAllBatch,
	getBatchById,
	updateBatch,
	deleteBatch,
};

import type { batch } from "@prisma/client";
import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateBatchPayload, IUpdateBatchPayload } from "./batch.interface.js";

const ensureCourseExists = async (courseID: number) => {
	const course = await prisma.course.findUnique({
		where: { id: courseID },
		select: { id: true },
	});

	if (!course) {
		throw new AppError("Course not found", status.NOT_FOUND);
	}
};

const createBatch = async (payload: ICreateBatchPayload): Promise<batch> => {
	await ensureCourseExists(payload.courseID);

	const existingBatch = await prisma.batch.findFirst({
		where: {
			courseID: payload.courseID,
			isDeleted: false,
		},
		select: { id: true },
	});

	if (existingBatch) {
		throw new AppError("Batch already exists for this course", status.CONFLICT);
	}

	if (payload.endDate <= payload.startDate) {
		throw new AppError("End date must be greater than start date", status.BAD_REQUEST);
	}

	const result = await prisma.batch.create({
		data: {
			name: payload.name,
			courseID: payload.courseID,
			startDate: payload.startDate,
			endDate: payload.endDate,
		},
	});

	return result;
};

const getAllBatch = async (): Promise<batch[]> => {
	const result = await prisma.batch.findMany({
		where: {
			isDeleted: false,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return result;
};

const getBatchById = async (id: number): Promise<batch> => {
	const result = await prisma.batch.findFirst({
		where: {
			id,
			isDeleted: false,
		},
	});

	if (!result) {
		throw new AppError("Batch not found", status.NOT_FOUND);
	}

	return result;
};

const updateBatch = async (id: number, payload: IUpdateBatchPayload): Promise<batch> => {
	const batchExists = await prisma.batch.findUnique({
		where: { id },
	});

	if (!batchExists || batchExists.isDeleted) {
		throw new AppError("Batch not found", status.NOT_FOUND);
	}

	if (payload.courseID !== undefined) {
		await ensureCourseExists(payload.courseID);

		if (payload.courseID !== batchExists.courseID) {
			const duplicateByCourse = await prisma.batch.findFirst({
				where: {
					courseID: payload.courseID,
					isDeleted: false,
					id: {
						not: id,
					},
				},
				select: { id: true },
			});

			if (duplicateByCourse) {
				throw new AppError("Batch already exists for this course", status.CONFLICT);
			}
		}
	}

	const nextStartDate = payload.startDate ?? batchExists.startDate;
	const nextEndDate = payload.endDate ?? batchExists.endDate;

	if (nextEndDate <= nextStartDate) {
		throw new AppError("End date must be greater than start date", status.BAD_REQUEST);
	}

	const result = await prisma.batch.update({
		where: { id },
		data: {
			name: payload.name,
			courseID: payload.courseID,
			startDate: payload.startDate,
			endDate: payload.endDate,
		},
	});

	return result;
};

const deleteBatch = async (id: number): Promise<batch> => {
	const batchExists = await prisma.batch.findUnique({
		where: { id },
	});

	if (!batchExists || batchExists.isDeleted) {
		throw new AppError("Batch not found", status.NOT_FOUND);
	}

	const result = await prisma.batch.update({
		where: { id },
		data: {
			isDeleted: true,
			deletedAt: new Date(),
		},
	});

	return result;
};

export const BatchService = {
	createBatch,
	getAllBatch,
	getBatchById,
	updateBatch,
	deleteBatch,
};

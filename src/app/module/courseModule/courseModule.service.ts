import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateCourseModulePayload, IUpdateCourseModulePayload } from "./courseModule.interface.js";

const ensureMilestoneExists = async (milestoneID: number) => {
  const milestone = await prisma.milestone.findFirst({
    where: {
      id: milestoneID,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!milestone) {
    throw new AppError("Milestone not found", status.NOT_FOUND);
  }
};

const createCourseModule = async (payload: ICreateCourseModulePayload) => {
  await ensureMilestoneExists(payload.milestoneID);

  const result = await prisma.module.create({
    data: {
      title: payload.title,
      description: payload.description,
      milestoneID: payload.milestoneID,
    },
  });

  return result;
};

const getAllCourseModule = async () => {
  const result = await prisma.module.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getCourseModuleById = async (id: number) => {
  const result = await prisma.module.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!result) {
    throw new AppError("Course module not found", status.NOT_FOUND);
  }

  return result;
};

const updateCourseModule = async (id: number, payload: IUpdateCourseModulePayload) => {
  const moduleExists = await prisma.module.findUnique({
    where: {
      id,
    },
  });

  if (!moduleExists || moduleExists.isDeleted) {
    throw new AppError("Course module not found", status.NOT_FOUND);
  }

  if (payload.milestoneID !== undefined) {
    await ensureMilestoneExists(payload.milestoneID);
  }

  const result = await prisma.module.update({
    where: {
      id,
    },
    data: {
      title: payload.title,
      description: payload.description,
      milestoneID: payload.milestoneID,
    },
  });

  return result;
};

const deleteCourseModule = async (id: number) => {
  const moduleExists = await prisma.module.findUnique({
    where: {
      id,
    },
  });

  if (!moduleExists || moduleExists.isDeleted) {
    throw new AppError("Course module not found", status.NOT_FOUND);
  }

  const result = await prisma.module.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return result;
};

export const CourseModuleService = {
  createCourseModule,
  getAllCourseModule,
  getCourseModuleById,
  updateCourseModule,
  deleteCourseModule,
};

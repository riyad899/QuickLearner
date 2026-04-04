import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateMilestonePayload, IUpdateMilestonePayload } from "./milestone.interface.js";

const ensureCourseExists = async (courseID: number) => {
  const course = await prisma.course.findFirst({
    where: {
      id: courseID,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw new AppError("Course not found", status.NOT_FOUND);
  }
};

const createMilestone = async (payload: ICreateMilestonePayload) => {
  await ensureCourseExists(payload.courseID);

  const result = await prisma.milestone.create({
    data: {
      title: payload.title,
      description: payload.description,
      courseID: payload.courseID,
    },
  });

  return result;
};

const getAllMilestone = async () => {
  const result = await prisma.milestone.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getMilestoneById = async (id: number) => {
  const result = await prisma.milestone.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!result) {
    throw new AppError("Milestone not found", status.NOT_FOUND);
  }

  return result;
};

const updateMilestone = async (id: number, payload: IUpdateMilestonePayload) => {
  const milestoneExists = await prisma.milestone.findUnique({
    where: {
      id,
    },
  });

  if (!milestoneExists || milestoneExists.isDeleted) {
    throw new AppError("Milestone not found", status.NOT_FOUND);
  }

  if (payload.courseID !== undefined) {
    await ensureCourseExists(payload.courseID);
  }

  const result = await prisma.milestone.update({
    where: {
      id,
    },
    data: {
      title: payload.title,
      description: payload.description,
      courseID: payload.courseID,
    },
  });

  return result;
};

const deleteMilestone = async (id: number) => {
  const milestoneExists = await prisma.milestone.findUnique({
    where: {
      id,
    },
  });

  if (!milestoneExists || milestoneExists.isDeleted) {
    throw new AppError("Milestone not found", status.NOT_FOUND);
  }

  const result = await prisma.milestone.update({
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

export const MilestoneService = {
  createMilestone,
  getAllMilestone,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
};

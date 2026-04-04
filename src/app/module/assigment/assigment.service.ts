import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateAssigmentPayload, IUpdateAssigmentPayload } from "./assigment.interface.js";

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

const createAssigment = async (payload: ICreateAssigmentPayload) => {
  await ensureModuleExists(payload.moduleID);

  const duplicateByModule = await prisma.assignment.findFirst({
    where: {
      moduleID: payload.moduleID,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (duplicateByModule) {
    throw new AppError("Assignment already exists for this module", status.CONFLICT);
  }

  const result = await prisma.assignment.create({
    data: {
      title: payload.title,
      description: payload.description,
      dueDate: payload.dueDate,
      moduleID: payload.moduleID,
    },
  });

  return result;
};

const getAllAssigment = async () => {
  const result = await prisma.assignment.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getAssigmentById = async (id: number) => {
  const result = await prisma.assignment.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!result) {
    throw new AppError("Assignment not found", status.NOT_FOUND);
  }

  return result;
};

const updateAssigment = async (id: number, payload: IUpdateAssigmentPayload) => {
  const assigmentExists = await prisma.assignment.findUnique({
    where: {
      id,
    },
  });

  if (!assigmentExists || assigmentExists.isDeleted) {
    throw new AppError("Assignment not found", status.NOT_FOUND);
  }

  if (payload.moduleID !== undefined) {
    await ensureModuleExists(payload.moduleID);

    if (payload.moduleID !== assigmentExists.moduleID) {
      const duplicateByModule = await prisma.assignment.findFirst({
        where: {
          moduleID: payload.moduleID,
          isDeleted: false,
          id: {
            not: id,
          },
        },
        select: {
          id: true,
        },
      });

      if (duplicateByModule) {
        throw new AppError("Assignment already exists for this module", status.CONFLICT);
      }
    }
  }

  const result = await prisma.assignment.update({
    where: {
      id,
    },
    data: {
      title: payload.title,
      description: payload.description,
      dueDate: payload.dueDate,
      moduleID: payload.moduleID,
    },
  });

  return result;
};

const deleteAssigment = async (id: number) => {
  const assigmentExists = await prisma.assignment.findUnique({
    where: {
      id,
    },
  });

  if (!assigmentExists || assigmentExists.isDeleted) {
    throw new AppError("Assignment not found", status.NOT_FOUND);
  }

  const result = await prisma.assignment.update({
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

export const AssigmentService = {
  createAssigment,
  getAllAssigment,
  getAssigmentById,
  updateAssigment,
  deleteAssigment,
};

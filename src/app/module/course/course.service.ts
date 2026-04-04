import type { Course } from "@prisma/client";
import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateCoursePayload, IUpdateCoursePayload } from "./course.interface.js";

const ensureInstructorExists = async (instructorID: number) => {
  const instructor = await prisma.instructor.findFirst({
    where: {
      id: instructorID,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!instructor) {
    throw new AppError("Instructor not found", status.NOT_FOUND);
  }
};

const createCourse = async (payload: ICreateCoursePayload): Promise<Course> => {
  await ensureInstructorExists(payload.instructorID);

  const duplicateSlug = await prisma.course.findUnique({
    where: {
      slug: payload.slug,
    },
    select: {
      id: true,
    },
  });

  if (duplicateSlug) {
    throw new AppError("Course slug already exists", status.CONFLICT);
  }

  const result = await prisma.course.create({
    data: {
      title: payload.title,
      description: payload.description,
      thumbnail: payload.thumbnail,
      duration: payload.duration,
      slug: payload.slug,
      fee: payload.fee,
      status: payload.status ?? "draft",
      instructorID: payload.instructorID,
    },
  });

  return result;
};

const getAllCourse = async (): Promise<Course[]> => {
  const result = await prisma.course.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getCourseById = async (id: number): Promise<Course> => {
  const result = await prisma.course.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!result) {
    throw new AppError("Course not found", status.NOT_FOUND);
  }

  return result;
};

const updateCourse = async (id: number, payload: IUpdateCoursePayload): Promise<Course> => {
  const courseExists = await prisma.course.findUnique({
    where: { id },
  });

  if (!courseExists || courseExists.isDeleted) {
    throw new AppError("Course not found", status.NOT_FOUND);
  }

  if (payload.instructorID !== undefined) {
    await ensureInstructorExists(payload.instructorID);
  }

  if (payload.slug && payload.slug !== courseExists.slug) {
    const duplicateSlug = await prisma.course.findUnique({
      where: {
        slug: payload.slug,
      },
      select: {
        id: true,
      },
    });

    if (duplicateSlug) {
      throw new AppError("Course slug already exists", status.CONFLICT);
    }
  }

  const result = await prisma.course.update({
    where: {
      id,
    },
    data: {
      title: payload.title,
      description: payload.description,
      thumbnail: payload.thumbnail,
      duration: payload.duration,
      slug: payload.slug,
      fee: payload.fee,
      status: payload.status,
      instructorID: payload.instructorID,
    },
  });

  return result;
};

const deleteCourse = async (id: number): Promise<Course> => {
  const courseExists = await prisma.course.findUnique({
    where: {
      id,
    },
  });

  if (!courseExists || courseExists.isDeleted) {
    throw new AppError("Course not found", status.NOT_FOUND);
  }

  const result = await prisma.course.update({
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

export const CourseService = {
  createCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
};

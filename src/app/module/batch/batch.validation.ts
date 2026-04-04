import z from "zod";

export const createBatchZodSchema = z
  .object({
    name: z
      .string({ error: "Name is required" })
      .min(2, "Name must be at least 2 characters long")
      .max(255, "Name must be less than 255 characters long"),
    courseID: z.coerce
      .number({ error: "Course id is required" })
      .int("Course id must be an integer")
      .positive("Course id must be positive"),
    startDate: z.coerce.date({ error: "Start date is required" }),
    endDate: z.coerce.date({ error: "End date is required" }),
  })
  .refine((value) => value.endDate > value.startDate, {
    message: "End date must be greater than start date",
    path: ["endDate"],
  });

export const updateBatchZodSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(255, "Name must be less than 255 characters long")
      .optional(),
    courseID: z.coerce.number().int().positive().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  })
  .refine(
    (value) => {
      if (value.startDate && value.endDate) {
        return value.endDate > value.startDate;
      }
      return true;
    },
    {
      message: "End date must be greater than start date",
      path: ["endDate"],
    }
  );

import z from "zod";

export const createMilestoneZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, "Title must be at least 2 characters long")
    .max(255, "Title must be less than 255 characters long"),
  description: z
    .string({ error: "Description is required" })
    .min(3, "Description must be at least 3 characters long"),
  courseID: z.coerce
    .number({ error: "Course id is required" })
    .int("Course id must be an integer")
    .positive("Course id must be positive"),
});

export const updateMilestoneZodSchema = z
  .object({
    title: z.string().min(2).max(255).optional(),
    description: z.string().min(3).optional(),
    courseID: z.coerce.number().int().positive().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  });

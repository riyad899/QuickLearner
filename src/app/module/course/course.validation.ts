import z from "zod";

const courseStatusEnum = z.enum(["draft", "published", "archived"]);

export const createCourseZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, "Title must be at least 2 characters long")
    .max(255, "Title must be less than 255 characters long"),
  description: z.string().max(5000, "Description is too long").optional(),
  thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
  duration: z.coerce
    .number()
    .int("Duration must be an integer")
    .positive("Duration must be positive")
    .optional(),
  slug: z
    .string({ error: "Slug is required" })
    .min(2, "Slug must be at least 2 characters long")
    .max(255, "Slug must be less than 255 characters long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  fee: z.coerce.number().nonnegative("Fee cannot be negative").optional(),
  status: courseStatusEnum.optional(),
  instructorID: z.coerce
    .number({ error: "Instructor id is required" })
    .int("Instructor id must be an integer")
    .positive("Instructor id must be positive"),
});

export const updateCourseZodSchema = z
  .object({
    title: z.string().min(2).max(255).optional(),
    description: z.string().max(5000).optional(),
    thumbnail: z.string().url().optional(),
    duration: z.coerce.number().int().positive().optional(),
    slug: z
      .string()
      .min(2)
      .max(255)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    fee: z.coerce.number().nonnegative().optional(),
    status: courseStatusEnum.optional(),
    instructorID: z.coerce.number().int().positive().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  });

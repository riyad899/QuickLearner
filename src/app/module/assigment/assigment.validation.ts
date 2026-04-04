import z from "zod";

export const createAssigmentZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, "Title must be at least 2 characters long")
    .max(255, "Title must be less than 255 characters long"),
  description: z.string().max(5000, "Description is too long").optional(),
  dueDate: z.coerce.date().optional(),
  moduleID: z.coerce
    .number({ error: "Module id is required" })
    .int("Module id must be an integer")
    .positive("Module id must be positive"),
});

export const updateAssigmentZodSchema = z
  .object({
    title: z.string().min(2).max(255).optional(),
    description: z.string().max(5000).optional(),
    dueDate: z.coerce.date().optional(),
    moduleID: z.coerce.number().int().positive().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  });

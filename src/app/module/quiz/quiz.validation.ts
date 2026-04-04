import z from "zod";

export const createQuizZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, "Title must be at least 2 characters long")
    .max(255, "Title must be less than 255 characters long"),
  courseId: z.coerce
    .number({ error: "Course id is required" })
    .int("Course id must be an integer")
    .positive("Course id must be positive"),
  moduleID: z.coerce
    .number({ error: "Module id is required" })
    .int("Module id must be an integer")
    .positive("Module id must be positive"),
});

export const updateQuizZodSchema = z
  .object({
    title: z.string().min(2).max(255).optional(),
    courseId: z.coerce.number().int().positive().optional(),
    moduleID: z.coerce.number().int().positive().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  });

export const createQuestionZodSchema = z.object({
  text: z
    .string({ error: "Question text is required" })
    .min(1, "Question text is required")
    .max(5000, "Question text is too long"),
  quizId: z.string({ error: "Quiz id is required" }).uuid("Quiz id must be a valid UUID"),
  correctId: z.string({ error: "Correct option id is required" }).uuid("Correct option id must be a valid UUID"),
});

export const createOptionZodSchema = z.object({
  id: z.string().uuid("Option id must be a valid UUID").optional(),
  text: z
    .string({ error: "Option text is required" })
    .min(1, "Option text is required")
    .max(5000, "Option text is too long"),
  questionId: z.string({ error: "Question id is required" }).uuid("Question id must be a valid UUID"),
});

export const createQuizSubmissionZodSchema = z.object({
  quizId: z.string({ error: "Quiz id is required" }).uuid("Quiz id must be a valid UUID"),
  studentId: z.string({ error: "Student id is required" }).min(1, "Student id is required"),
  score: z.coerce.number({ error: "Score is required" }).min(0, "Score cannot be negative"),
});

export const createAnswerZodSchema = z.object({
  questionId: z.string({ error: "Question id is required" }).uuid("Question id must be a valid UUID"),
  selectedOptionId: z
    .string({ error: "Selected option id is required" })
    .uuid("Selected option id must be a valid UUID"),
  submissionId: z.string({ error: "Submission id is required" }).uuid("Submission id must be a valid UUID"),
});

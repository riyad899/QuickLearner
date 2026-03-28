import z from "zod";

export const createInstructorZodSchema = z.object({
    password : z.string("Password is required").min(8, "Password must be at least 8 characters long").max(100, "Password must be less than 100 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    instrucotor : z.object({
        name: z.string("Name is required and must be string").min(2, "Name must be at least 2 characters long").max(50, "Name must be less than 50 characters long").max(50, "Name must be less than 50 characters long"),
        email: z.string("Email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
        age: z.number().int().positive().optional(),
        profilePhoto: z.string().url("Profile photo must be a valid URL").optional(),
        address: z.string("Address is requird").min(5, "Address must be at least 5 characters long").max(100, "Address must be less than 100 characters long").optional(),
        contact: z.string().max(14, "Contact number must be less than 20 characters long").optional(),
        instuctorFee: z.number().positive().optional(),
        exprerince: z.number().int().positive().optional(),
        gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
        instructorBio: z.string().optional(),
    }).strict(),
    specialityId: z.array(z.string()).min(1, "At least one speciality ID is required").max(5, "No more than 5 speciality IDs are allowed"),
});

export const updateInstructorZodSchema = z.object({
    instructor: z
        .object({
            name: z.string().min(2, "Name must be at least 2 characters long").max(50, "Name must be less than 50 characters long").optional(),
            email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format").optional(),
            age: z.number().int().positive().optional(),
            profilePhoto: z.string().url("Profile photo must be a valid URL").optional(),
            address: z.string().min(5, "Address must be at least 5 characters long").max(100, "Address must be less than 100 characters long").optional(),
            contact: z.string().max(14, "Contact number must be less than 20 characters long").optional(),
            instuctorFee: z.number().positive().optional(),
            exprerince: z.number().int().positive().optional(),
            instructorBio: z.string().optional(),
            ratingCount: z.number().int().nonnegative().optional(),
        })
        .strict()
        .refine((value) => Object.keys(value).length > 0, {
            message: "At least one instructor field is required for update",
        }),
    specialityId: z.array(z.string()).min(1, "If provided, specialityId cannot be empty").max(5, "No more than 5 speciality IDs are allowed").optional(),
});
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { InstructorService } from "./instructor.service";
import { sendResponse } from "../../shared/sendResponse";
import { stat } from "node:fs";
import status from "http-status";

const createInstructor = catchAsync(async (payload) => {
    async (req:Request , res:Response) => {
        const payload = req.body;
        const result = await InstructorService.createInstructor(payload);
        sendResponse(res, {
            httpStatus: status.CREATED,
            success: true,
            message: "Instructor created successfully",
            data: result
        })
    }
});

export const InstructorController = {
    createInstructor
}
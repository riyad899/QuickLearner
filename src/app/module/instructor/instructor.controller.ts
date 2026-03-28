import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { InstructorService } from "./instructor.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";

const createInstructor = catchAsync(async (req:Request , res:Response) => {
    const payload = req.body;
    const result = await InstructorService.createInstructor(payload);
    sendResponse(res, {
        httpStatus: status.CREATED,
        success: true,
        message: "Instructor created successfully",
        data: result
    })
});

const getAllInstructor = catchAsync(async (req:Request , res:Response) => {
    const result = await InstructorService.getAllInstructor();
    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Instructor retrieved successfully",
        data: result
    })
});

export const InstructorController = {
    createInstructor
        ,getAllInstructor
}
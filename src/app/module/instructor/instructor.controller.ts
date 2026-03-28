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
const getInstructorById = catchAsync(async (req:Request , res:Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        throw new Error("Invalid instructor id");
    }

    const result = await InstructorService.getInstructorById(id);
    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Instructor retrieved successfully",
        data: result
    })
});

const deleteInstructor = catchAsync(async (req:Request , res:Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        throw new Error("Invalid instructor id");
    }

    const result = await InstructorService.deleteInstructor(id);
    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Instructor deleted successfully",
        data: result
    })
});

const updateInstructor = catchAsync(async (req:Request , res:Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        throw new Error("Invalid instructor id");
    }

    const payload = req.body;
    const result = await InstructorService.updateInstructor(id, payload);
    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Instructor updated successfully",
        data: result
    })
});

export const InstructorController = {
    createInstructor
        ,getAllInstructor
        ,deleteInstructor
        ,updateInstructor
        ,getInstructorById
}
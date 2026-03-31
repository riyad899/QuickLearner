import { SpacialityService } from './spaciality.service.js';
import { Request, Response, NextFunction, RequestHandler } from "express";
import catchAsync from '../../shared/catchAsync.js';
import { sendResponse } from '../../shared/sendResponse.js';




const createspaciality = catchAsync(async (req:Request, res:Response) => {
    const speaciality = await SpacialityService.CreateSpeciality(req.body);
  sendResponse(res, {
    httpStatus: 201,
    success: true,
    message: "Data posted successfully",
    data: speaciality
  });
})


const getAllSpeciality = catchAsync(async (req:Request, res:Response) => {
    const speciality = await SpacialityService.getAllSpeciality();
   sendResponse(res, {
    httpStatus: 200,
    success: true,
    message: "Speciality retrieved successfully",
    data: speciality
  });
})

const deleteSpeciality = catchAsync(async (req:Request, res:Response) => {
    const { id } = req.params;
    const speciality = await SpacialityService.deleteSpeciality(id as string);
 sendResponse(res, {
    httpStatus: 200,
    success: true,
    message: "Speciality deleted successfully",
    data: speciality
  });
})

export const SpacialityController = {
    createspaciality
    ,getAllSpeciality
    ,deleteSpeciality
}
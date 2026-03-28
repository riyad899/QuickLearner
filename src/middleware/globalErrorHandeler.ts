import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { env } from "node:process";
import z from "zod";
import { IError, IErrorResponse } from "../app/interfaces/globalError.interface";
import { handleZodErrors } from "../app/errorHelpers/handleZodErrors";


export const globalErrorHandler = (err: any , req: Request, res: Response, next:NextFunction) => {
   if(env.NODE_ENV === "development"){
    console.error("Error:", err);
   }
const errorSource:IError[] = []
let statusCode:number = status.INTERNAL_SERVER_ERROR;
let message:string = "Internal Server Error";

if (err instanceof z.ZodError) {
  const zodErrorResponse = handleZodErrors(err);
  statusCode = zodErrorResponse.statusCode || status.INTERNAL_SERVER_ERROR;
  message = zodErrorResponse.message || "Validation error";
  if (zodErrorResponse.errorSource) {
    errorSource.push(...zodErrorResponse.errorSource);
  }
}

   if (err.statusCode && typeof err.statusCode === "number") {
     statusCode = err.statusCode;
   }

   if (!(err instanceof z.ZodError) && err.message && typeof err.message === "string") {
     message = err.message;
   }

   const errorResponse:IErrorResponse = {
    success: false,
    message:message,
    statusCode: statusCode,
    errorSource: errorSource.length > 0 ? errorSource : undefined,
    error: env.NODE_ENV === "development" ? err : undefined,
   }

  res.status(statusCode).json(errorResponse);
}
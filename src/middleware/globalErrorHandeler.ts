import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { env } from "node:process";

export const globalErrorHandler = (err: any , req: Request, res: Response, next:NextFunction) => {
   if(env.NODE_ENV === "development"){
    console.error("Error:", err);
   }

let statusCode:number = status.INTERNAL_SERVER_ERROR;
let message:string = "Internal Server Error";


   if (err.statusCode && typeof err.statusCode === "number") {
     statusCode = err.statusCode;
   }

   if (err.message && typeof err.message === "string") {
     message = err.message;
   }

  res.status(statusCode).json({
    success: false,
    message,
    error: err instanceof Error ? err.message : "Unknown error",
  });
}
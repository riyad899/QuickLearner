
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { authService } from "./auth.service.js";
import AppError from "../../errorHelpers/appError.js";

const register = catchAsync(async (req, res) => {
  const { name, email, password, age, address, contact } = req.body;
  const payload = await authService.register(
    {
      name,
      email,
      password,
      age: age !== undefined ? Number(age) : undefined,
      address,
      contact,
    },
    req.headers
  );

  if (payload.setCookies.length > 0) {
    res.setHeader("Set-Cookie", payload.setCookies);
  }

 sendResponse(res, {
    httpStatus: status.CREATED,
    success: true,
    message: "Student registered successfully",
    data: payload.data,
});
});

const LoginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const data = await authService.LoginUser({ email, password });

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "User logged in successfully",
    data,
});
});

const updateStudent = catchAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid student id", status.BAD_REQUEST);
  }

  const data = await authService.updateStudent(id, req.body);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Student updated successfully",
    data,
  });
});

export const AuthController = {
  register,
    LoginUser,
    updateStudent,
};
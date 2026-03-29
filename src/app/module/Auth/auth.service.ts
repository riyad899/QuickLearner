
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { IncomingHttpHeaders } from "http";
import { Prisma, userStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import status from "http-status";
import AppError from "../../errorHelpers/appError.js";


interface IRegisteStudentPayload {
  name: string;
  email: string;
  password: string;
  age?: number;
  address?: string;
  contact?: string;
};




const register = async (payload:IRegisteStudentPayload, requestHeaders: IncomingHttpHeaders) => {
    const { name, email, password, age, address, contact } = payload;

    if (age !== undefined && (!Number.isInteger(age) || age <= 0)) {
      throw new AppError("Valid age is required to create student profile", status.BAD_REQUEST);
    }

    if (address !== undefined && !address.trim()) {
      throw new AppError("Address cannot be empty", status.BAD_REQUEST);
    }

    const response = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password
      },
      headers: fromNodeHeaders(requestHeaders),
      asResponse: true,
    } as any) as Response;

    const setCookies =
      typeof (response.headers as any).getSetCookie === "function"
        ? (response.headers as any).getSetCookie()
        : (response.headers.get("set-cookie") ? [response.headers.get("set-cookie") as string] : []);

    const data = await response.json();
     if(!data?.user) {
      throw new AppError("Failed to create user", status.INTERNAL_SERVER_ERROR);
     }

     try {
      const student = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const studentData = {
          name,
          email,
          ...(age !== undefined ? { age } : {}),
          ...(address !== undefined ? { address: address.trim() } : {}),
          ...(contact !== undefined ? { contact } : {}),
          user: {
            connect: {
              id: data.user.id,
            },
          },
        };

        return tx.student.create({
          data: studentData,
        });
      });

      return {
        data: {
          ...data,
          student,
        },
        setCookies,
      };
     } catch {
      await prisma.user.delete({ where: { id: data.user.id } }).catch(() => undefined);
      throw new AppError("Failed to create student profile", status.INTERNAL_SERVER_ERROR);
     }
    };

interface ILoginUserPayload {
  email: string;
  password: string;
}

interface IUpdateStudentPayload {
  name?: string;
  email?: string;
  age?: number;
  address?: string;
  contact?: string;
}


    const LoginUser = async (payload :ILoginUserPayload)=>{
      const { email, password } = payload;
      const data = await auth.api.signInEmail({
        body: {
          email,
          password
        },
      });

      if(!data?.user) {
        throw new AppError("Failed to login user", status.UNAUTHORIZED);
       }
       if (data.user.status === userStatus.INACTIVE){
        throw new AppError("User account is inactive. Please contact support.", status.FORBIDDEN);
       }
      if (data.user.status === userStatus.DELETED || data.user.isdeleted) {
        throw new AppError("User account is deleted. Please contact support.", status.FORBIDDEN);
       }

      return data;
    }

const updateStudent = async (id: number, payload: IUpdateStudentPayload) => {
  const studentExist = await prisma.student.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!studentExist) {
    throw new AppError("Student not found", status.NOT_FOUND);
  }

  if (studentExist.isDeleted) {
    throw new AppError("Cannot update a deleted student", status.BAD_REQUEST);
  }

  if (payload.email) {
    const emailAlreadyInUse = await prisma.student.findFirst({
      where: {
        email: payload.email,
        id: {
          not: id,
        },
      },
      select: {
        id: true,
      },
    });

    if (emailAlreadyInUse) {
      throw new AppError("Student email already exists", status.CONFLICT);
    }
  }

  const updatedStudent = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const student = await tx.student.update({
      where: { id },
      data: {
        name: payload.name,
        email: payload.email,
        age: payload.age,
        address: payload.address?.trim(),
        contact: payload.contact,
      },
    });

    if (studentExist.user?.id) {
      await tx.user.update({
        where: {
          id: studentExist.user.id,
        },
        data: {
          name: payload.name,
          email: payload.email,
        },
      });
    }

    return student;
  });

  return updatedStudent;
};
export const authService = {
  register,
  LoginUser,
  updateStudent,
};
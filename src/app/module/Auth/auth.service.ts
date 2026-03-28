
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { IncomingHttpHeaders } from "http";
import { Prisma, userStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

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
      throw new Error("Valid age is required to create student profile");
    }

    if (address !== undefined && !address.trim()) {
      throw new Error("Address cannot be empty");
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
      throw new Error("Failed to create user");
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
      throw new Error("Failed to create student profile");
     }
    };

interface ILoginUserPayload {
  email: string;
  password: string;
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
        throw new Error("Failed to login user");
       }
       if (data.user.status === userStatus.INACTIVE){
        throw new Error("User account is inactive. Please contact support.");
       }
      if (data.user.status === userStatus.DELETED || data.user.isdeleted) {
        throw new Error("User account is deleted. Please contact support.");
       }

      return data;
    }
export const authService = {
  register,
  LoginUser,
};
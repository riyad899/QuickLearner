
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { IncomingHttpHeaders } from "http";
import { Prisma, userStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import status from "http-status";
import AppError from "../../errorHelpers/appError.js";
import { tokenUtils } from "../../utils/token.js";
import { IchanegPasswordPayload } from "./auth.interface.js";
import { jwtUtils } from "../../utils/jwt.js";
import { envVars } from "../../../config/env.js";
import { JwtPayload } from "jsonwebtoken";
import { get } from "https";


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
      const accessToken = tokenUtils.getAccessToken(
        { userId: data.user.id,
           email: data.user.email,
           role: data.user.role,
           status: data.user.status,
           isDeleted: data.user.isdeleted,
           emailVerified: data.user.emailVerified

          }
      );
        const refreshToken = tokenUtils.getRefreshToken(
          { userId: data.user.id,
             email: data.user.email,
             role: data.user.role,
             status: data.user.status,
             isDeleted: data.user.isdeleted,
             emailVerified: data.user.emailVerified

            }
        );
      return {
        data: {
          ...data,
          student,
          accessToken,
          refreshToken
        },
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

      const accessToken = tokenUtils.getAccessToken(
        { userId: data.user.id,
           email: data.user.email,
           role: data.user.role,
           status: data.user.status,
           isDeleted: data.user.isdeleted,
           emailVerified: data.user.emailVerified

          }
      );
        const refreshToken = tokenUtils.getRefreshToken(
          { userId: data.user.id,
             email: data.user.email,
             role: data.user.role,
             status: data.user.status,
             isDeleted: data.user.isdeleted,
             emailVerified: data.user.emailVerified

            }
        );


      return {
        ...data,
        accessToken,
        refreshToken
      };
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


const changePassword = async (payload: IchanegPasswordPayload, sessionToken: string) => {
    const session = await auth.api.getSession({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    if (!session) {
      throw new AppError("Invalid session token", status.UNAUTHORIZED);
    }

    const { currentPassword, newPassword } = payload;

    const result = await auth.api.changePassword({
        body :{
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
        },
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    if (session.user.needsPasswordReset) {
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
          needsPasswordReset: false,
            }
        })
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isdeleted,
        emailVerified: session.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isdeleted,
        emailVerified: session.user.emailVerified,
    });


    return {
        ...result,
        accessToken,
        refreshToken,
    }
}

const getMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    include: {
      student: true,
      instructor: true,
    },
    });

    if (!user) {
        throw new AppError("User not found", status.NOT_FOUND);
    }

    return user;
}

const getNewToken = async (refreshToken : string, sessionToken : string) => {

    const isSessionTokenExists = await prisma.session.findUnique({
        where : {
            token : sessionToken,
        },
        include : {
            user : true,
        }
    })

    if(!isSessionTokenExists){
        throw new AppError("Invalid session token",status.UNAUTHORIZED);
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET)


    if(!verifiedRefreshToken.success && verifiedRefreshToken.error){
        throw new AppError("Invalid refresh token",status.UNAUTHORIZED);
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const {token} = await prisma.session.update({
        where : {
            token : sessionToken
        },
        data : {
            token : sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }
    })

    return {
        accessToken : newAccessToken,
        refreshToken : newRefreshToken,
        sessionToken : token,
    }

}


const logoutUser = async (sessionToken : string) => {
    const result = await auth.api.signOut({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    return result;
}


export const authService = {
  register,
  LoginUser,
  updateStudent,
  changePassword,
  getNewToken,
  getMe,
  logoutUser,
};
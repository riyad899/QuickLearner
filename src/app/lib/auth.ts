import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { userStatus, Role } from "@prisma/client";
import { envVars } from "../../config/env.js";
import { bearer } from "better-auth/plugins";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword:{
        enabled: true,
    },

    user: {
      additionalFields: {
        role: {
          type: "string",
            required: true,
            defaultValue: Role.STUDENT,
        },
        status: {
          type: "string",
          required: true,
          defaultValue: userStatus.ACTIVE,
        },
        needsPasswordReset: {
          type: "boolean",
          required: true,
          defaultValue: false,
        },
        isdeleted: {
          type: "boolean",
          required: true,
          defaultValue: false,
        },
        deletedAt: {
          type: "date",
          required: false,
        }

      },
    },
    plugins: [
      bearer()
    ],
       session: {
        expiresIn: 60 * 60 * 60 * 24, // 1 day in seconds
        updateAge: 60 * 60 * 60 * 24, // 1 day in seconds
        cookieCache: {
          enabled: false,
            maxAge: 60 * 60 * 60 * 24, // 1 day in seconds
        }
    },

});
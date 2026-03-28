import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { userStatus, Role } from "@prisma/client";


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
});
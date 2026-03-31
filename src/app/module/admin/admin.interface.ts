import { userStatus } from "@prisma/client";

export interface IUpdateAdminPayload {
    admin?: {
        name?: string;
        profilePhoto?: string;
        status?: userStatus;
    }
}
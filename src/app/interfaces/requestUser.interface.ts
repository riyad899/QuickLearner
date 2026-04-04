import type { Role } from "@prisma/client";


export interface IRequestUser{
    userId : string;
    role : Role;
    email : string;
}
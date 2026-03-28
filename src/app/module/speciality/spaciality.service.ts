import type { Speciality } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

const CreateSpeciality = async (playload: Speciality) : Promise <Speciality> => {
    const speciality = await prisma.speciality.create({
  data: playload
    })
    return speciality;
}

const getAllSpeciality = async ():Promise <Speciality[]>  => {
 const speciality = await prisma.speciality.findMany();
 return speciality;
}

const deleteSpeciality = async (id:string): Promise<Speciality >  => {
    const speciality = await prisma.speciality.delete({
        where: {
            id
        }
    })
    return speciality;
}

export const SpacialityService = {
    CreateSpeciality
    ,getAllSpeciality
    ,deleteSpeciality
}
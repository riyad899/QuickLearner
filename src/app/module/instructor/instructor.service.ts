
import { Role, type Speciality } from '@prisma/client';
import { auth } from '../../lib/auth.js';
import { prisma } from '../../lib/prisma.js';
import { ICreateInstructorPayload } from './instructor.interface.js';


const createInstructor = async (payload :ICreateInstructorPayload ) => {
   const speciality : Speciality[] = [];

   for (const id of payload.specialityId) {
    const specialityData = await prisma.speciality.findUnique({
        where: {
            id
        }
    });
    if (!specialityData) {
        throw new Error(`Speciality with id ${id} not found`);
    }

    if (specialityData) {
        speciality.push(specialityData);
    }
   }


   const userExist = await prisma.user.findUnique({
    where: {
        email: payload.instrucotor.email
    }
   });

   if (userExist) {
    throw new Error("User with this email already exist");
   }

    const authInstructor = await auth.api.signUpEmail({
   body: {
    name: payload.instrucotor.name,
    email: payload.instrucotor.email,
    password: payload.password,
       role: Role.INSTRUCTOR,
       needsPasswordReset: true
   }
   } as any) as any;

   try{
    const result = await prisma.$transaction(async (tx: any) => {
        const instructorData = await tx.instructor.create({
            data: {
                            userID: authInstructor.user.id,
                            name: payload.instrucotor.name,
                            email: payload.instrucotor.email,
                            profilePhoto: payload.instrucotor.profilePhoto,
                            contactNumber: payload.instrucotor.contact,
                            instuctorFee: payload.instrucotor.instuctorFee,
                            experience: payload.instrucotor.exprerince,
                            instructorBio: payload.instrucotor.instructorBio,
                            phone: payload.instrucotor.contact ?? `TEMP-${Date.now()}`,
                            regitretionNumber: `INS-${Date.now()}`,
                            specialityId: speciality[0].id,
            },
          });
          const instructorSpecialityData = speciality.map((speciality) => ({
            instructorId: instructorData.id,
            specialityId: speciality.id,
          }));
          await tx.instructorSpeciality.createMany({
            data: instructorSpecialityData,
          });
                    const createdInstructor = await tx.instructor.findUnique({
            where: {
                id: instructorData.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                profilePhoto: true,
                contactNumber: true,
                instuctorFee: true,
                experience: true,
                instructorBio: true,
                phone: true,
                regitretionNumber: true,
                specialityId: true,
                userID: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        status: true,
                        emailVerified: true,
                    }
                },
                specialities: {
                    select: {
                        speciality: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                },
            }
          });
                    return createdInstructor;
    });
        return result;
   }catch(error) {
       console.log("Transection Error : " + error)
                await prisma.user.delete({ where: { id: authInstructor.user.id } }).catch(() => undefined);
    throw error;
   }
};


 const getAllInstructor = async () => {
    const instructor = await prisma.instructor.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    emailVerified: true,
                    createdAt: true,
                    updatedAt: true,
                }
            },
            speciality: true,
            specialities: {
                include: {
                    speciality: true,
                }
            },
            courses: true,
        }
    });

    return {
        total: instructor.length,
        data: instructor,
    };
}

// const deleteInstructor = async (id:string) => {
//     const instructor = await prisma.instructor.delete({
//         where: {
//             id
//         }
//     })
//     return instructor;
// }







export const InstructorService = {
    createInstructor,
    getAllInstructor
};


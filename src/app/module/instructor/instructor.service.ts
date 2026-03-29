
import { Role, type Speciality } from '@prisma/client';
import { auth } from '../../lib/auth.js';
import { prisma } from '../../lib/prisma.js';
import { ICreateInstructorPayload, IUpdateInstructorPayload } from './instructor.interface.js';
import status from 'http-status';
import AppError from '../../errorHelpers/appError.js';


const createInstructor = async (payload :ICreateInstructorPayload ) => {
    if (!payload.specialityId?.length) {
    throw new AppError("At least one speciality is required", status.BAD_REQUEST);
    }

   const speciality : Speciality[] = [];

   for (const id of payload.specialityId) {
    const specialityData = await prisma.speciality.findUnique({
        where: {
            id
        }
    });
    if (!specialityData) {
        throw new AppError(`Speciality with id ${id} not found`, status.NOT_FOUND);
    }

    speciality.push(specialityData);
   }


   const userExist = await prisma.user.findUnique({
    where: {
        email: payload.instrucotor.email
    }
   });

   if (userExist) {
    throw new AppError("User with this email already exist", status.CONFLICT);
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
                            instuctorFee: payload.instrucotor.instuctorFee,
                            experience: payload.instrucotor.exprerince,
                            instructorBio: payload.instrucotor.instructorBio,
                                                        ratingCount: payload.instrucotor.ratingCount ?? 0,
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
                instuctorFee: true,
                experience: true,
                instructorBio: true,
                ratingCount: true,
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
    if (error instanceof AppError) {
        throw new AppError(error.message, error.statusCode, error.stack);
    }
    if (error instanceof Error) {
        throw new AppError(error.message, status.INTERNAL_SERVER_ERROR);
    }
    throw new AppError("Failed to create instructor", status.INTERNAL_SERVER_ERROR);
   }
};


 const getAllInstructor = async () => {
    const instructor = await prisma.instructor.findMany({
        where: {
            isDeleted: false,
        },
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

            specialities: {
                select: {
                    speciality: {
                        select: {
                            title: true,
                            description: true,
                            icon: true,
                        }
                    }
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

const getInstructorById = async (id:number) => {
    const instructor = await prisma.instructor.findFirst({
        where: {
            id,
            isDeleted: false,
        },
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

            specialities: {
                select: {
                    speciality: {
                        select: {
                            title: true,
                            description: true,
                            icon: true,
                        }
                    }
                }
            },
            courses: true,
        }
    });

    if (!instructor) {
        throw new AppError("Instructor not found", status.NOT_FOUND);
    }

    return instructor;
}


const deleteInstructor = async (id:number) => {
    const instructorExist = await prisma.instructor.findUnique({
        where: { id },
    });

    if (!instructorExist) {
        throw new AppError("Instructor not found", status.NOT_FOUND);
    }

    if (instructorExist.isDeleted) {
        throw new AppError("Instructor already deleted", status.BAD_REQUEST);
    }

    const instructor = await prisma.instructor.update({
        where: {
            id
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        }
    })
    return instructor;
}

// const deleteInstructor = async (id:string) => {
//     const instructor = await prisma.instructor.delete({
//         where: {
//             id
//         }
//     })
//     return instructor;
// }

const updateInstructor = async (id:number, payload: IUpdateInstructorPayload) => {
    const instructorExist = await prisma.instructor.findUnique({
        where: { id },
    });

    if (!instructorExist) {
        throw new AppError("Instructor not found", status.NOT_FOUND);
    }

    if (instructorExist.isDeleted) {
        throw new AppError("Cannot update a deleted instructor", status.BAD_REQUEST);
    }

    const speciality: Speciality[] = [];
    const specialityIds = payload.specialityId;
    const hasSpecialityUpdate = Array.isArray(specialityIds);

    if (specialityIds) {
        if (specialityIds.length === 0) {
            throw new AppError("If specialityId is provided, it cannot be empty", status.BAD_REQUEST);
        }

        for (const specialityId of specialityIds) {
            const specialityData = await prisma.speciality.findUnique({
                where: {
                    id: specialityId,
                },
            });

            if (!specialityData) {
                throw new AppError(`Speciality with id ${specialityId} not found`, status.NOT_FOUND);
            }

            speciality.push(specialityData);
        }
    }

    const result = await prisma.$transaction(async (tx: any) => {
        const updatedInstructor = await tx.instructor.update({
            where: {
                id,
            },
            data: {
                name: payload.instructor.name,
                email: payload.instructor.email,
                profilePhoto: payload.instructor.profilePhoto,
                phone: payload.instructor.contact,
                instuctorFee: payload.instructor.instuctorFee,
                experience: payload.instructor.exprerince,
                instructorBio: payload.instructor.instructorBio,
                ratingCount: payload.instructor.ratingCount,
                specialityId: hasSpecialityUpdate ? speciality[0].id : undefined,
            },
        });

        if (hasSpecialityUpdate) {
            await tx.instructorSpeciality.deleteMany({
                where: {
                    instructorId: id,
                },
            });

            await tx.instructorSpeciality.createMany({
                data: speciality.map((item) => ({
                    instructorId: id,
                    specialityId: item.id,
                })),
            });
        }

        const data = await tx.instructor.findUnique({
            where: {
                id: updatedInstructor.id,
            },
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
                    },
                },

                   specialities: {
                select: {
                    speciality: {
                        select: {
                            title: true,
                            description: true,
                            icon: true,
                        }
                    }
                }
            },
                courses: true,
            },
        });

        return data;
    });

    return result;
}



export const InstructorService = {
    createInstructor,
    getAllInstructor,
    deleteInstructor,
    updateInstructor,
    getInstructorById
};


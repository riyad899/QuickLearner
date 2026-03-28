
export interface ICreateInstructorPayload{
    password : string;
    instrucotor : {
    name: string;
    email: string;
    age?: number;
    profilePhoto?: string;
    address?: string;
    contact?: string;
    instuctorFee ?: number;
    exprerince?: number;
    gender?: string;
    instructorBio?: string;

}
 specialityId: string[];

}


// model Instructor {
//         id                Int        @id @default(autoincrement())
//         name              String
//         email             String     @unique
//         phone             String     @unique
//         profilePhoto      String?
//         contactNumber     String?
//         isDeleted         Boolean    @default(false)
//         deletedAt         DateTime?
//         regitretionNumber String     @unique
//         experience        Int?
//         gender            GENDER?
//         instructorBio     String?
//         instructorRating  Float?     @default(0)
//         instuctorFee      Float?
//         createdAt         DateTime   @default(now())
//         updatedAt         DateTime   @updatedAt

//         specialityId      String
//         speciality        Speciality @relation(fields: [specialityId], references: [id], onDelete: Cascade, onUpdate: Cascade)
//         courses           Course[]
//         userID            String     @unique
//         user              User       @relation(fields: [userID], references: [id], onDelete: Cascade, onUpdate: Cascade)
//        specialities      InstructorSpeciality[]
//         @@index([specialityId], name: "idx_instructor_speciality")
//         @@index([isDeleted], name: "idx_instructor_isDeleted")
//         @@map("instructors")
// }

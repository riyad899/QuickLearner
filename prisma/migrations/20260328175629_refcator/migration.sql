/*
  Warnings:

  - You are about to drop the column `contactNumber` on the `instructors` table. All the data in the column will be lost.
  - You are about to drop the `_CourseToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CourseToStudent" DROP CONSTRAINT "_CourseToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToStudent" DROP CONSTRAINT "_CourseToStudent_B_fkey";

-- AlterTable
ALTER TABLE "instructors" DROP COLUMN "contactNumber";

-- DropTable
DROP TABLE "_CourseToStudent";

-- CreateTable
CREATE TABLE "assignments" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "moduleID" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_enrollments" (
    "id" SERIAL NOT NULL,
    "studentID" INTEGER NOT NULL,
    "courseID" INTEGER NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructor_assignments" (
    "id" SERIAL NOT NULL,
    "courseID" INTEGER NOT NULL,
    "instructorID" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "instructor_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "courseID" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "milestoneID" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "totalMarks" INTEGER,
    "moduleID" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "moduleID" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assignments_moduleID_key" ON "assignments"("moduleID");

-- CreateIndex
CREATE INDEX "idx_assignment_isDeleted" ON "assignments"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_student_enroll_student" ON "student_enrollments"("studentID");

-- CreateIndex
CREATE INDEX "idx_student_enroll_course" ON "student_enrollments"("courseID");

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_studentID_courseID_key" ON "student_enrollments"("studentID", "courseID");

-- CreateIndex
CREATE INDEX "idx_instructor_assign_course" ON "instructor_assignments"("courseID");

-- CreateIndex
CREATE INDEX "idx_instructor_assign_instructor" ON "instructor_assignments"("instructorID");

-- CreateIndex
CREATE INDEX "idx_milestone_course" ON "milestones"("courseID");

-- CreateIndex
CREATE INDEX "idx_milestone_isDeleted" ON "milestones"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_module_milestone" ON "modules"("milestoneID");

-- CreateIndex
CREATE INDEX "idx_module_isDeleted" ON "modules"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_moduleID_key" ON "quizzes"("moduleID");

-- CreateIndex
CREATE INDEX "idx_quiz_isDeleted" ON "quizzes"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_video_module" ON "videos"("moduleID");

-- CreateIndex
CREATE INDEX "idx_video_isDeleted" ON "videos"("isDeleted");

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_moduleID_fkey" FOREIGN KEY ("moduleID") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_courseID_fkey" FOREIGN KEY ("courseID") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_assignments" ADD CONSTRAINT "instructor_assignments_courseID_fkey" FOREIGN KEY ("courseID") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_assignments" ADD CONSTRAINT "instructor_assignments_instructorID_fkey" FOREIGN KEY ("instructorID") REFERENCES "instructors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_courseID_fkey" FOREIGN KEY ("courseID") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_milestoneID_fkey" FOREIGN KEY ("milestoneID") REFERENCES "milestones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_moduleID_fkey" FOREIGN KEY ("moduleID") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_moduleID_fkey" FOREIGN KEY ("moduleID") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

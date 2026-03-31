-- CreateTable
CREATE TABLE "batches" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "courseID" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batches_courseID_key" ON "batches"("courseID");

-- CreateIndex
CREATE INDEX "idx_batch_course" ON "batches"("courseID");

-- CreateIndex
CREATE INDEX "idx_batch_isDeleted" ON "batches"("isDeleted");

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_courseID_fkey" FOREIGN KEY ("courseID") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `activity_type` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_id` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_name` on the `Activity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacherId,activityType,subject,class,createdAt]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activityType` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('LESSON', 'QUIZ', 'ASSESSMENT');

-- DropIndex
DROP INDEX "Activity_created_at_idx";

-- DropIndex
DROP INDEX "Activity_teacher_id_activity_type_subject_class_created_at_key";

-- DropIndex
DROP INDEX "Activity_teacher_id_idx";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "activity_type",
DROP COLUMN "created_at",
DROP COLUMN "teacher_id",
DROP COLUMN "teacher_name",
ADD COLUMN     "activityType" "ActivityType" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE INDEX "Teacher_name_idx" ON "Teacher"("name");

-- CreateIndex
CREATE INDEX "Activity_teacherId_idx" ON "Activity"("teacherId");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_teacherId_activityType_subject_class_createdAt_key" ON "Activity"("teacherId", "activityType", "subject", "class", "createdAt");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

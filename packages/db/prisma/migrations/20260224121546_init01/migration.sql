-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "teacher_name" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Activity_teacher_id_idx" ON "Activity"("teacher_id");

-- CreateIndex
CREATE INDEX "Activity_created_at_idx" ON "Activity"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_teacher_id_activity_type_subject_class_created_at_key" ON "Activity"("teacher_id", "activity_type", "subject", "class", "created_at");

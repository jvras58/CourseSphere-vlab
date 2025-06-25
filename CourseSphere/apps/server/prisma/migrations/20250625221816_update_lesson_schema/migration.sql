/*
  Warnings:

  - A unique constraint covering the columns `[title,course_id]` on the table `lessons` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "lessons_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "lessons_title_course_id_key" ON "lessons"("title", "course_id");

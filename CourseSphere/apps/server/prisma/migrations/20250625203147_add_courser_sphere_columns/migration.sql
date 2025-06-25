-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "creator_id" TEXT NOT NULL,
    CONSTRAINT "courses_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "course_instructors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "course_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "course_instructors_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "course_instructors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "course_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "course_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "course_students_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "course_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publish_date" DATETIME NOT NULL,
    "video_url" TEXT NOT NULL,
    "youtube_id" TEXT,
    "thumbnail_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "course_id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    CONSTRAINT "lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lessons_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_name_key" ON "courses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "course_instructors_course_id_user_id_key" ON "course_instructors"("course_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_students_course_id_student_id_key" ON "course_students"("course_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_title_key" ON "lessons"("title");

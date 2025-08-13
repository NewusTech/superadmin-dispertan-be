/*
  Warnings:

  - A unique constraint covering the columns `[question]` on the table `Faq` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "telp" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Faq_question_key" ON "Faq"("question");

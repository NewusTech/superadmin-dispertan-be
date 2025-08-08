/*
  Warnings:

  - You are about to drop the column `asanswerOptions` on the `PertanyaanSkm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "PertanyaanSkm" DROP COLUMN "asanswerOptions",
ADD COLUMN     "answerOptions" TEXT;

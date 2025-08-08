/*
  Warnings:

  - You are about to drop the column `asanswer` on the `JawabanSkm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JawabanSkm" DROP COLUMN "asanswer",
ADD COLUMN     "answer" TEXT;

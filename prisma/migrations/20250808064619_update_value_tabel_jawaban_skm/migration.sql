/*
  Warnings:

  - You are about to drop the column `pertanyaanSkmId` on the `JawabanSkm` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "JawabanSkm" DROP CONSTRAINT "JawabanSkm_pertanyaanSkmId_fkey";

-- AlterTable
ALTER TABLE "JawabanSkm" DROP COLUMN "pertanyaanSkmId";

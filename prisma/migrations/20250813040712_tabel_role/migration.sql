/*
  Warnings:

  - The `roleType` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "roleType",
ADD COLUMN     "roleType" "RoleType" NOT NULL DEFAULT 'USER';

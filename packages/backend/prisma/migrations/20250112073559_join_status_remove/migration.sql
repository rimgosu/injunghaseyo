/*
  Warnings:

  - You are about to drop the column `status` on the `Join` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Join" DROP COLUMN "status";

-- DropEnum
DROP TYPE "JoinStatus";

/*
  Warnings:

  - You are about to drop the column `method` on the `ProofMethod` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProofType" AS ENUM ('UPLOAD_PHOTO', 'CLICK_BUTTON', 'CHECK_LOCATION');

-- AlterTable
ALTER TABLE "ProofMethod" DROP COLUMN "method",
ADD COLUMN     "contents" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "fromMin" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "toMin" INTEGER NOT NULL DEFAULT 2400,
ADD COLUMN     "type" "ProofType" NOT NULL DEFAULT 'UPLOAD_PHOTO';

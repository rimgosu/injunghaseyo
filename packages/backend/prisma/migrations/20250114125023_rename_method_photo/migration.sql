/*
  Warnings:

  - You are about to drop the column `groupPhotoId` on the `PhotoComment` table. All the data in the column will be lost.
  - You are about to drop the `GroupMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupPhoto` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `proofPhotoId` to the `PhotoComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroupMethod" DROP CONSTRAINT "GroupMethod_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupPhoto" DROP CONSTRAINT "GroupPhoto_groupProgressId_fkey";

-- DropForeignKey
ALTER TABLE "PhotoComment" DROP CONSTRAINT "PhotoComment_groupPhotoId_fkey";

-- AlterTable
ALTER TABLE "PhotoComment" DROP COLUMN "groupPhotoId",
ADD COLUMN     "proofPhotoId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "GroupMethod";

-- DropTable
DROP TABLE "GroupPhoto";

-- CreateTable
CREATE TABLE "ProofMethod" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProofMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProofPhoto" (
    "id" SERIAL NOT NULL,
    "groupProgressId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "like" INTEGER NOT NULL DEFAULT 0,
    "view" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProofPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProofPhoto_groupProgressId_key" ON "ProofPhoto"("groupProgressId");

-- AddForeignKey
ALTER TABLE "PhotoComment" ADD CONSTRAINT "PhotoComment_proofPhotoId_fkey" FOREIGN KEY ("proofPhotoId") REFERENCES "ProofPhoto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofMethod" ADD CONSTRAINT "ProofMethod_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofPhoto" ADD CONSTRAINT "ProofPhoto_groupProgressId_fkey" FOREIGN KEY ("groupProgressId") REFERENCES "GroupProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

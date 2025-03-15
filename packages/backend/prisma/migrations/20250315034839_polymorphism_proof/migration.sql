/*
  Warnings:

  - You are about to drop the column `proofPhotoId` on the `PhotoComment` table. All the data in the column will be lost.
  - You are about to drop the `ProofPhoto` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `proofId` to the `PhotoComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PhotoComment" DROP CONSTRAINT "PhotoComment_proofPhotoId_fkey";

-- DropForeignKey
ALTER TABLE "ProofPhoto" DROP CONSTRAINT "ProofPhoto_groupProgressId_fkey";

-- AlterTable
ALTER TABLE "PhotoComment" DROP COLUMN "proofPhotoId",
ADD COLUMN     "proofId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ProofPhoto";

-- CreateTable
CREATE TABLE "Proof" (
    "id" SERIAL NOT NULL,
    "groupProgressId" INTEGER NOT NULL,
    "like" INTEGER NOT NULL DEFAULT 0,
    "view" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Proof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoProof" (
    "id" SERIAL NOT NULL,
    "proofId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PhotoProof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ButtonClickProof" (
    "id" SERIAL NOT NULL,
    "proofId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ButtonClickProof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationProof" (
    "id" SERIAL NOT NULL,
    "proofId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LocationProof_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proof_groupProgressId_key" ON "Proof"("groupProgressId");

-- AddForeignKey
ALTER TABLE "PhotoComment" ADD CONSTRAINT "PhotoComment_proofId_fkey" FOREIGN KEY ("proofId") REFERENCES "Proof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proof" ADD CONSTRAINT "Proof_groupProgressId_fkey" FOREIGN KEY ("groupProgressId") REFERENCES "GroupProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoProof" ADD CONSTRAINT "PhotoProof_proofId_fkey" FOREIGN KEY ("proofId") REFERENCES "Proof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ButtonClickProof" ADD CONSTRAINT "ButtonClickProof_proofId_fkey" FOREIGN KEY ("proofId") REFERENCES "Proof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationProof" ADD CONSTRAINT "LocationProof_proofId_fkey" FOREIGN KEY ("proofId") REFERENCES "Proof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

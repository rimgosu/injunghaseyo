/*
  Warnings:

  - Added the required column `proofMethodId` to the `GroupProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupProgress" ADD COLUMN     "proofMethodId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "GroupProgress" ADD CONSTRAINT "GroupProgress_proofMethodId_fkey" FOREIGN KEY ("proofMethodId") REFERENCES "ProofMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

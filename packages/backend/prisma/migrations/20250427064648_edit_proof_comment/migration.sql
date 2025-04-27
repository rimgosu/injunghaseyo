/*
  Warnings:

  - You are about to drop the column `depth` on the `ProofComment` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `ProofComment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProofComment" DROP COLUMN "depth",
DROP COLUMN "like";

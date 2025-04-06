/*
  Warnings:

  - A unique constraint covering the columns `[groupDateId,joinId]` on the table `ExpHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ExpHistory" ADD COLUMN     "groupDateId" INTEGER,
ADD COLUMN     "joinId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ExpHistory_groupDateId_joinId_key" ON "ExpHistory"("groupDateId", "joinId");

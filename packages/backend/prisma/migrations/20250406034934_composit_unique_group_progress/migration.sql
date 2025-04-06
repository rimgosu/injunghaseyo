/*
  Warnings:

  - A unique constraint covering the columns `[groupDateId,joinId,proofMethodId]` on the table `GroupProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GroupProgress_groupDateId_joinId_proofMethodId_key" ON "GroupProgress"("groupDateId", "joinId", "proofMethodId");

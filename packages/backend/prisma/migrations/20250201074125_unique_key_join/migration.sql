/*
  Warnings:

  - A unique constraint covering the columns `[userId,groupId]` on the table `Join` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Join_userId_groupId_key" ON "Join"("userId", "groupId");

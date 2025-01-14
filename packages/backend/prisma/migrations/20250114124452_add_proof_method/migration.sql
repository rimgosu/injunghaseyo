/*
  Warnings:

  - You are about to drop the column `proofMethod` on the `Group` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[groupProgressId]` on the table `GroupPhoto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `joinId` to the `GroupProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "proofMethod";

-- AlterTable
ALTER TABLE "GroupProgress" ADD COLUMN     "joinId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "GroupMethod" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GroupMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupPhoto_groupProgressId_key" ON "GroupPhoto"("groupProgressId");

-- AddForeignKey
ALTER TABLE "GroupMethod" ADD CONSTRAINT "GroupMethod_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupProgress" ADD CONSTRAINT "GroupProgress_joinId_fkey" FOREIGN KEY ("joinId") REFERENCES "Join"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

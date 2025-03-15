/*
  Warnings:

  - A unique constraint covering the columns `[proofId]` on the table `ButtonClickProof` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[proofId]` on the table `LocationProof` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[proofId]` on the table `PhotoProof` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ButtonClickProof_proofId_key" ON "ButtonClickProof"("proofId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationProof_proofId_key" ON "LocationProof"("proofId");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoProof_proofId_key" ON "PhotoProof"("proofId");

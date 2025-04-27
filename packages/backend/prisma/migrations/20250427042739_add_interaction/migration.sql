/*
  Warnings:

  - You are about to drop the `PhotoComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateEnum
CREATE TYPE "ProofReportReason" AS ENUM ('FAKE_PROOF', 'SPAM', 'ADULT', 'HARMFUL_DANGEROUS', 'VIOLENT_DISGUSTING', 'ABUSE_HATRED');

-- DropForeignKey
ALTER TABLE "PhotoComment" DROP CONSTRAINT "PhotoComment_proofId_fkey";

-- DropForeignKey
ALTER TABLE "PhotoComment" DROP CONSTRAINT "PhotoComment_userId_fkey";

-- DropTable
DROP TABLE "PhotoComment";

-- CreateTable
CREATE TABLE "ProofInteraction" (
    "id" SERIAL NOT NULL,
    "proofId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "InteractionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProofInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentInteraction" (
    "id" SERIAL NOT NULL,
    "proofCommentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "InteractionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CommentInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProofReport" (
    "id" SERIAL NOT NULL,
    "proofId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" "ProofReportReason" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProofReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProofComment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "proofId" INTEGER NOT NULL,
    "contents" TEXT NOT NULL,
    "like" INTEGER NOT NULL DEFAULT 0,
    "parentId" INTEGER,
    "depth" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProofComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProofInteraction_proofId_userId_key" ON "ProofInteraction"("proofId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProofReport_proofId_userId_key" ON "ProofReport"("proofId", "userId");

-- AddForeignKey
ALTER TABLE "ProofInteraction" ADD CONSTRAINT "ProofInteraction_proofId_fkey" FOREIGN KEY ("proofId") REFERENCES "Proof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofInteraction" ADD CONSTRAINT "ProofInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentInteraction" ADD CONSTRAINT "CommentInteraction_proofCommentId_fkey" FOREIGN KEY ("proofCommentId") REFERENCES "ProofComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentInteraction" ADD CONSTRAINT "CommentInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofReport" ADD CONSTRAINT "ProofReport_proofId_fkey" FOREIGN KEY ("proofId") REFERENCES "Proof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofReport" ADD CONSTRAINT "ProofReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofComment" ADD CONSTRAINT "ProofComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofComment" ADD CONSTRAINT "ProofComment_proofId_fkey" FOREIGN KEY ("proofId") REFERENCES "Proof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

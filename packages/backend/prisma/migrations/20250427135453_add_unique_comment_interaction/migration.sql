/*
  Warnings:

  - A unique constraint covering the columns `[proofCommentId,userId]` on the table `CommentInteraction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CommentInteraction_proofCommentId_userId_key" ON "CommentInteraction"("proofCommentId", "userId");

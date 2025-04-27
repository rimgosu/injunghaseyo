-- AddForeignKey
ALTER TABLE "ProofComment" ADD CONSTRAINT "ProofComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ProofComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "ExpHistoryType" AS ENUM ('ATTENDANCE_CHECK_REWARD', 'PROOF_REWARD', 'END_REWARD');

-- CreateTable
CREATE TABLE "ExpHistory" (
    "id" SERIAL NOT NULL,
    "myCharacterId" INTEGER NOT NULL,
    "groupId" INTEGER,
    "increasedExp" INTEGER NOT NULL,
    "type" "ExpHistoryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExpHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExpHistory" ADD CONSTRAINT "ExpHistory_myCharacterId_fkey" FOREIGN KEY ("myCharacterId") REFERENCES "MyCharacter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `accepted` on the `UserOnList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "acceptInvites" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserOnList" DROP COLUMN "accepted";

-- CreateTable
CREATE TABLE "ListInvite" (
    "id" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListInvite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListInvite" ADD CONSTRAINT "ListInvite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListInvite" ADD CONSTRAINT "ListInvite_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

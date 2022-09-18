/*
  Warnings:

  - You are about to drop the column `roleSlots` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "roleSlots";

-- CreateTable
CREATE TABLE "RoleSlot" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "eventId" INTEGER NOT NULL,
    "guestId" INTEGER NOT NULL,

    CONSTRAINT "RoleSlot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoleSlot" ADD CONSTRAINT "RoleSlot_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleSlot" ADD CONSTRAINT "RoleSlot_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

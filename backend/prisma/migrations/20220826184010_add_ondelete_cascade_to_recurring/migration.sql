-- DropForeignKey
ALTER TABLE "Recurring" DROP CONSTRAINT "Recurring_eventId_fkey";

-- AddForeignKey
ALTER TABLE "Recurring" ADD CONSTRAINT "Recurring_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

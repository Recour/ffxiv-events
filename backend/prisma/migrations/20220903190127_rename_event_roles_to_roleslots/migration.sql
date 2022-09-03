/*
  Warnings:

  - You are about to drop the column `roles` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "roles",
ADD COLUMN     "roleSlots" JSONB NOT NULL DEFAULT '{}';

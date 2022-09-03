-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "roles" JSONB NOT NULL DEFAULT '{}';

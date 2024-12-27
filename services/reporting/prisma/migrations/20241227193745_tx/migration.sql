/*
  Warnings:

  - You are about to drop the column `aggregateType` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "aggregateType";

-- DropEnum
DROP TYPE "AggregateType";

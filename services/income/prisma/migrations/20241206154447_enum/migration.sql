/*
  Warnings:

  - Changed the type of `type` on the `Categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Incomes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionFrequency" AS ENUM ('one_time', 'recurring');

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "type",
ADD COLUMN     "type" "TransactionFrequency" NOT NULL;

-- AlterTable
ALTER TABLE "Incomes" DROP COLUMN "type",
ADD COLUMN     "type" "TransactionFrequency" NOT NULL;

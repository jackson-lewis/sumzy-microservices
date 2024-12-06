/*
  Warnings:

  - Added the required column `userId` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Incomes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Incomes" ADD COLUMN     "userId" TEXT NOT NULL;

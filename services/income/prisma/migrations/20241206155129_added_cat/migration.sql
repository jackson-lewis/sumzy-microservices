/*
  Warnings:

  - You are about to drop the column `dummy` on the `Categories` table. All the data in the column will be lost.
  - Added the required column `category` to the `Incomes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "dummy";

-- AlterTable
ALTER TABLE "Incomes" ADD COLUMN     "category" INTEGER NOT NULL;

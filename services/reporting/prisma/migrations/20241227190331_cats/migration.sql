/*
  Warnings:

  - You are about to drop the column `tExpenseCats` on the `Report` table. All the data in the column will be lost.
  - Added the required column `tCats` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" RENAME COLUMN "tExpenseCats" TO "tCategories";

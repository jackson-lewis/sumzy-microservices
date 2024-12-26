-- CreateEnum
CREATE TYPE "TransactionFrequency" AS ENUM ('one_time', 'recurring');

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TransactionFrequency" NOT NULL,
    "category" INTEGER NOT NULL,
    "frequency" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransactionFrequency" NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

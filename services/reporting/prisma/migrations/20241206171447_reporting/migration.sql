-- CreateEnum
CREATE TYPE "AggregateType" AS ENUM ('expense', 'income');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('created', 'updated', 'deleted');

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "aggregateId" INTEGER NOT NULL,
    "aggregateType" "AggregateType" NOT NULL,
    "eventData" JSONB NOT NULL,
    "eventType" "EventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tIncome" INTEGER NOT NULL,
    "tExpense" INTEGER NOT NULL,
    "tExpenseCats" JSONB NOT NULL,
    "compare" JSONB NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

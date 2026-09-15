-- CreateTable
CREATE TABLE "Motivation" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Motivation_pkey" PRIMARY KEY ("id")
);

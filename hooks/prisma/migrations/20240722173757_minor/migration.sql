/*
  Warnings:

  - Added the required column `metadata` to the `zapExecution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "zapExecution" ADD COLUMN     "metadata" JSONB NOT NULL;

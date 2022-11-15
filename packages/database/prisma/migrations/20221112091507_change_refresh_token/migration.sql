/*
  Warnings:

  - You are about to drop the column `parentTokenId` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `revoked` on the `RefreshToken` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_parentTokenId_fkey";

-- DropIndex
DROP INDEX "RefreshToken_parentTokenId_key";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "parentTokenId",
DROP COLUMN "revoked";

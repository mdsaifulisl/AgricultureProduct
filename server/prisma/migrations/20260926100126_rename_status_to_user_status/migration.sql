/*
  Warnings:

  - You are about to drop the column `rool` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'moderator', 'seller');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rool",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "resetOtp" TEXT,
ADD COLUMN     "resetOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'moderator',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

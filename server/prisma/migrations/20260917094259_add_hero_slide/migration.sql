-- CreateEnum
CREATE TYPE "SlideStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" TEXT NOT NULL,
    "badge" TEXT,
    "title" TEXT NOT NULL,
    "highlightText" TEXT,
    "description" TEXT,
    "primaryBtnText" TEXT,
    "primaryBtnLink" TEXT,
    "secondaryBtnText" TEXT,
    "secondaryBtnLink" TEXT,
    "image" TEXT NOT NULL,
    "imageAlt" TEXT,
    "tag" TEXT,
    "status" "SlideStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

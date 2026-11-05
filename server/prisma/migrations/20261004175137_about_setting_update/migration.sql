-- CreateTable
CREATE TABLE "AboutSetting" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT,
    "badgeTitle" TEXT NOT NULL DEFAULT 'সেরা কৃষি ই-কমার্স',
    "badgeSubtitle" TEXT NOT NULL DEFAULT 'গ্রাহক সন্তুষ্টি ও নির্ভরযোগ্যতায়',
    "tagline" TEXT NOT NULL DEFAULT 'আমাদের মূল লক্ষ্য',
    "title" TEXT NOT NULL DEFAULT 'আমরা কীভাবে বাজারে একটি ইতিবাচক পরিবর্তন আনছি?',
    "description" TEXT NOT NULL,
    "features" TEXT[],
    "buttonText" TEXT NOT NULL DEFAULT 'পণ্যসমূহ দেখুন',
    "buttonLink" TEXT NOT NULL DEFAULT '/shop',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutSetting_pkey" PRIMARY KEY ("id")
);

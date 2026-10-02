-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "siteLogo" TEXT,
    "siteFavicon" TEXT,
    "siteTitle" TEXT NOT NULL DEFAULT 'কৃষি শপ - বিশ্বস্ত অর্গানিক কৃষি পণ্য ও সরঞ্জাম',
    "siteDescription" TEXT,
    "metaKeywords" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "facebookUrl" TEXT,
    "youtubeUrl" TEXT,
    "tiktokUrl" TEXT,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

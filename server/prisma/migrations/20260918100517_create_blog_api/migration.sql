-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('published', 'draft', 'archived');

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metaDescription" TEXT,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorRole" TEXT,
    "date" TEXT NOT NULL,
    "readTime" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "tags" TEXT[],
    "likes" INTEGER NOT NULL DEFAULT 0,
    "status" "BlogStatus" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogComment" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "commentText" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

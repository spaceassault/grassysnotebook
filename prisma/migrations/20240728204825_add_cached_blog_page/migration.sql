-- CreateTable
CREATE TABLE "CachedBlogPage" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CachedBlogPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CachedBlogPage_slug_key" ON "CachedBlogPage"("slug");

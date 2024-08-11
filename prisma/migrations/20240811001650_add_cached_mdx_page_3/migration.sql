/*
  Warnings:

  - You are about to drop the column `content` on the `CachedBlogPage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CachedBlogPage" DROP COLUMN "content",
ADD COLUMN     "code" TEXT,
ADD COLUMN     "frontMatter" TEXT;

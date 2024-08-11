/*
  Warnings:

  - Made the column `code` on table `CachedBlogPage` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `frontMatter` to the `CachedBlogPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CachedBlogPage" ALTER COLUMN "code" SET NOT NULL,
DROP COLUMN "frontMatter",
ADD COLUMN     "frontMatter" JSONB NOT NULL;

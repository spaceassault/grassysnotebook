/*
  Warnings:

  - Added the required column `version` to the `CachedBlogPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CachedBlogPage" ADD COLUMN     "version" INTEGER NOT NULL;

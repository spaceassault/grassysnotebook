import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { compileMDX } from './mdx-compiler.server' // Replace with your MDX compiler
import { PostFrontmatter } from '~/types/post';

const prisma = new PrismaClient();

// this function gets the cached mdx page and checks the version number
// if the version number is the same as the version number in the database, it returns the cached page
// if it doesn't exist or the version number is different it runs the cachedMDXPage function
export async function getCachedMDXPage(slug: string, version: number) {
  const cachedPage = await prisma.cachedBlogPage.findUnique({ where: { slug } });

  if (cachedPage && cachedPage.version === version) {
    return {
      code: cachedPage.code,
      frontmatter: cachedPage.frontMatter,
      version: cachedPage.version,
      };
  } else {
    return compileAndCacheMDXPage(slug, path.join(process.cwd(), 'app/posts', `${slug}.mdx`));
  }
}

export async function cacheMDXPage(slug: string, code: string, frontMatter: PostFrontmatter, version: number) {
  return prisma.cachedBlogPage.upsert({
    where: { slug },
    update: { code, frontMatter, version },
    create: { slug, frontMatter, code, version },
  });
}

export async function compileAndCacheMDXPage(slug: string, filePath: string) {
  const source = await fs.readFile(filePath, 'utf-8');
  const { code, frontmatter} = await compileMDX(source, slug);
  const version = frontmatter.version;
  await cacheMDXPage(slug, code, frontmatter as PostFrontmatter, version);
  return code;
}

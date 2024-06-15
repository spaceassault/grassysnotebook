import fs from 'fs/promises';
import path from 'path';
import { bundleMDX } from 'mdx-bundler';

const POSTS_PATH = path.join(process.cwd(), 'public', 'posts');

export async function getPostSlugs() {
  const files = await fs.readdir(POSTS_PATH);
  return files.map(file => file.replace(/\.mdx$/, ''));
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(POSTS_PATH, `${slug}.mdx`);
  const source = await fs.readFile(fullPath, 'utf8');

  const { code, frontmatter } = await bundleMDX({
    source,
    cwd: POSTS_PATH,
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
        '.ts': 'tsx',
      };
      options.platform = 'node';
      return options;
    },
  });

  return { code, frontmatter };
}

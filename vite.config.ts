import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { vitePlugin as remix } from '@remix-run/dev';
import mdx from '@mdx-js/rollup';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { default as rehypePrettyCode } from "rehype-pretty-code";
import { vercelPreset } from '@vercel/remix/vite';

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [rehypePrettyCode],
    }),
    tsconfigPaths(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      presets: [vercelPreset()],
    },),
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
});

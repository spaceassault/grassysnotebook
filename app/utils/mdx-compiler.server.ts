import path from 'path';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { bundleMDX } from 'mdx-bundler';
import type { PostFrontmatter } from '~/types/post';

interface Options {
  grid?: boolean;
  theme?: string | Record<string, string>;
  keepBackground?: boolean;
  defaultLang?: string | { block?: string; inline?: string };
  tokensMap?: Record<string, string>;
  transformers?: any[];
  filterMetaString?(str: string): string;
  getHighlighter?(options: any): Promise<any>;
  onVisitLine?(element: any): void;
  onVisitHighlightedLine?(element: any): void;
  onVisitHighlightedChars?(element: any, id: string | undefined): void;
  onVisitTitle?(element: any): void;
  onVisitCaption?(element: any): void;
  onVisitCode?(element: any, language: string): void;
}

const cache: Record<string, { code: string, frontmatter: PostFrontmatter }> = {};

const rehypePrettyCodeOptions: Options = {
  theme: 'one-dark-pro',
  keepBackground: false,
  onVisitLine(node) {
    if (node.children.length > 0) {
      node.properties.className = (node.properties.className || []).concat('line');
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = (node.properties.className || []).concat('highlighted');
  },
  onVisitTitle(node) {
    node.properties.className = (node.properties.className || []).concat('code-title');
    node.properties['data-title'] = node.children[0].value; // Ensure title is extracted correctly
  },
  onVisitCaption(node) {
    node.properties.className = (node.properties.className || []).concat('code-caption');
    node.properties['data-caption'] = node.children[0].value; // Ensure caption is extracted correctly
  },
  onVisitHighlightedChars(node, id) {
    node.properties.className = (node.properties.className || []).concat('highlighted-chars');
    node.properties['data-highlight'] = id;
  },
  onVisitCode(node, language) {
	if (language) {
	  node.properties.className = (node.properties.className || []).concat(`language-${language}`);
	}
  },
};

const compileMDX = async (source: string, slug: string) => {
  console.log(`Compiling MDX ${slug}`);
  const timerLabel = `MDX Compilation for ${slug} - ${Date.now()}`;

//   if (cache[slug]) {
//     console.log(`Cache found for route ${slug}`);
//     return cache[slug];
//   }

  console.log(`Cache not found, compiling route`);
  console.log(`Compiling MDX for slug: ${slug}, cwd: ${path.join(process.cwd(), 'app/posts')}`);

  console.time(timerLabel);

  const { code, frontmatter } = await bundleMDX({
    source,
    cwd: path.join(process.cwd(), 'app/posts'),
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [rehypePrettyCode, rehypePrettyCodeOptions],
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      ];
      return options;
    },
  });

  console.log('MDX Compilation Success:');

  const result = { code, frontmatter };
  cache[slug] = { code, frontmatter: frontmatter as PostFrontmatter };

  console.timeEnd(timerLabel);

  return result;
};

export { compileMDX };

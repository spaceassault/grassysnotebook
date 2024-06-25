import path from 'path'
import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkCodeBlocksShiki } from '@kentcdodds/md-temp'
import { visit } from 'unist-util-visit'
import type { PostFrontmatter } from '~/types/post';
import type * as H from 'hast'
import { bundleMDX } from 'mdx-bundler';


const cache: Record<string, { code: string, frontmatter: PostFrontmatter }> = {};

function removePreContainerDivs() {
	return async function preContainerDivsTransformer(tree: H.Root) {
		visit(
			tree,
			{ type: 'element', tagName: 'pre' },
			function visitor(node, index, parent) {
				if (parent?.type !== 'element') return
				if (parent.tagName !== 'div') return
				if (parent.children.length !== 1 && index === 0) return
				Object.assign(parent, node)
			},
		)
	}
}

function trimCodeBlocks() {
	return async function transformer(tree: H.Root) {
		visit(tree, 'element', (preNode: H.Element) => {
			if (preNode.tagName !== 'pre' || !preNode.children.length) {
				return
			}
			const codeNode = preNode.children[0]
			if (
				!codeNode ||
				codeNode.type !== 'element' ||
				codeNode.tagName !== 'code'
			) {
				return
			}
			const [codeStringNode] = codeNode.children
			if (!codeStringNode) return

			if (codeStringNode.type !== 'text') {
				console.warn(
					`trimCodeBlocks: Unexpected: codeStringNode type is not "text": ${codeStringNode.type}`,
				)
				return
			}
			codeStringNode.value = codeStringNode.value.trim()
		})
	}
}

// Function to compile MDX content with syntax highlighting, TOC, and GFM
// Alternate appraoch to compile MDX content with syntax highlighting, TOC, and GFM
const compileMDX = async (source: string, slug: string) => {
    // Check if the result is already cached
    if (cache[slug]) {
        return cache[slug];
    }

    const timerLabel = `MDX Compilation for ${slug}`;

    // Start the timer
    console.time(timerLabel);
  
    // Compile MDX with remark and rehype plugins
    const { code, frontmatter } = await bundleMDX({
      source,
      cwd: path.join(process.cwd(), 'app/posts'),
      mdxOptions(options) {
        options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          [remarkToc, { heading: 'Table of contents', maxDepth: 2 }],
          remarkGfm,
        ];
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          trimCodeBlocks,
          remarkCodeBlocksShiki,
          removePreContainerDivs,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ];
        return options;
      },
    });
  
    const result = { code, frontmatter };
    cache[slug] = { code, frontmatter: frontmatter as PostFrontmatter};
    
    // End the timer and log the time
    console.timeEnd(timerLabel);

    return result;
  };

  export { compileMDX };
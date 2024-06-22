
import fs from 'fs';
import path from 'path'
import remarkPrism from 'remark-prism';
import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import { bundleMDX } from 'mdx-bundler';
import type { Post, PostFrontmatter, Tag } from '~/types/post';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const cache: Record<string, { code: string, frontmatter: PostFrontmatter }> = {};

// Function to compile MDX content with syntax highlighting, TOC, and GFM
// Alternate appraoch to compile MDX content with syntax highlighting, TOC, and GFM
const compileMDX = async (source: string, slug: string) => {
    // Check if the result is already cached
    if (cache[slug]) {
        return cache[slug];
    }
  
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
          rehypePrism,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ];
        return options;
      },
    });
  
    const result = { code, frontmatter };
    cache[slug] = { code, frontmatter: frontmatter as PostFrontmatter};
  
    return result;
  };


const getPostFiles = () => {
    return fs.readdirSync(path.join(process.cwd(), 'app/posts')).filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
};

const getPostBySlug = async (slug: string): Promise<Post> => {
    const filePath = path.join(process.cwd(), 'app/posts', `${slug}.mdx`);
    const source = fs.readFileSync(filePath, 'utf8');
    const { code, frontmatter } = await compileMDX(source, slug);
  
    return {
      frontmatter: frontmatter as PostFrontmatter,
      code,
    };
  };

const getPosts = async (count?: number): Promise<PostFrontmatter[]> => {
    const files = getPostFiles();

    const posts = await Promise.all(files.map(async file => {
        const slug = file.replace(/\.mdx?$/, '');
        const filePath = path.join(process.cwd(), 'app/posts', `${slug}.mdx`);
        const source = fs.readFileSync(filePath, 'utf8');
        const { frontmatter } = await bundleMDX({
            source,
            cwd: path.join(process.cwd(), 'app/posts'),
        });

        return {
            ...frontmatter,
            slug,
        } as PostFrontmatter;
    }));

    return count ? posts.slice(0, count) : posts;
};

const getTopics = async (): Promise<string[]> => {
    const posts = await getPosts();
    const topics = posts.map(post => post.topic);
    return [...new Set(topics)];
}

const getTags = async (): Promise<Tag[]> => {
    const posts = await getPosts();

    const duplicateTags = posts.flatMap(post => post.tags);
    return [...new Set(duplicateTags)];
};

const getFeaturedPosts = async (): Promise<PostFrontmatter[]> => {
    const posts = await getPosts();
    return posts.filter(post => post.featured === true);
};

const getPostsByTopic = async (topic: string): Promise<PostFrontmatter[]> => {
    const posts = await getPosts();
    return posts.filter(post => post.topic === topic);
};

const getPostsByTag = async (tag: string): Promise<PostFrontmatter[]> => {
    const posts = await getPosts();
    return posts.filter(post => post.tags.includes(tag));
};

const sortPostsByDate = (posts: PostFrontmatter[]): PostFrontmatter[] => {
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};


const getLatestPost = async (): Promise<PostFrontmatter> => {
    const latestPosts = await getPosts(1);
    return latestPosts[0];
};

export {
    getLatestPost,
    getPostBySlug,
    getPosts,
    getFeaturedPosts,
    getPostsByTag,
    getPostsByTopic,
    getTags,
    getTopics,
    sortPostsByDate,
};


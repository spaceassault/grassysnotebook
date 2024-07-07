
import fs from 'fs';
import path from 'path'
import { bundleMDX } from 'mdx-bundler';
import type { Post, PostFrontmatter, Tag } from '~/types/post';
import { compileMDX } from './mdx-compiler.server';


const getPostFiles = () => {
    return fs.readdirSync(path.join(process.cwd(), 'app/posts')).filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
};

const getPostBySlug = async (slug: string): Promise<Post> => {
    console.log('Getting post by slug', slug)
    const filePath = path.join(process.cwd(), 'app/posts', `${slug}.mdx`);
    const source = fs.readFileSync(filePath, 'utf8');
    const { code, frontmatter } = await compileMDX(source, slug);
  
    return {
      frontmatter: frontmatter as PostFrontmatter,
      code,
    };
  };

const getPosts = async (count?: number): Promise<PostFrontmatter[]> => {
    console.log('Getting posts')
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

const getTopics = (posts: PostFrontmatter[]): string[] => {
    const topics = posts.map(post => post.topic);
    return [...new Set(topics)];
};

const getTags = (posts: PostFrontmatter[]): Tag[] => {
    const duplicateTags = posts.flatMap(post => post.tags);
    return [...new Set(duplicateTags)];
};

const getFeaturedPosts = (posts: PostFrontmatter[]): PostFrontmatter[] => {
    return posts.filter(post => post.featured === true);
};

const getPostsByTopic = async (topic: string): Promise<PostFrontmatter[]> => {
    const posts = await getPosts();
    return posts.filter(post => post.topic === topic);
};

const getPostsByTag = (posts: PostFrontmatter[], tag: string): PostFrontmatter[] => {
    return posts.filter(post => post.tags.includes(tag));
};

const sortPostsByDate = (posts: PostFrontmatter[]): PostFrontmatter[] => {
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const getLatestPost = (posts: PostFrontmatter[]): PostFrontmatter => {
    return sortPostsByDate(posts)[0];
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


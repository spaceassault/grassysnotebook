
import fs from 'fs';
import path from 'path';
import type { Expression } from "fuse.js";
import Fuse from "fuse.js";
import type { PostFrontmatter, Tag } from "~/types/post";
import { bundleMDX } from 'mdx-bundler';


const getPostFiles = () => {
    return fs.readdirSync(path.join(process.cwd(), 'app/posts')).filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
};

const getPostBySlug = async (slug: string) => {
    const filePath = path.join(process.cwd(), 'app/posts', `${slug}.mdx`);
    const source = fs.readFileSync(filePath, 'utf8');

    const { code, frontmatter } = await bundleMDX({
        source,
        cwd: path.join(process.cwd(), 'app/posts'),
    });

    return {
        frontmatter,
        code,
    };
};

const getPosts = async (count?: number): Promise<PostFrontmatter[]> => {
    const files = getPostFiles();

    const posts = await Promise.all(files.map(async file => {
        const slug = file.replace(/\.mdx?$/, '');
        const { frontmatter } = await getPostBySlug(slug);

        return {
            slug,
            ...frontmatter,
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

const getRelatedPosts = async (post: PostFrontmatter): Promise<PostFrontmatter[]> => {
    const posts = await getPosts();

    const fuse = new Fuse(posts, {
        keys: ["title", "topic", "tags"],
    });

    fuse.remove(item => item.slug === post.slug);

    const query: Expression = {
        $or: [
            { title: post.title },
            { topic: post.topic },
            ...post.tags.map(tag => ({ tags: tag })),
        ],
    };

    const queryResults = fuse.search(query).slice(0, 2);
    return queryResults.map(result => result.item);
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
    getRelatedPosts,
    getTags,
    getTopics,
    sortPostsByDate,
};


// import fs from 'fs/promises';
// import path from 'path';
// import matter from 'gray-matter';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const postsDirectory = path.join(__dirname, '../posts');

// export interface Post {
//   slug: string;
//   frontmatter: {
//     title: string;
//     date: string;
//     image?: string;
//     description?: string;
//     tags?: string[];
//     topic?: string;
//     author?: string;
//     featured?: boolean;
//     [key: string]: unknown;
//   };
//   content: string;
// }

// async function getPostSlugs(): Promise<string[]> {
//   // const files = await fs.readdir(postsDirectory);
//   // return files.filter(file => file.endsWith('.mdx')).map(file => file.replace(/\.mdx$/, ''));
//   const postsPath = path.join(process.cwd(), 'app', 'posts');
//   const files = await fs.readdir(postsPath);
//   return files.map(file => path.basename(file, path.extname(file)));
// }

// async function getPostBySlug(slug: string): Promise<Post> {
//     const filePath = path.join(postsDirectory, `${slug}.mdx`);
//     const fileContents = await fs.readFile(filePath, 'utf-8');
//     const { data, content } = matter(fileContents);

//     return {
//         slug,
//         frontmatter: {
//             title: '',
//             date: '',
//             ...data,
//         },
//         content,
//     };
    
// }

// export async function getLatestPosts(limit = 5): Promise<Post[]> {
//   const slugs = await getPostSlugs();
//   const posts = await Promise.all(slugs.map(getPostBySlug));
//   posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
//   return posts.slice(0, limit);
// }

// export async function getLastPost(): Promise<Post> {
//   const posts = await getLatestPosts(1);
//   return posts[0];
// }

// export async function getAllPosts(): Promise<Post[]> {
//   const slugs = await getPostSlugs();
//   const posts = await Promise.all(slugs.map(getPostBySlug));
//   posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
//   return posts;
// }


// export async function getPostsByTopic(topic: string): Promise<Post[]> {
//   const posts = await getAllPosts();
//   return posts.filter(post => post.frontmatter.topic === topic);
// }

// export async function getPostsByTags(tags: string[]): Promise<Post[]> {
//   const posts = await getAllPosts();
//   return posts.filter(post => post.frontmatter.tags && tags.some(tag => post.frontmatter.tags.includes(tag)));
// }

// export async function getTopics(): Promise<string[]> {
//   const posts = await getAllPosts();
//   const topics = posts.map(post => post.frontmatter.topic).filter((topic, index, self) => topic && self.indexOf(topic) === index);
//   return topics;
// }

// export async function getPostsByDate(date: string): Promise<Post[]> {
//   const posts = await getAllPosts();
//   return posts.filter(post => post.frontmatter.date === date);
// }

// export async function getRelatedPosts(slug: string): Promise<Post[]> {
//   const currentPost = await getPostBySlug(slug);
//   if (!currentPost.frontmatter.tags) return [];
//   const relatedPosts = await getPostsByTags(currentPost.frontmatter.tags);
//   return relatedPosts.filter(post => post.slug !== slug);
// }

// //Get posts that are marked as featured and return their slug
// export async function getFeaturedPosts(): Promise<string[]> {
//   const posts = await getAllPosts();
//   return posts.filter(post => post.frontmatter.featured === true).map(post => post.slug);
// }


import fs from 'fs';
import path from 'path';
import type { Expression } from "fuse.js";
import Fuse from "fuse.js";
import type { Post, PostFrontmatter, Tag, Topic } from "~/types/post";
import matter from 'gray-matter';
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


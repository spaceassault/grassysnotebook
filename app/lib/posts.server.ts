import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDirectory = path.join(__dirname, '../../public/posts');

export interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    image?: string;
    description?: string;
    tags?: string[];
    topic?: string;
    author?: string;
    featured?: boolean;
    [key: string]: unknown;
  };
  content: string;
}

async function getPostSlugs(): Promise<string[]> {
  // const files = await fs.readdir(postsDirectory);
  // return files.filter(file => file.endsWith('.mdx')).map(file => file.replace(/\.mdx$/, ''));
  const postsPath = path.join(process.cwd(), 'public', 'posts');
  const files = await fs.readdir(postsPath);
  return files.map(file => path.basename(file, path.extname(file)));
}

export async function getPostContent(slug: string) {
  const filePath = path.join(process.cwd(), 'public', 'posts', `${slug}.mdx`);
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
}

async function getPostBySlug(slug: string): Promise<Post> {
    const filePath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        frontmatter: {
            title: '',
            date: '',
            ...data,
        },
        content,
    };
    
}

export async function getLatestPosts(limit = 5): Promise<Post[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map(getPostBySlug));
  posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
  return posts.slice(0, limit);
}

export async function getLastPost(): Promise<Post> {
  const posts = await getLatestPosts(1);
  return posts[0];
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map(getPostBySlug));
  posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
  return posts;
}

export async function getPostsBySlug(slugs: string[]): Promise<Post[]> {
  const posts = await Promise.all(slugs.map(getPostBySlug));
  return posts;
}

export async function getPostsByTopic(topic: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.frontmatter.topic === topic);
}

export async function getPostsByTags(tags: string[]): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.frontmatter.tags && tags.some(tag => post.frontmatter.tags.includes(tag)));
}

export async function getTopics(): Promise<string[]> {
  const posts = await getAllPosts();
  const topics = posts.map(post => post.frontmatter.topic).filter((topic, index, self) => topic && self.indexOf(topic) === index);
  return topics;
}

export async function getPostsByDate(date: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.frontmatter.date === date);
}

export async function getRelatedPosts(slug: string): Promise<Post[]> {
  const currentPost = await getPostBySlug(slug);
  if (!currentPost.frontmatter.tags) return [];
  const relatedPosts = await getPostsByTags(currentPost.frontmatter.tags);
  return relatedPosts.filter(post => post.slug !== slug);
}

//Get posts that are marked as featured and return their slug
export async function getFeaturedPosts(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.frontmatter.featured === true).map(post => post.slug);
}

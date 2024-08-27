
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
    const source = await fs.promises.readFile(filePath, 'utf8');  // Async read
    const { code, frontmatter } = await compileMDX(source, slug);

    return {
      frontmatter: frontmatter as PostFrontmatter,
      version: frontmatter.version as number,
      code,
    };
};

const getPostVersion = async (slug: string ) => {
    console.log('Getting post version', slug )
    const filePath = path.join(process.cwd(), 'app/posts', `${slug}.mdx`);
    const source = fs.readFileSync(filePath, 'utf8');
    const { frontmatter } = await bundleMDX({
        source,
        cwd: path.join(process.cwd(), 'app/posts'),
    });
    
    const version = frontmatter.version as number;

    return version;    
  }

  const getPosts = (count?: number): Promise<PostFrontmatter[]> => {
    // console.log('Getting posts');
    const files = getPostFiles();

    // Start processing each file immediately
    const postsPromise = Promise.all(files.map(async file => {
        const slug = file.replace(/\.mdx?$/, '');
        const filePath = path.join(process.cwd(), 'app/posts', `${slug}.mdx`);
        const source = fs.readFileSync(filePath, 'utf8');

        // Return a promise that will resolve with the post frontmatter and slug
        return bundleMDX({
            source,
            cwd: path.join(process.cwd(), 'app/posts'),
        }).then(({ frontmatter }) => ({
            ...frontmatter,
            slug,
        } as PostFrontmatter));
    }));

    // Apply the count limit once all promises have resolved
    return postsPromise.then(posts => (count ? posts.slice(0, count) : posts));
};


export async function getIndexPageData(category?: string) {
    // console.log('Getting index page data');
    const files = getPostFiles();

    const posts: PostFrontmatter[] = [];

    if (!category) {
    for (const file of files) {
        if (!file.endsWith('.mdx')) continue;

        const slug = file.replace(/\.mdx?$/, '');
        const filePath = path.join(process.cwd(), 'app/posts', `${slug}.mdx`);
        const source = await fs.promises.readFile(filePath, 'utf8');

        // Use mdx-bundler to extract frontmatter
        const { frontmatter } = await bundleMDX({
            source,
            cwd: path.join(process.cwd(), 'app/posts'),
        });

        posts.push({
            ...frontmatter,
            slug,
        } as PostFrontmatter);
    }
    } else {
    for (const file of files) {
        if (!file.endsWith('.mdx')) continue;

        const slug = file.replace(/\.mdx?$/, '');
        const filePath = path.join(process.cwd(), 'app/posts', `${slug}.mdx`);
        const source = await fs.promises.readFile(filePath, 'utf8');

        // Use mdx-bundler to extract frontmatter
        const { frontmatter } = await bundleMDX({
            source,
            cwd: path.join(process.cwd(), 'app/posts'),
        });

        if (frontmatter.topic === category) {
            posts.push({
            ...frontmatter,
            slug,
            } as PostFrontmatter);
        }
    }
    }

    // Derive other data from the posts
    const latestPost = getLatestPost(posts);
    const featuredPosts = getFeaturedPosts(posts);
    const topics = await getTopics();
    // console.log('Index page data', { posts, latestPost, featuredPosts, topics });

    return {
        posts,
        latestPost,
        featuredPosts,
        topics,
    };
}

async function getTopics() {
    const posts = await getPosts();
    const topics = posts.map(post => post.topic);
    return [...new Set(topics)];
};

const getTags = (posts: PostFrontmatter[]): Tag[] => {
    const duplicateTags = posts.flatMap(post => post.tags);
    return [...new Set(duplicateTags)];
};

const getFeaturedPosts = (posts: PostFrontmatter[]): { title: string; slug: string }[] => {
    return posts
        .filter(post => post.featured === true)
        .map(post => ({
            title: post.title,
            slug: post.slug,
        }));
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
    getPostVersion,
};


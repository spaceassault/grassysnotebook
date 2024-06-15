type Post = {
    html: string
    frontmatter: PostFrontmatter
}

type PostFrontmatter = {
    date: string
    topic: string
    title: string
    slug: string
    tags: Tag[]
    image?: string
    description?: string
    author?: string
    featured?: boolean
}

type Tag = string

export type {Post, PostFrontmatter, Tag }
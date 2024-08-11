type Post = {
    code: string
    frontmatter: PostFrontmatter
    version: number
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
    version?: number
    featured?: boolean
}

type Tag = string

export type {Post, PostFrontmatter, Tag }
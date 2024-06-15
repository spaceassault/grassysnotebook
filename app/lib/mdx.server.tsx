// import fs from 'fs/promises';
// import path from 'path';
// import { bundleMDX } from 'mdx-bundler';

// const POSTS_PATH = path.join(process.cwd(), 'app', 'posts');

// export async function getPostSlugs() {
//   const files = await fs.readdir(POSTS_PATH);
//   return files.map(file => file.replace(/\.mdx$/, ''));
// }

// export async function getPostBySlug(slug: string) {
//   const fullPath = path.join(POSTS_PATH, `${slug}.mdx`);
//   const source = await fs.readFile(fullPath, 'utf8');

//   const { code, frontmatter } = await bundleMDX({
//     source,
//     cwd: POSTS_PATH,
//     esbuildOptions: (options) => {
//       options.loader = {
//         ...options.loader,
//         '.js': 'jsx',
//         '.ts': 'tsx',
//       };
//       options.platform = 'node';
//       return options;
//     },
//   });

//   return { code, frontmatter };
// }


import remarkEmbedder from "@remark-embedder/core"
import rehypeExternalLinks from "rehype-external-links"
import type {Options} from "rehype-pretty-code"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeRaw from "rehype-raw"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkInlineLinks from "remark-inline-links"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import remarkUnwrapImages from "remark-unwrap-images"
import {getHighlighter} from "shiki"
import {unified} from "unified"

// import {codesandboxTransformer} from "~/transformers/codesandbox"
// import {twitchTransformer} from "~/transformers/twitch"
// import {twitterTransformer} from "~/transformers/twitter"
// import {youtubeTransformer} from "~/transformers/youtube"
import type {Markdown, TransformedMarkdown} from "../types/markdown"

export const getMarkdownBySlug = async (
    slug: string,
): Promise<TransformedMarkdown> => {
    console.log("getting markdown slug", slug)
    const files = import.meta.glob<Markdown>("../posts/*.{md,mdx}", {
        eager: true,
    })

    const file = files[`/posts/${slug}.md`] || files[`/posts/${slug}.mdx`]
    const html = await transformMarkdown(file.markdown)

    const markdown: TransformedMarkdown = {
        html,
        frontmatter: file.attributes,
    }

    return markdown
}

export const transformMarkdown = async (markdown: string): Promise<string> => {
    console.log("transforming markdown", markdown)
    const options: Options = {
        keepBackground: true,
        getHighlighter: options =>
            getHighlighter({
                ...options,
            }),
    }

    const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkUnwrapImages)
        .use(remarkInlineLinks)
        // .use(
        //     /* v8 ignore next 3 */
        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     // @ts-expect-error
        //     process.env.VITEST ? remarkEmbedder : remarkEmbedder.default,
        //     {
        //         transformers: [
        //             codesandboxTransformer,
        //             twitchTransformer,
        //             twitterTransformer,
        //             youtubeTransformer,
        //         ],
        //     },
        // )
        .use(remarkRehype, {allowDangerousHtml: true})
        .use(rehypePrettyCode, options)
        .use(rehypeExternalLinks, {
            target: "_blank",
            rel: ["noopener", "noreferrer"],
        })
        // .use(rehypeCloudinaryImageSize)
        // .use(rehypeImageLinks, {
        //     srcTransform: (url: string) => {
        //         const base =
        //             "https://res.cloudinary.com/bradgarropy/image/upload"

        //         if (!url.startsWith(base)) {
        //             return url
        //         }

        //         const path = url.split(base)[1]
        //         const newUrl = `${base}/f_auto,q_auto,w_660,c_limit${path}`
        //         return newUrl
        //     },
        // })
        .use(rehypeRaw)
        .use(rehypeStringify)

    const file = await processor.process(markdown)
    const html = file.toString()
    
    console.log("transformed markdown to htm", html)

    return html
}

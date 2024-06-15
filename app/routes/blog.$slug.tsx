import * as React from 'react';
import { useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { getMDXComponent } from 'mdx-bundler/client';
import { getPostBySlug } from '~/lib/posts.server';

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  const post = await getPostBySlug(slug);
  return json(post);
};

export default function BlogPost() {
  const { code, frontmatter } = useLoaderData();
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  return (
    <div className="mt-4 max-xl">
      <h1>{frontmatter.title}</h1>
      <h3>by: {frontmatter.author}</h3>
      <p>{frontmatter.date}</p>
      <Component />
    </div>
  );
}



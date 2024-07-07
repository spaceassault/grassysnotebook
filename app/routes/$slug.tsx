import * as React from 'react';
import { useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { getMDXComponent } from 'mdx-bundler/client';
import { getPostBySlug } from '~/utils/posts.server';
import { Post } from '~/types/post';
import { Breadcrumbs } from '~/components/breadcrumbs';

export const loader: LoaderFunction = async ({ params }) => {
  console.log('Loading post', params.slug);
  const post = await getPostBySlug(params.slug as string);
  if (!post) {
    return json({ message: 'Post not found' }, { status: 404 });
  }
  return json(post);
};

export default function BlogPost() {
  console.log('Rendering post');
  const { code, frontmatter } = useLoaderData<Post>();

  // Use useMemo to memoize the MDX component
  const Component = React.useMemo(() => {
    console.log('Creating MDX Component');
    return getMDXComponent(code);
  }, [code]);

  return (
    <div className="flex flex-col w-full items-center"> 
      <div className="w-full max-w-screen-xl px-4">
        <div className="ml-0 sm:ml-4">
          <Breadcrumbs />
        </div>
        <div className="flex flex-col items-center mt-8 p-4 w-full">
          <div className="prose sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto" style={{ maxWidth: "90%" }}>
            <div className="mt-4 max-xl">
              <h1>{frontmatter.title}</h1>
              <h3>by: {frontmatter.author}</h3>
              <p>{frontmatter.date}</p>
              <Component />
            </div>
          </div>
        </div>
      </div>
  </div>
  );
}



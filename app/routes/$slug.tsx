import * as React from 'react';
import { useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { getMDXComponent } from 'mdx-bundler/client';
import { getPostBySlug, getPostVersion } from '~/utils/posts.server';
import { Post } from '~/types/post';
import { Breadcrumbs } from '~/components/breadcrumbs';
import { getCachedMDXPage } from '~/utils/mdx-cache-manager.server';

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.slug as string;
  console.log('Loading post', params.slug);
  const postVersion = await getPostVersion(params.slug as string );
  console.log('Post version', postVersion);

  const cachedPost = await getCachedMDXPage(slug as string, postVersion as number);

  if (!cachedPost) {
    throw new Response('Post not found', { status: 404 });
  }
  
  return json(cachedPost);
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



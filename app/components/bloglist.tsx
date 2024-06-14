import { Link, useLoaderData } from "@remix-run/react";
import { Card } from "./ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { LoaderData } from "~/root";

export default function BlogList() {
  const posts = useLoaderData<LoaderData>().posts;

  if (posts.length === 0) {
    return <div>No posts found.</div>;
  }

  return (

    <div className="mt-12 lg:grid lg:grid-cols-2 lg:gap-6">
      {posts.map((post) => (
        <Card key={post.slug} className="mt-4 p-4 rounded overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            <img className="rounded-md object-cover" src={post.frontmatter.image} alt={post.frontmatter.title} />
          </AspectRatio>
          <div className="px-6 py-4">
            <div className="font-bold text-2xl mb-2">{post.frontmatter.title}</div>
            <p className="text-gray-500 text-sm">{new Date(post.frontmatter.date).toLocaleDateString()}</p>
            <p className="text-gray-700 text-base">{post.frontmatter.description}</p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <Link to={`/blog/${post.slug}`} prefetch="intent" className="text-blue-500 hover:text-blue-700">
              Read More
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}


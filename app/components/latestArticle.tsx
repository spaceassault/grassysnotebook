import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Card } from "./ui/card";
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderData } from "~/root";



export default function LatestArticle() {

const post = useLoaderData<LoaderData>().lastPost;

  return (
    <div className="flex flex-col mt-12 lg:gap-6">
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
    </div>
  );
}
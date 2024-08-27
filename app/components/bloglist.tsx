import { Link, NavLink, useLoaderData } from "@remix-run/react";
import { Card } from "./ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { PostFrontmatter } from "~/types/post";
import { getThumbnailUrl } from "~/utils/cloudinary";

export default function BlogList({ posts }: { posts: PostFrontmatter[] }) {
  if (!posts) {
    return <div>No posts found.</div>;
  }

  const postsToDisplay = posts.slice(1);

  return (
    <div className="mt-12 lg:grid lg:grid-cols-2 lg:gap-6">
      {postsToDisplay.map((post) => {
        const { slug, title, description, image, date } = post;
        if (!image) {
          return null;
        }
        const thumbnailUrl = getThumbnailUrl(image, 1280, 720);
        return (
          <Card key={slug} className="mt-4 p-4 rounded overflow-hidden">
            <NavLink to={`/${slug}`} prefetch="intent" unstable_viewTransition>
            <AspectRatio ratio={16 / 9}>
              <img className="rounded-md object-cover" src={thumbnailUrl} alt={title} />
            </AspectRatio>
            </NavLink>
            <div className="px-6 py-4">
              <div className="font-bold text-2xl mb-2">{title}</div>
              <p className="text-gray-500 text-sm">{new Date(date).toLocaleDateString()}</p>
              <p className="text-gray-700 text-base">{description}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <Link to={`/${slug}`} prefetch="intent" className="text-blue-500 hover:text-blue-700" unstable_viewTransition>
                Read More
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
}


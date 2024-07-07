import { Link, useLoaderData } from "@remix-run/react";
import { PostFrontmatter } from "~/types/post";

export default function FeaturedList() {
  const { featured } = useLoaderData<{featured: PostFrontmatter}>();

  if (!Array.isArray(featured) || featured.length === 0) {
    return <div>No featured articles found.</div>;
  }

  return (
    <div className="lg:flex flex-col space-y-4 mb-8">
      <h1 className="mb-8 text-xl lg:text-3xl font-bold">Featured Articles</h1>
      {featured.map((post) => {
        const { slug, title } = post;
        return (
          <div key={slug} className="grid grid-col-1 gap-4">
            <Link to={`/${slug}`} prefetch="intent" className="text-primary text-lg lg:text-xl hover:underline">
              {title}
            </Link>
            <hr className="border-primary my-4" />
          </div>
        );
      })}
    </div>
  );
}

import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";

export default function FeaturedList() {
  const { featured } = useLoaderData<LoaderFunction>();

  return (
    <div className="lg:flex flex-col space-y-4 mb-8">
      <h1 className="mb-8 text-xl lg:text-3xl font-bold">Featured Articles</h1>
      {featured.map((slug: string) => (
        <div key={slug} className="grid grid-col-1 gap-4">
        <Link to={`/blog/${slug}`} prefetch="intent" className="text-primary text-lg lg:text-xl hover:underline">
          {slug}
        </Link>
        <hr className="border-primary my-4" />
        </div>
      ))}
    </div>
  );
}

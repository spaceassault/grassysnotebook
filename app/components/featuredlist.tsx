import { Link } from "@remix-run/react";

export default function FeaturedList({ featured }: { featured: { slug: string; title: string }[] }) {

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
            <Link to={`/${slug}`} prefetch="intent"  className="text-primary text-lg lg:text-xl hover:underline" unstable_viewTransition>
              {title}
            </Link>
            <hr className="border-primary my-4" />
          </div>
        );
      })}
    </div>
  );
}

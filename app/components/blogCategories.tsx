import { Link, useLoaderData } from "@remix-run/react";

export default function BlogCategories() {
    const topics = useLoaderData<{topics: string[]}>().topics;

    if (!Array.isArray(topics) || topics.length === 0) {
        return <div>No featured articles found.</div>;
      }

    console.log(topics);
    
    return (
        <div className="lg:flex flex-col mb-8">
            <h1 className="mb-8 text-xl lg:text-3xl font-bold">Categories</h1>
            <Link to="/" className="text-primary text-lg lg:text-xl my-4">
                All
            </Link>
            <hr className="border-primary my-4" />
            {topics.map((post) => {
                const name = post;
                return (
                <div key={name} className="grid grid-col-1 gap-4">
                    <Link to={`/?category=${name}`} prefetch="intent" className="text-primary text-lg lg:text-xl hover:underline">
                    {name}
                    </Link>
                    <hr className="border-primary my-4" />
                </div>
                );
            })}
        </div>
    );

}
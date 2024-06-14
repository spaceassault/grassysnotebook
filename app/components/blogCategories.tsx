import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export default function BlogCategories() {
    const data = useLoaderData<LoaderFunction>().topics;

    return (
        <div className="lg:flex flex-col mb-8">
            <h1 className="mb-8 text-xl lg:text-3xl font-bold">Categories</h1>
            <Link to="/" className="text-primary text-lg lg:text-xl my-4">
                All
            </Link>
            <hr className="border-primary my-4" />
            {data.map((topic: string) => (
                <div key={topic} className="grid grid-col-1 gap-4">
                    <Link to={`/?category=${topic}`} prefetch="intent" className="text-primary text-lg lg:text-xl hover:underline">
                        {topic}
                    </Link>
                    <hr className="border-primary my-4" />
                </div>
            ))}
        </div>
    );

}
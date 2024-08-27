import { Await, defer, useLoaderData } from "@remix-run/react";
import React from "react"; // Add this line
import { Skeleton } from "~/components/ui/skeleton";

export async function loader() {
    return defer({
        delayedData: new Promise(resolve => setTimeout(() => resolve("Data Loaded"), 3000)),
    });
}

export default function Stream() {
    const data = useLoaderData<typeof loader>();

    return (
        <React.Suspense fallback={<Skeleton className="w-full h-64" />}> 
            <Await resolve={data.delayedData}>
                {loadedData => <div>{loadedData}</div>}
            </Await>
        </React.Suspense> 
    );
}
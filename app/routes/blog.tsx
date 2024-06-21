import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect } from "@remix-run/react";
import { Breadcrumbs } from "~/components/breadcrumbs";

//Loader function to re-direct to /index if route is /blog
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (url.pathname === "/blog") {
    return redirect("/");
  }
  return null;
}

export default function Blog() {
  return (
    // container
    <div className="flex flex-col w-full items-center">
      <div className="w-full max-w-screen-xl px-4">
        <div className="ml-0 sm:ml-4">
          <Breadcrumbs />
        </div>
        <div className="flex flex-col items-center mt-8 p-4 w-full">
          <div className="prose sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto" style={{ maxWidth: "90%" }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
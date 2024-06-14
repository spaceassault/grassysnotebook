import { Outlet } from "@remix-run/react";
import { Breadcrumbs } from "~/components/breadcrumbs";

export default function Blog() {
  return (
    <div className="p-10 prose sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
      <Breadcrumbs />
      <Outlet />
    </div>
  );
}
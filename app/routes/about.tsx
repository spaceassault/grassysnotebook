import { Outlet } from "@remix-run/react";

export default function About() {
    return (
      <div className="flex justify-center p-10">
      <div className="prose sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto" style={{ maxWidth: "75%" }}>
        <Outlet />
      </div>
      </div>
    );
  }
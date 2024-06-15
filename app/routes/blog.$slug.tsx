import * as React from "react";
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import fs from "fs/promises";
import path from "path";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import { fileURLToPath } from "url";
import { Breadcrumbs } from "~/components/breadcrumbs";

// Handle ESM environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  const filePath = path.join(__dirname, "../../public/posts", `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf-8");

  const { code, frontmatter } = await bundleMDX({
    source,
    cwd: path.join(__dirname, "../"),
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        ".js": "jsx",
        ".ts": "tsx",
      };
      options.platform = "node";
      return options;
    },
  });

  return json({ code, frontmatter });
}

export default function BlogPost() {
  const { code, frontmatter } = useLoaderData<LoaderFunction>();
  const Component = React.useMemo(() => (code ? getMDXComponent(code) : null), [code]);

  if (!Component) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 max-xl">
      <h1>{frontmatter.title}</h1>
      <h3>by: {frontmatter.author}</h3>
      <p>{frontmatter.date}</p>
      <Component />
    </div>
  );
}



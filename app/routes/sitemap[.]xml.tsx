import { LoaderFunction } from "@remix-run/node";
import { getPosts } from "~/lib/posts.server"; // Adjust this import based on your project structure

export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  const siteUrl = "https://www.grassysnotebook.com"; // Use localhost for local testing

  const staticPages = [
    "",
    "about",
    "contact",
    // Add other static pages here
  ];

  const postUrls = posts.map((post) => `${siteUrl}/blog/${post.slug}`);
  const staticUrls = staticPages.map((page) => `${siteUrl}/${page}`);

  const urls = [...staticUrls, ...postUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map((url) => {
      return `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>`;
    })
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};

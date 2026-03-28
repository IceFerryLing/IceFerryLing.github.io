import { getSortedPosts } from "@/lib/posts";
import { toAbsoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap() {
  const posts = getSortedPosts();

  const staticRoutes = ["/", "/about", "/archive", "/rss.xml"];

  const staticEntries = staticRoutes.map((route) => ({
    url: toAbsoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7
  }));

  const postEntries = posts.map((post) => ({
    url: toAbsoluteUrl(`/posts/${post.slug}`),
    lastModified: new Date(`${post.date}T00:00:00.000Z`),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  return [...staticEntries, ...postEntries];
}

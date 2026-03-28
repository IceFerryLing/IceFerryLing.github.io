import { getSortedPosts, getTotalPostPages } from "@/lib/posts";
import { toAbsoluteUrl } from "@/lib/site";

export default function sitemap() {
  const posts = getSortedPosts();
  const totalPages = getTotalPostPages();

  const staticRoutes = ["/", "/about", "/archive", "/rss.xml"];

  const paginatedArchiveRoutes = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
    `/archive/page/${index + 2}`
  );

  const staticEntries = [...staticRoutes, ...paginatedArchiveRoutes].map((route) => ({
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

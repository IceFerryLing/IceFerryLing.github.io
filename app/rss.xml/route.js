import { getSortedPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, toAbsoluteUrl } from "@/lib/site";

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getSortedPosts();
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const postUrl = toAbsoluteUrl(`/posts/${post.slug}`);
      const pubDate = new Date(`${post.date}T00:00:00.000Z`).toUTCString();

      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${postUrl}</link>
          <guid>${postUrl}</guid>
          <pubDate>${pubDate}</pubDate>
          <description><![CDATA[${post.description || post.excerpt}]]></description>
        </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${toAbsoluteUrl("/")}</link>
      <description>${escapeXml(SITE_DESCRIPTION)}</description>
      <language>zh-cn</language>
      <lastBuildDate>${buildDate}</lastBuildDate>
      ${items}
    </channel>
  </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}

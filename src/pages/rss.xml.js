import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../config/site';
import { getSortedPosts } from '../lib/posts';

export const prerender = true;

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = getSortedPosts();
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = new URL(`/posts/${post.slug}/`, SITE_URL).toString();
      return `<item>
  <title><![CDATA[${post.title}]]></title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${new Date(`${post.date}T00:00:00.000Z`).toUTCString()}</pubDate>
  <description><![CDATA[${post.description || post.excerpt}]]></description>
</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${escapeXml(SITE_NAME)}</title>
<link>${SITE_URL}</link>
<description>${escapeXml(SITE_DESCRIPTION)}</description>
<language>zh-cn</language>
<lastBuildDate>${buildDate}</lastBuildDate>
${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  });
}

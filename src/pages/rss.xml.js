import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../config/site';
import { getSortedPosts } from '../lib/posts';

// RSS 为静态输出
export const prerender = true;

// XML 转义工具，防止特殊字符破坏 RSS 格式
function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 生成 RSS XML 响应
export async function GET() {
  const posts = getSortedPosts();
  const buildDate = new Date().toUTCString();

  // 将文章列表映射为 RSS item 节点
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
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0"><channel>
<title>${escapeXml(SITE_NAME)}</title>
<link>${SITE_URL}</link>
<description>${escapeXml(SITE_DESCRIPTION)}</description>
<language>zh-cn</language>
<lastBuildDate>${buildDate}</lastBuildDate>
${items}
</channel></rss>`;

  // 返回标准 RSS 响应头
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  });
}

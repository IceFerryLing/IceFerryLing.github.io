import { SITE_URL } from '../config/site';

// robots.txt 为静态输出
export const prerender = true;

// 输出搜索引擎爬取规则与 sitemap 地址
export async function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', SITE_URL).toString()}\n`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}

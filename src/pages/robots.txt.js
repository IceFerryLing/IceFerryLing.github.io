import { SITE_URL } from '../config/site';

export const prerender = true;

export async function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', SITE_URL).toString()}\n`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}

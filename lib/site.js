export const SITE_NAME = "IceFerryLing";
export const SITE_DESCRIPTION = "以紫色星云为基调的个人博客，记录代码、生活与灵感。";

const FALLBACK_URL = "https://example.com";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configured) {
    return new URL(FALLBACK_URL);
  }

  try {
    return new URL(configured);
  } catch {
    return new URL(FALLBACK_URL);
  }
}

export function toAbsoluteUrl(pathname = "/") {
  const siteUrl = getSiteUrl();
  return new URL(pathname, siteUrl).toString();
}

import { toAbsoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: toAbsoluteUrl("/sitemap.xml")
  };
}

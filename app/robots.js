import { toAbsoluteUrl } from "@/lib/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: toAbsoluteUrl("/sitemap.xml")
  };
}

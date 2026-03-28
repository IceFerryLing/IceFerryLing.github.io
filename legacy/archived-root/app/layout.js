import "./globals.css";
import Link from "next/link";
import { SITE_DESCRIPTION, SITE_NAME, toAbsoluteUrl } from "@/lib/site";

export const metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(toAbsoluteUrl("/")),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: `${SITE_NAME} RSS` }]
    }
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/assets/images/hero-purple.svg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} 紫色星云博客封面`
      }
    ],
    locale: "zh_CN"
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/assets/images/hero-purple.svg"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-grid"></div>

        <header className="site-header">
          <div className="container header-inner">
            <Link className="brand" href="/">
              <span className="brand-mark">✦</span>
              <span className="brand-text">{SITE_NAME}</span>
            </Link>
            <nav className="site-nav">
              <Link href="/">首页</Link>
              <Link href="/about">关于</Link>
              <Link href="/archive">归档</Link>
            </nav>
          </div>
        </header>

        <main className="site-main">{children}</main>

        <footer className="site-footer">
          <div className="container footer-inner">
            <p>
              © {new Date().getFullYear()} {SITE_NAME} · 紫色星云里记录生活与代码
            </p>
            <p className="muted">Powered by Next.js</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

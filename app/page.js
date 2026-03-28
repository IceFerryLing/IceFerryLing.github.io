import Link from "next/link";
import { getSortedPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "首页",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `${SITE_NAME} · 首页`,
    description: SITE_DESCRIPTION,
    url: "/",
    images: ["/assets/images/hero-purple.svg"]
  }
};

export default function HomePage() {
  const posts = getSortedPosts().slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-overlay"></div>
          <img src="/assets/images/hero-purple.svg" alt="紫色风格博客封面" className="hero-image" />
          <img src="/assets/images/anime-01.png" alt="二次元头像点缀" className="hero-deco" />
          <div className="hero-content">
            <p className="eyebrow">ICEFERRYLING BLOG</p>
            <h1>欢迎来到我的紫色星云博客</h1>
            <p className="subtitle">记录代码、生活、灵感与每一次“啊哈”时刻。</p>
          </div>
        </div>
      </section>

      <section className="post-list-wrap">
        <div className="container">
          <h2>最新文章</h2>
          <div className="post-grid">
            {posts.map((post) => (
              <article className="post-card" key={post.slug}>
                <p className="post-meta">{post.date}</p>
                <h3>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.excerpt}</p>
              </article>
            ))}
          </div>
          <div className="post-deco">
            <img src="/assets/images/anime-03.png" alt="二次元头像点缀" />
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { getPaginatedPosts } from "@/lib/posts";

function Pagination({ page, totalPages }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="文章分页导航">
      {page > 1 ? <Link href={page === 2 ? "/archive" : `/archive/page/${page - 1}`}>上一页</Link> : null}

      <span className="pagination-info">
        第 {page} / {totalPages} 页
      </span>

      {page < totalPages ? <Link href={`/archive/page/${page + 1}`}>下一页</Link> : null}
    </nav>
  );
}

export const metadata = {
  title: "归档",
  description: "把时间轴里的紫色片段收集起来。",
  alternates: {
    canonical: "/archive"
  },
  openGraph: {
    title: "归档 · IceFerryLing",
    description: "把时间轴里的紫色片段收集起来。",
    url: "/archive"
  }
};

export default function ArchivePage() {
  const { posts, page, totalPages } = getPaginatedPosts(1);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>归档</h1>
          <p className="page-subtitle">把时间轴里的紫色片段收集起来。</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
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
          <Pagination page={page} totalPages={totalPages} />
        </div>
      </section>
    </>
  );
}

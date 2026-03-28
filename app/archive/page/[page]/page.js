import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaginatedPosts, getTotalPostPages } from "@/lib/posts";

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

export function generateStaticParams() {
  const totalPages = getTotalPostPages();

  return Array.from({ length: totalPages - 1 }, (_, index) => ({
    page: String(index + 2)
  }));
}

export async function generateMetadata({ params }) {
  const { page } = await params;
  const current = Number(page);

  return {
    title: `归档 第 ${current} 页`,
    description: `博客文章归档列表，第 ${current} 页。`,
    alternates: {
      canonical: `/archive/page/${current}`
    },
    openGraph: {
      title: `归档 第 ${current} 页 · IceFerryLing`,
      description: `博客文章归档列表，第 ${current} 页。`,
      url: `/archive/page/${current}`
    }
  };
}

export default async function ArchivePaginatedPage({ params }) {
  const { page } = await params;
  const currentPage = Number(page);
  const totalPages = getTotalPostPages();

  if (!Number.isInteger(currentPage) || currentPage < 2 || currentPage > totalPages) {
    notFound();
  }

  const { posts } = getPaginatedPosts(currentPage);

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
          <Pagination page={currentPage} totalPages={totalPages} />
        </div>
      </section>
    </>
  );
}

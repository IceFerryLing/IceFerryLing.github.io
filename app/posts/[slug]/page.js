import { notFound } from "next/navigation";
import { getPostBySlug, getSortedPosts, markdownToHtml } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getSortedPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章不存在"
    };
  }

  return {
    title: post.title,
    description: post.description || post.excerpt,
    alternates: {
      canonical: `/posts/${post.slug}`
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description || post.excerpt,
      url: `/posts/${post.slug}`,
      publishedTime: `${post.date}T00:00:00.000Z`,
      images: [post.image || "/assets/images/hero-purple.svg"]
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} · ${SITE_NAME}`,
      description: post.description || post.excerpt,
      images: [post.image || "/assets/images/hero-purple.svg"]
    }
  };
}

export default async function PostDetailPage({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const html = await markdownToHtml(post.content);

  return (
    <>
      <section className="post-hero">
        <div className="container">
          <p className="post-meta">{post.date}</p>
          <h1 className="post-title">{post.title}</h1>
          {post.description ? <p className="post-subtitle">{post.description}</p> : null}
        </div>
      </section>

      <section className="post-content">
        <div className="container prose" dangerouslySetInnerHTML={{ __html: html }} />
      </section>
    </>
  );
}

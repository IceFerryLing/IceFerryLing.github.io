import { getSortedPosts } from "@/lib/posts";
import ArchiveClient from "@/components/archive-client";

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
  const posts = getSortedPosts();

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
          <ArchiveClient posts={posts} />
        </div>
      </section>
    </>
  );
}

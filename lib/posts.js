import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "_posts");
const DEFAULT_PAGE_SIZE = 6;

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`.*?`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[>#*_~-]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

function resolveMetaFromFilename(fileName) {
  const matched = fileName.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
  if (!matched) {
    return {
      dateFromName: "1970-01-01",
      slug: fileName.replace(/\.md$/, "")
    };
  }

  return {
    dateFromName: matched[1],
    slug: matched[2]
  };
}

function normalizeDate(rawDate) {
  if (!rawDate) {
    return "1970-01-01";
  }

  if (rawDate instanceof Date) {
    return rawDate.toISOString().slice(0, 10);
  }

  return String(rawDate).slice(0, 10);
}

export function getSortedPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory).filter((name) => name.endsWith(".md"));

  const allPosts = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const { dateFromName, slug } = resolveMetaFromFilename(fileName);
    const date = normalizeDate(data.date || dateFromName);
    const excerpt = stripMarkdown(content).slice(0, 110);

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      image: data.image || "",
      date,
      content,
      excerpt: excerpt.length >= 110 ? `${excerpt}...` : excerpt
    };
  });

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug) {
  const posts = getSortedPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export function getTotalPostPages(pageSize = DEFAULT_PAGE_SIZE) {
  const posts = getSortedPosts();
  return Math.max(1, Math.ceil(posts.length / pageSize));
}

export function getPaginatedPosts(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const posts = getSortedPosts();
  const safePage = Math.max(1, Number(page) || 1);
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const normalizedPage = Math.min(safePage, totalPages);
  const start = (normalizedPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    posts: posts.slice(start, end),
    page: normalizedPage,
    pageSize,
    totalPages,
    totalPosts: posts.length
  };
}

export async function markdownToHtml(markdown) {
  const processed = await remark().use(html).process(markdown || "");
  return processed.toString();
}

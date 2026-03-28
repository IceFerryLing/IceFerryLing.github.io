import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const projectRoot = process.cwd();
const assetsSourceDir = path.join(projectRoot, "assets");
const publicDir = path.join(projectRoot, "public");
const publicAssetsDir = path.join(publicDir, "assets");
const contentPostsDir = path.join(projectRoot, "content", "posts");
const legacyPostsDir = path.join(projectRoot, "_posts");
const rssPath = path.join(publicDir, "rss.xml");
const noJekyllPath = path.join(publicDir, ".nojekyll");

const siteName = "IceFerryLing";
const siteDescription = "以紫色星云为基调的个人博客，记录代码、生活与灵感。";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();

function toAbsoluteUrl(pathname = "/") {
  return new URL(pathname, siteUrl).toString();
}

function stripMarkdown(markdown = "") {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`.*?`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[>#*_~-]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

async function ensurePublicAssets() {
  await fs.mkdir(publicDir, { recursive: true });
  await fs.cp(assetsSourceDir, publicAssetsDir, { recursive: true, force: true });
  await fs.writeFile(noJekyllPath, "", "utf8");
}

async function readPosts() {
  const preferredPostsDir =
    (await fs
      .access(contentPostsDir)
      .then(() => true)
      .catch(() => false))
      ? contentPostsDir
      : legacyPostsDir;

  try {
    const fileNames = (await fs.readdir(preferredPostsDir)).filter(
      (name) => name.endsWith(".md") && !name.startsWith("_")
    );

    const posts = await Promise.all(
      fileNames.map(async (fileName) => {
        const fullPath = path.join(preferredPostsDir, fileName);
        const fileContents = await fs.readFile(fullPath, "utf8");
        const { data, content } = matter(fileContents);
        const { dateFromName, slug: slugFromFileName } = resolveMetaFromFilename(fileName);
        const slug = data.slug || slugFromFileName;
        const date = String(data.date || dateFromName).slice(0, 10);
        const excerpt = stripMarkdown(content).slice(0, 110);

        return {
          slug,
          title: data.title || slug,
          description: data.description || excerpt,
          date,
          excerpt
        };
      })
    );

    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    return [];
  }
}

async function writeRss() {
  const posts = await readPosts();
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const postUrl = toAbsoluteUrl(`/posts/${post.slug}`);
      const pubDate = new Date(`${post.date}T00:00:00.000Z`).toUTCString();

      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${postUrl}</link>
          <guid>${postUrl}</guid>
          <pubDate>${pubDate}</pubDate>
          <description><![CDATA[${post.description || post.excerpt}]]></description>
        </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${toAbsoluteUrl("/")}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>zh-cn</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  await fs.writeFile(rssPath, rss, "utf8");
}

await ensurePublicAssets();
await writeRss();
console.log("✅ static assets and rss.xml prepared");

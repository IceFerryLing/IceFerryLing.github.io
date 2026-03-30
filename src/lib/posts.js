import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { markedKatex } from 'marked-katex-extension';
import { codeToHtml } from 'shiki';
import { POSTS_PER_PAGE } from '../config/site';

marked.use(
  markedKatex({
    throwOnError: false,
    output: 'htmlAndMathml'
  })
);

const contentPostsDirectory = path.join(process.cwd(), 'content', 'posts');
const legacyPostsDirectory = path.join(process.cwd(), 'legacy', 'archived-root', '_posts');

// 将 Markdown 转为纯文本，便于摘要/字数统计
function stripMarkdown(markdown = '') {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`.*?`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[>#*_~-]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

// 生成稳定 slug（兼容中英文）
function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[\u4e00-\u9fa5]/g, (m) => m)
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// 提取 H2~H4 标题并生成唯一锚点 id（供目录使用）
function extractHeadings(markdown = '') {
  const lines = markdown.split('\n');
  const headings = [];
  const used = new Map();

  lines.forEach((line) => {
    const matched = line.match(/^(#{2,4})\s+(.+)$/);
    if (!matched) return;
    const depth = matched[1].length;
    const text = matched[2].replace(/`/g, '').trim();
    const base = slugify(text) || 'section';
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    headings.push({ depth, text, id });
  });

  return headings;
}

// 统一日期格式为 YYYY-MM-DD
function normalizeDate(rawDate) {
  if (!rawDate) return '1970-01-01';
  if (rawDate instanceof Date) return rawDate.toISOString().slice(0, 10);
  return String(rawDate).slice(0, 10);
}

// 规范化分类字段（兼容字符串/数组/空值）
function normalizeCategory(rawCategory) {
  if (typeof rawCategory === 'string') {
    const value = rawCategory.trim();
    return value || '未分类';
  }

  if (Array.isArray(rawCategory)) {
    const first = rawCategory.map((item) => String(item || '').trim()).find(Boolean);
    return first || '未分类';
  }

  return '未分类';
}

// 规范化标签字段（兼容数组/逗号分隔字符串）
function normalizeTags(rawTags) {
  let tags = [];

  if (Array.isArray(rawTags)) {
    tags = rawTags;
  } else if (typeof rawTags === 'string') {
    tags = rawTags.split(/[,，]/g);
  }

  return Array.from(new Set(tags.map((tag) => String(tag || '').trim()).filter(Boolean)));
}

// 兼容 Jekyll 风格文件名：yyyy-mm-dd-slug.md
function resolveMetaFromFilename(fileName) {
  const matched = fileName.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
  if (!matched) {
    return {
      dateFromName: '1970-01-01',
      slugFromName: fileName.replace(/\.md$/, '')
    };
  }

  return {
    dateFromName: matched[1],
    slugFromName: matched[2]
  };
}

// 优先读取 content/posts；不存在则回退 legacy 目录
function getPostsDirectory() {
  if (fs.existsSync(contentPostsDirectory)) return contentPostsDirectory;
  return legacyPostsDirectory;
}

// 读取并解析所有文章，附加摘要、字数、阅读时长等派生字段
export function getSortedPosts() {
  const postsDirectory = getPostsDirectory();
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith('.md') && !name.startsWith('_') && name.toLowerCase() !== 'readme.md');

  const allPosts = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const { dateFromName, slugFromName } = resolveMetaFromFilename(fileName);

    const slug = data.slug || slugFromName;
    const date = normalizeDate(data.date || dateFromName);
    const excerptRaw = data.description || stripMarkdown(content);
    const excerpt = excerptRaw.length > 120 ? `${excerptRaw.slice(0, 120)}...` : excerptRaw;
    const words = stripMarkdown(content).split(/\s+/).filter(Boolean).length;
    const category = normalizeCategory(data.category);
    const tags = normalizeTags(data.tags);

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      image: data.image || '/assets/images/hero-purple.svg',
      date,
      category,
      tags,
      content,
      excerpt,
      words,
      readingMinutes: Math.max(1, Math.ceil(words / 250))
    };
  });

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 根据 slug 获取单篇文章
export function getPostBySlug(slug) {
  return getSortedPosts().find((post) => post.slug === slug) || null;
}

// 文章前后导航（上一篇/下一篇）
export function getAdjacentPosts(slug) {
  const posts = getSortedPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null
  };
}

// 聚合分类计数
export function getAllCategories(posts = getSortedPosts()) {
  const map = new Map();
  posts.forEach((post) => {
    const key = post.category || '未分类';
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

// 聚合标签计数
export function getAllTags(posts = getSortedPosts()) {
  const map = new Map();
  posts.forEach((post) => {
    post.tags.forEach((tag) => map.set(tag, (map.get(tag) || 0) + 1));
  });
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

// 通用分页函数
export function paginatePosts(posts, page = 1, pageSize = POSTS_PER_PAGE) {
  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    page: safePage,
    pageSize,
    total,
    totalPages,
    data: posts.slice(start, start + pageSize)
  };
}

// 使用 Shiki 渲染代码块（失败时回退为 text）
async function renderCodeBlock(code, lang) {
  const language = (lang || 'text').toLowerCase().trim() || 'text';
  try {
    return await codeToHtml(code, {
      lang: language,
      themes: {
        dark: 'github-dark',
        light: 'github-light'
      }
    });
  } catch {
    return await codeToHtml(code, {
      lang: 'text',
      themes: {
        dark: 'github-dark',
        light: 'github-light'
      }
    });
  }
}

// Markdown -> HTML：先占位代码块，再整体解析并回填，最后注入标题 id
export async function markdownToHtml(markdown = '') {
  const headings = extractHeadings(markdown);
  const codeBlocks = [];
  const markdownWithPlaceholders = markdown.replace(/```([^\n]*)\n([\s\S]*?)```/g, (_, lang = '', code = '') => {
    const index = codeBlocks.push({ lang: String(lang).trim(), code }) - 1;
    return `@@CODE_BLOCK_${index}@@`;
  });

  let html = marked.parse(markdownWithPlaceholders);

  for (let i = 0; i < codeBlocks.length; i++) {
    const block = codeBlocks[i];
    const rendered = await renderCodeBlock(block.code, block.lang);
    const placeholder = `@@CODE_BLOCK_${i}@@`;
    html = html.replace(`<p>${placeholder}</p>`, rendered).replace(placeholder, rendered);
  }

  headings.forEach((heading) => {
    const tag = `h${heading.depth}`;
    const plainText = heading.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`<${tag}>\\s*${plainText}\\s*<\\/${tag}>`);
    html = html.replace(pattern, `<${tag} id="${heading.id}">${heading.text}</${tag}>`);
  });

  return { html, headings };
}

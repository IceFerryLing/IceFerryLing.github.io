import fs from 'node:fs';
import path from 'node:path';
import { markdownToHtml } from './posts';

const SERIES_DEFINITIONS = [
  {
    key: 'linux-source-code-analyze',
    title: 'Linux 源码分析',
    description: 'Linux 源码分析系列文档树。',
    rootDirectory: path.join(process.cwd(), 'linux-source-code-analyze'),
    readmeFileName: 'README.md'
  },
  {
    key: 'csapp-learning',
    title: 'CSAPP Learning',
    description: 'CSAPP 学习笔记系列文档树。',
    rootDirectory: path.join(process.cwd(), 'csapp-learning'),
    readmeFileName: 'README.md'
  }
];

const ignoredDirectories = new Set(['.git', 'node_modules']);

function ensurePosixPath(filePath = '') {
  return String(filePath || '').split(path.sep).join('/');
}

function decodeSlugPath(slugPath = '') {
  return String(slugPath || '')
    .split('/')
    .map((segment) => decodeURIComponent(segment))
    .filter(Boolean)
    .join('/');
}

function toTitleFromFileName(fileName = '') {
  return fileName
    .replace(/\.md$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();
}

function readMarkdownFiles(directory, baseDirectory = directory) {
  if (!fs.existsSync(directory)) return [];

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name) || entry.name.startsWith('.')) continue;
      files.push(...readMarkdownFiles(fullPath, baseDirectory));
      continue;
    }

    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.md')) continue;

    const relativePath = ensurePosixPath(path.relative(baseDirectory, fullPath));
    files.push({ relativePath, fullPath, fileName: entry.name });
  }

  return files;
}

function extractTitle(content = '', fallback = '') {
  const matched = String(content || '').match(/^#\s+(.+)$/m);
  if (matched && matched[1]) return matched[1].trim();
  return fallback;
}

function createFolderNode(name, key) {
  return { name, key, folders: new Map(), files: [] };
}

function createOrderedFolderNode(name, key) {
  return { name, key, folders: [], files: [] };
}

function getSeriesDefinition(seriesKey = '') {
  const key = String(seriesKey || '').trim();
  if (!key) return SERIES_DEFINITIONS[0] || null;
  return SERIES_DEFINITIONS.find((item) => item.key === key) || null;
}

function getSeriesReadmePath(seriesKey = '') {
  const definition = getSeriesDefinition(seriesKey);
  if (!definition) return null;
  return path.join(definition.rootDirectory, definition.readmeFileName || 'README.md');
}

function finalizeFolder(node) {
  const folders = Array.from(node.folders.values())
    .map(finalizeFolder)
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  const files = [...node.files].sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
  const total = files.length + folders.reduce((sum, folder) => sum + folder.total, 0);
  return { ...node, folders, files, total };
}

function buildTree(documents) {
  const root = createFolderNode('root', 'root');

  for (const doc of documents) {
    const segments = doc.slug.split('/');
    const fileSegment = segments.pop();
    let cursor = root;
    let keyPrefix = '';

    for (const folderName of segments) {
      keyPrefix = keyPrefix ? `${keyPrefix}/${folderName}` : folderName;
      if (!cursor.folders.has(folderName)) {
        cursor.folders.set(folderName, createFolderNode(folderName, keyPrefix));
      }
      cursor = cursor.folders.get(folderName);
    }

    cursor.files.push({
      slug: doc.slug,
      title: doc.title,
      fileName: fileSegment || doc.fileName
    });
  }

  return finalizeFolder(root);
}

function toIndentLevel(indent = '') {
  const normalized = String(indent || '').replace(/\t/g, '    ');
  return Math.floor(normalized.length / 2);
}

function extractSlugFromReadmeLink(link = '') {
  const raw = String(link || '').trim();
  if (!raw) return '';
  const withoutHash = raw.split('#')[0];
  const normalized = withoutHash.replace(/\\/g, '/');
  const matched = normalized.match(/(?:^|\/)([^/?#]+)\.md$/i);
  return matched ? decodeURIComponent(matched[1]) : '';
}

function finalizeOrderedFolder(node) {
  const folders = node.folders.map(finalizeOrderedFolder);
  const files = [...node.files];
  const total = files.length + folders.reduce((sum, folder) => sum + folder.total, 0);
  return { ...node, folders, files, total };
}

function buildTreeFromReadme(documents, seriesKey = '') {
  const seriesReadmePath = getSeriesReadmePath(seriesKey);
  if (!seriesReadmePath || !fs.existsSync(seriesReadmePath)) return null;

  const readme = fs.readFileSync(seriesReadmePath, 'utf8');
  const lines = readme.split(/\r?\n/);
  const start = lines.findIndex((line) => /^##\s+目录\s*$/.test(line.trim()));
  if (start < 0) return null;

  const docBySlug = new Map(documents.map((doc) => [doc.slug.toLowerCase(), doc]));
  const usedSlugs = new Set();
  const root = createOrderedFolderNode('root', 'root');
  const stack = [{ depth: -1, node: root }];

  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^##\s+/.test(line.trim())) break;

    const bullet = line.match(/^(\s*)[*-]\s+(.+)$/);
    if (!bullet) continue;

    const depth = toIndentLevel(bullet[1]);
    const itemText = bullet[2].trim();
    const linkMatched = itemText.match(/^\[(.+?)\]\((.+?)\)$/);

    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].node;

    if (linkMatched) {
      const title = linkMatched[1].trim();
      const rawSlug = extractSlugFromReadmeLink(linkMatched[2]);
      const doc = docBySlug.get(rawSlug.toLowerCase());
      if (!doc) continue;
      usedSlugs.add(doc.slug);
      parent.files.push({
        slug: doc.slug,
        title: title || doc.title,
        fileName: doc.fileName
      });
      continue;
    }

    const folderName = itemText;
    const folderKey = `${parent.key}/${folderName}-${parent.folders.length}`;
    const folder = createOrderedFolderNode(folderName, folderKey);
    parent.folders.push(folder);
    stack.push({ depth, node: folder });
  }

  const remaining = documents.filter((doc) => !usedSlugs.has(doc.slug));
  if (remaining.length) {
    root.folders.push({
      name: '其他文档',
      key: 'root/others',
      folders: [],
      files: remaining.map((doc) => ({
        slug: doc.slug,
        title: doc.title,
        fileName: doc.fileName
      }))
    });
  }

  const orderedDocs = [];
  const walk = (node) => {
    node.files.forEach((item) => {
      const doc = docBySlug.get(String(item.slug || '').toLowerCase());
      if (doc) orderedDocs.push(doc);
    });
    node.folders.forEach(walk);
  };
  walk(root);

  return {
    tree: finalizeOrderedFolder(root),
    documents: orderedDocs
  };
}

export function getSeriesDefinitions() {
  return SERIES_DEFINITIONS.map((definition) => ({ ...definition }));
}

export function seriesSlugToUrl(seriesKey = '', slug = '') {
  const seriesSegment = String(seriesKey || '').trim();
  const encoded = String(slug || '')
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return seriesSegment ? `/series/${encodeURIComponent(seriesSegment)}/${encoded}/` : `/series/${encoded}/`;
}

export function getSeriesDocuments(seriesKey = '') {
  const definition = getSeriesDefinition(seriesKey);
  if (!definition) return [];

  const files = readMarkdownFiles(definition.rootDirectory);
  const documents = files.map((file) => {
    const content = fs.readFileSync(file.fullPath, 'utf8');
    const slug = file.relativePath.replace(/\.md$/i, '');
    return {
      seriesKey: definition.key,
      seriesTitle: definition.title,
      slug,
      fileName: file.fileName,
      relativePath: file.relativePath,
      title: extractTitle(content, toTitleFromFileName(file.fileName)),
      content
    };
  });

  return documents.sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'zh-CN'));
}

export function getSeriesTree(seriesKey = '') {
  const fallbackDocuments = getSeriesDocuments(seriesKey);
  const readmeTree = buildTreeFromReadme(fallbackDocuments, seriesKey);
  const documents = readmeTree?.documents?.length ? readmeTree.documents : fallbackDocuments;
  const tree = readmeTree?.tree || buildTree(fallbackDocuments);
  return {
    series: getSeriesDefinition(seriesKey),
    root: tree,
    tree: tree.folders,
    documents
  };
}

export function getSeriesDocumentBySlug(seriesKey = '', slugPath) {
  const slug = decodeSlugPath(slugPath);
  return getSeriesDocuments(seriesKey).find((doc) => doc.slug === slug) || null;
}

export async function renderSeriesMarkdown(seriesKey = '', slugPath) {
  const doc = getSeriesDocumentBySlug(seriesKey, slugPath);
  if (!doc) return null;
  const rendered = await markdownToHtml(doc.content);
  return { ...doc, ...rendered };
}

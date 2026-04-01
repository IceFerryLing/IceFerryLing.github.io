import fs from 'node:fs';
import path from 'node:path';
import { markdownToHtml } from './posts';

const seriesRootDirectory = path.join(process.cwd(), 'linux-source-code-analyze');
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

export function seriesSlugToUrl(slug = '') {
  const encoded = String(slug || '')
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `/series/${encoded}/`;
}

export function getSeriesDocuments() {
  const files = readMarkdownFiles(seriesRootDirectory);
  const documents = files.map((file) => {
    const content = fs.readFileSync(file.fullPath, 'utf8');
    const slug = file.relativePath.replace(/\.md$/i, '');
    return {
      slug,
      fileName: file.fileName,
      relativePath: file.relativePath,
      title: extractTitle(content, toTitleFromFileName(file.fileName)),
      content
    };
  });

  return documents.sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'zh-CN'));
}

export function getSeriesTree() {
  const documents = getSeriesDocuments();
  const tree = buildTree(documents);
  return {
    root: tree,
    tree: tree.folders,
    documents
  };
}

export function getSeriesDocumentBySlug(slugPath) {
  const slug = decodeSlugPath(slugPath);
  return getSeriesDocuments().find((doc) => doc.slug === slug) || null;
}

export async function renderSeriesMarkdown(slugPath) {
  const doc = getSeriesDocumentBySlug(slugPath);
  if (!doc) return null;
  const rendered = await markdownToHtml(doc.content);
  return { ...doc, ...rendered };
}

# Engineering Guide

## Runtime Baseline

- Node.js: `>=20`
- Package manager: `npm`
- Framework: `Astro` (static output)

## Command Contract

- `npm run dev`：本地开发
- `npm run build`：生产构建
- `npm run preview`：本地预览构建产物
- `npm run check`：Astro 项目检查
- `npm run clean`：清理 `dist/` 与 `.astro/`
- `npm run rebuild`：先 clean 再 build

## Environment Variables

- `SITE_URL`：站点完整 URL（推荐）
- `NEXT_PUBLIC_SITE_URL`：兼容旧配置（可逐步废弃）
- `GISCUS_REPO`
- `GISCUS_REPO_ID`
- `GISCUS_CATEGORY`
- `GISCUS_CATEGORY_ID`

## Project Conventions

- 文章主来源：`content/posts/*.md`
- 旧文章兜底：`legacy/archived-root/_posts/*.md`
- 运行代码在 `src/` / `public/` / `content/`
- 历史文件放 `legacy/`，不参与当前构建

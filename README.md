# IceFerryLing Astro Blog

当前项目已完成从 Jekyll / Next.js 到 Astro 的迁移，默认构建目标为静态站点（GitHub Pages）。

## 目录结构（当前主干）

- `src/`：页面、布局、组件与样式
- `public/`：静态资源（图片、脚本等）
- `content/posts/`：Markdown 文章内容
- `legacy/`：历史框架归档（不参与当前构建）

## 常用命令

- `npm run dev`：本地开发
- `npm run build`：构建静态产物到 `dist/`
- `npm run preview`：预览构建结果
- `npm run check`：工程检查（Astro）
- `npm run clean`：清理构建缓存
- `npm run rebuild`：清理并重新构建

## 工程文档

- `docs/ENGINEERING.md`：工程约定、命令契约、环境变量
- `docs/DEPLOYMENT.md`：GitHub Pages 部署说明

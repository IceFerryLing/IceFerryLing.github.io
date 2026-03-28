# Deployment (GitHub Pages)

## Workflow

使用 `.github/workflows/deploy-pages.yml`：

1. `npm ci`
2. `npm run build`
3. 上传 `dist/`
4. 发布到 GitHub Pages

## Required Settings

- Repository -> Settings -> Pages -> Source: **GitHub Actions**
- Default branch: `main`

## Build Environment

工作流中注入：

- `SITE_URL=https://iceferryling.github.io`

## Local Preflight

发布前建议在本地执行：

- `npm run check`
- `npm run build`

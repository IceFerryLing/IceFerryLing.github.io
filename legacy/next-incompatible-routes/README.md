这些路由在 Next.js `output: "export"`（静态导出）模式下不可用：

- app/assets/[...path]/route.js（已由 `public/assets` 静态资源替代）
- app/rss.xml/route.js（已由 `scripts/prepare-static.mjs` 生成 `public/rss.xml` 替代）

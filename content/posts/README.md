# 发文方式（Markdown）

以后新增文章只需要：

1. 在 `content/posts/` 下新建一个 `.md` 文件（可复制 `_template.md`）。
2. 填写 frontmatter：
   - `title`: 标题
   - `date`: 日期（YYYY-MM-DD）
   - `slug`: 文章链接名（例如 `my-first-post`）
   - `description`: 摘要
   - `image`: 封面图（可选）
3. 正文使用标准 Markdown。

示例链接将是：`/posts/<slug>`。

> 兼容说明：旧 `_posts/*.md` 仍可读取，但优先读取 `content/posts/*.md`。

<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title><xsl:value-of select="rss/channel/title" /> · RSS</title>
        <style>
          :root {
            color-scheme: dark;
            --bg: #0c0718;
            --card: rgba(30, 18, 58, 0.75);
            --text: #f4f1ff;
            --muted: #b8a9e3;
            --accent: #a784ff;
            --border: rgba(165, 126, 255, 0.35);
          }
          @media (prefers-color-scheme: light) {
            :root {
              color-scheme: light;
              --bg: #f6f2ff;
              --card: rgba(255, 255, 255, 0.9);
              --text: #2b1f49;
              --muted: #705f98;
              --accent: #7f52f1;
              --border: rgba(128, 97, 210, 0.25);
            }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: "PingFang SC", "Noto Sans SC", system-ui, -apple-system, sans-serif;
            background: radial-gradient(1200px circle at 10% 0%, rgba(133, 92, 255, .22), transparent 55%), var(--bg);
            color: var(--text);
            line-height: 1.65;
          }
          .wrap {
            width: min(980px, 92vw);
            margin: 28px auto 50px;
          }
          .card {
            border: 1px solid var(--border);
            border-radius: 18px;
            background: var(--card);
            padding: 18px 20px;
            backdrop-filter: blur(12px);
          }
          h1 {
            margin: 0 0 6px;
            font-size: clamp(1.4rem, 2.2vw, 2rem);
          }
          .meta {
            margin: 0;
            color: var(--muted);
            font-size: .92rem;
          }
          .tip {
            margin-top: 14px;
            color: var(--muted);
            font-size: .88rem;
          }
          .list {
            margin-top: 14px;
            display: grid;
            gap: 12px;
          }
          .item {
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 14px;
            background: color-mix(in oklab, var(--card) 88%, #0000 12%);
          }
          .item h2 {
            margin: 0 0 8px;
            font-size: 1.05rem;
          }
          .item a {
            color: var(--accent);
            text-decoration: none;
          }
          .item a:hover { text-decoration: underline; }
          .date {
            color: var(--muted);
            font-size: .85rem;
            margin-bottom: 6px;
          }
          .desc {
            margin: 0;
            font-size: .95rem;
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card">
            <h1><xsl:value-of select="rss/channel/title" /> · RSS 订阅</h1>
            <p class="meta"><xsl:value-of select="rss/channel/description" /></p>
            <p class="tip">这是面向 RSS 阅读器的订阅源页面；你可以复制当前地址到 Feedly / Inoreader 等阅读器中订阅。</p>

            <div class="list">
              <xsl:for-each select="rss/channel/item">
                <article class="item">
                  <h2>
                    <a>
                      <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
                      <xsl:value-of select="title" />
                    </a>
                  </h2>
                  <div class="date"><xsl:value-of select="pubDate" /></div>
                  <p class="desc"><xsl:value-of select="description" /></p>
                </article>
              </xsl:for-each>
            </div>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

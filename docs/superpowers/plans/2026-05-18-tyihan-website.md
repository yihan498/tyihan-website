# tyihan.com 个人网站实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 使用 Hugo 搭建 tianyihan.tyihan.com 个人网站，包含首页、文章、书单、关于、联系五个板块，部署至 GitHub Pages，通过 Cloudflare 绑定子域名。

**Architecture:** Hugo 静态站点生成器 + 纯自定义模板（无主题依赖）+ GitHub Pages 托管 + GitHub Actions 自动部署。用户写文章 → Claude 创建 Markdown → git push → 自动上线。

**Tech Stack:** Hugo extended, HTML/CSS（无 JS 框架）, GitHub Actions, Cloudflare DNS

---

## 文件结构总览

```
/mnt/d/AIhouse/个人网站/
├── config.toml
├── content/
│   ├── _index.md               # 首页内容数据
│   ├── about.md                # 关于页
│   ├── contact.md              # 联系页
│   ├── articles/
│   │   ├── _index.md           # 文章列表页
│   │   └── first-post.md       # 示例文章
│   └── books/
│       └── _index.md           # 书单页
├── layouts/
│   ├── _default/
│   │   ├── baseof.html         # 所有页面的 HTML 骨架
│   │   ├── list.html           # 通用列表页模板
│   │   └── single.html         # 文章详情页模板
│   ├── articles/
│   │   └── list.html           # 文章列表专用模板
│   ├── books/
│   │   └── list.html           # 书单专用模板
│   ├── partials/
│   │   ├── head.html           # <head> 标签内容
│   │   ├── nav.html            # 顶部导航
│   │   └── footer.html         # 页脚
│   └── index.html              # 首页专用模板
├── static/
│   ├── css/
│   │   └── main.css            # 全站样式
│   └── favicon.ico             # 站点图标（占位）
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions 自动部署
```

---

## Task 1: 安装 Hugo

**Files:**
- 无文件变更，仅系统安装

- [ ] **Step 1: 下载 Hugo extended 二进制**

```bash
cd /tmp
wget https://github.com/gohugoio/hugo/releases/download/v0.147.1/hugo_extended_0.147.1_linux-amd64.tar.gz
tar -xzf hugo_extended_0.147.1_linux-amd64.tar.gz
sudo mv hugo /usr/local/bin/hugo
```

- [ ] **Step 2: 验证安装**

```bash
hugo version
```

Expected output 包含: `hugo v0.147` 和 `extended`

---

## Task 2: 初始化 Hugo 项目 + Git

**Files:**
- Create: `/mnt/d/AIhouse/个人网站/config.toml`
- Create: `/mnt/d/AIhouse/个人网站/.gitignore`

- [ ] **Step 1: 在现有目录初始化 Hugo（跳过自动创建目录）**

```bash
cd /mnt/d/AIhouse/个人网站
hugo new site . --force
```

Expected: `Congratulations! Your new Hugo site was created`

- [ ] **Step 2: 删除 Hugo 生成的默认空 toml，写入正式配置**

替换 `config.toml` 内容：

```toml
baseURL = "https://tianyihan.tyihan.com/"
languageCode = "zh-CN"
title = "田一含"
theme = ""

[params]
  description = "终身学习者"
  author = "田一含"
  since = "2026"
  school = "中国人民大学"
  major = "金融学"
  location = "北京"
  wechat = "Elowen Tian"
  email = ""

[menu]
  [[menu.main]]
    name = "文章"
    url = "/articles/"
    weight = 1
  [[menu.main]]
    name = "书单"
    url = "/books/"
    weight = 2
  [[menu.main]]
    name = "关于"
    url = "/about/"
    weight = 3
  [[menu.main]]
    name = "联系"
    url = "/contact/"
    weight = 4

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

- [ ] **Step 3: 创建 .gitignore**

```
public/
resources/
.hugo_build.lock
.DS_Store
```

- [ ] **Step 4: 初始化 git 仓库**

```bash
cd /mnt/d/AIhouse/个人网站
git init
git add config.toml .gitignore
git commit -m "feat: initialize Hugo project"
```

---

## Task 3: 全站 CSS

**Files:**
- Create: `static/css/main.css`

- [ ] **Step 1: 创建 CSS 文件**

```bash
mkdir -p /mnt/d/AIhouse/个人网站/static/css
```

- [ ] **Step 2: 写入 main.css**

```css
/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Base ── */
:root {
  --color-text: #111;
  --color-muted: #999;
  --color-subtle: #bbb;
  --color-border: #eee;
  --color-bg: #fff;
  --font-sans: -apple-system, 'Helvetica Neue', Arial, sans-serif;
  --font-serif: Georgia, 'Times New Roman', serif;
  --max-width: 860px;
  --padding-x: 40px;
}

html { font-size: 16px; -webkit-font-smoothing: antialiased; }

body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
}

a { color: inherit; text-decoration: none; }
a:hover { text-decoration: underline; }

/* ── Layout wrapper ── */
.site-wrapper {
  max-width: var(--max-width);
  margin: 0 auto;
}

/* ── Nav ── */
.site-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px var(--padding-x);
  border-bottom: 1px solid var(--color-border);
}

.nav-brand {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-text);
}

.nav-links {
  display: flex;
  gap: 28px;
  list-style: none;
}

.nav-links a {
  font-size: 12px;
  color: var(--color-muted);
  letter-spacing: 0.5px;
  transition: color 0.15s;
}

.nav-links a:hover { color: var(--color-text); text-decoration: none; }

/* ── Hero (homepage) ── */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  padding: 64px var(--padding-x) 56px;
  border-bottom: 1px solid var(--color-border);
}

.hero-headline {
  font-size: 40px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1.5px;
  color: var(--color-text);
  margin-bottom: 24px;
}

.hero-headline em {
  font-style: italic;
  color: #c0392b;
}

.hero-bio {
  font-size: 13px;
  color: #666;
  line-height: 1.9;
  margin-bottom: 28px;
  font-family: var(--font-serif);
}

.hero-meta {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 7px 18px;
  align-items: baseline;
}

.meta-key {
  font-size: 10px;
  color: var(--color-subtle);
  letter-spacing: 2px;
  text-transform: uppercase;
  white-space: nowrap;
}

.meta-val {
  font-size: 12px;
  color: #555;
}

/* ── Dispatch (homepage right col) ── */
.dispatch-label {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.dispatch-label span {
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-subtle);
  padding-bottom: 3px;
}

.dispatch-label span.active {
  color: #555;
  border-bottom: 1px solid #999;
}

.dispatch-list { list-style: none; }

.dispatch-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 13px 0;
  border-bottom: 1px solid #f5f5f5;
}

.dispatch-item:first-child { border-top: 1px solid #f5f5f5; }

.d-tag {
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--color-subtle);
  min-width: 44px;
  margin-top: 3px;
  flex-shrink: 0;
}

.d-title {
  font-size: 13px;
  color: #333;
  line-height: 1.5;
  font-family: var(--font-serif);
}

.d-when {
  font-size: 11px;
  color: var(--color-subtle);
  margin-left: auto;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Section ── */
.section {
  padding: 48px var(--padding-x);
  border-bottom: 1px solid var(--color-border);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-subtle);
  margin-bottom: 28px;
}

.section-header::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

/* ── Article list ── */
.article-list { list-style: none; }

.article-item {
  display: grid;
  grid-template-columns: 88px 1fr 16px;
  gap: 16px;
  align-items: baseline;
  padding: 16px 0;
  border-bottom: 1px solid #f7f7f7;
}

.article-item:first-child { border-top: 1px solid #f7f7f7; }

.a-date {
  font-size: 11px;
  color: var(--color-subtle);
  font-family: monospace;
}

.a-title {
  font-size: 14px;
  color: #222;
  font-family: var(--font-serif);
  line-height: 1.5;
}

.a-title:hover { color: #000; }

.a-arrow { font-size: 11px; color: #ddd; }

.view-all {
  display: inline-block;
  margin-top: 22px;
  font-size: 12px;
  color: var(--color-subtle);
  letter-spacing: 1px;
}

.view-all:hover { color: var(--color-text); text-decoration: none; }

/* ── Book grid ── */
.book-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.book-card {
  border: 1px solid var(--color-border);
  padding: 18px;
}

.book-status {
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-subtle);
  margin-bottom: 10px;
}

.book-status.reading { color: #777; }

.book-title {
  font-size: 13px;
  color: #222;
  font-family: var(--font-serif);
  line-height: 1.4;
  margin-bottom: 6px;
}

.book-author { font-size: 11px; color: var(--color-subtle); }

/* ── Article single page ── */
.article-single {
  max-width: 640px;
  margin: 0 auto;
  padding: 56px var(--padding-x) 80px;
}

.article-single .article-header { margin-bottom: 40px; }

.article-single .article-title-main {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  font-family: var(--font-serif);
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.article-single .article-meta {
  font-size: 12px;
  color: var(--color-subtle);
  display: flex;
  gap: 16px;
}

.article-single .article-body {
  font-family: var(--font-serif);
  font-size: 16px;
  line-height: 1.9;
  color: #333;
}

.article-single .article-body p { margin-bottom: 1.5em; }
.article-single .article-body h2 { font-size: 20px; margin: 2em 0 0.8em; }
.article-single .article-body h3 { font-size: 17px; margin: 1.8em 0 0.6em; }
.article-single .article-body blockquote {
  border-left: 3px solid #ddd;
  padding-left: 20px;
  color: #666;
  margin: 1.5em 0;
}

.article-nav {
  display: flex;
  justify-content: space-between;
  padding: 28px 0;
  border-top: 1px solid var(--color-border);
  margin-top: 48px;
}

.article-nav a { font-size: 13px; color: var(--color-muted); }

/* ── About / Contact / standalone page ── */
.page-single {
  max-width: 640px;
  margin: 0 auto;
  padding: 64px var(--padding-x) 80px;
}

.page-headline {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -1px;
  margin-bottom: 32px;
}

.page-headline em { font-style: italic; color: #c0392b; }

.page-meta {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 20px;
  margin-bottom: 36px;
  align-items: baseline;
}

.page-body {
  font-family: var(--font-serif);
  font-size: 16px;
  line-height: 1.9;
  color: #333;
}

.page-body p { margin-bottom: 1.4em; }

/* ── Footer ── */
.site-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px var(--padding-x);
  border-top: 1px solid var(--color-border);
}

.footer-copy { font-size: 11px; color: #ccc; }

.footer-links { display: flex; gap: 20px; }

.footer-links a {
  font-size: 11px;
  color: var(--color-subtle);
}

.footer-links a:hover { color: var(--color-text); text-decoration: none; }

/* ── Articles full list page ── */
.articles-page { padding: 56px var(--padding-x) 80px; }

.articles-page h1 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 40px;
}

/* ── Books full page ── */
.books-page { padding: 56px var(--padding-x) 80px; }

.books-page h1 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 40px;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  :root { --padding-x: 20px; }

  .hero {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px var(--padding-x) 40px;
  }

  .hero-headline { font-size: 30px; }

  .book-grid { grid-template-columns: 1fr 1fr; }

  .article-item { grid-template-columns: 1fr; gap: 4px; }
  .a-arrow { display: none; }
}
```

- [ ] **Step 3: 验证文件存在**

```bash
ls /mnt/d/AIhouse/个人网站/static/css/main.css
```

- [ ] **Step 4: Commit**

```bash
cd /mnt/d/AIhouse/个人网站
git add static/css/main.css
git commit -m "feat: add full site CSS"
```

---

## Task 4: 基础布局模板（partials + baseof）

**Files:**
- Create: `layouts/partials/head.html`
- Create: `layouts/partials/nav.html`
- Create: `layouts/partials/footer.html`
- Create: `layouts/_default/baseof.html`

- [ ] **Step 1: 创建目录**

```bash
mkdir -p /mnt/d/AIhouse/个人网站/layouts/partials
mkdir -p /mnt/d/AIhouse/个人网站/layouts/_default
mkdir -p /mnt/d/AIhouse/个人网站/layouts/articles
mkdir -p /mnt/d/AIhouse/个人网站/layouts/books
```

- [ ] **Step 2: 创建 head.html**

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ if .IsHome }}{{ .Site.Title }} — {{ .Site.Params.description }}{{ else }}{{ .Title }} — {{ .Site.Title }}{{ end }}</title>
<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">
<link rel="stylesheet" href="/css/main.css">
<link rel="icon" href="/favicon.ico">
```

- [ ] **Step 3: 创建 nav.html**

```html
<nav class="site-nav">
  <a class="nav-brand" href="/">Tian Yihan</a>
  <ul class="nav-links">
    {{ range .Site.Menus.main }}
    <li><a href="{{ .URL }}">{{ .Name }}</a></li>
    {{ end }}
  </ul>
</nav>
```

- [ ] **Step 4: 创建 footer.html**

```html
<footer class="site-footer">
  <span class="footer-copy">© {{ now.Year }} 田一含</span>
  <div class="footer-links">
    {{ with .Site.Params.wechat }}<a href="#">公众号 · {{ . }}</a>{{ end }}
    {{ with .Site.Params.email }}<a href="mailto:{{ . }}">邮件</a>{{ end }}
  </div>
</footer>
```

- [ ] **Step 5: 创建 baseof.html**

```html
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode }}">
<head>
  {{ partial "head.html" . }}
</head>
<body>
  <div class="site-wrapper">
    {{ partial "nav.html" . }}
    <main>
      {{ block "main" . }}{{ end }}
    </main>
    {{ partial "footer.html" . }}
  </div>
</body>
</html>
```

- [ ] **Step 6: Commit**

```bash
cd /mnt/d/AIhouse/个人网站
git add layouts/
git commit -m "feat: add base layout partials and baseof template"
```

---

## Task 5: 首页模板 + 内容

**Files:**
- Create: `layouts/index.html`
- Create: `content/_index.md`

- [ ] **Step 1: 创建首页内容文件**

```markdown
---
title: "田一含"
dispatch:
  - tag: "思考"
    title: "关于财富自由，我目前的理解"
    when: "最新"
    url: "/articles/first-post/"
  - tag: "读书"
    title: "（文章即将更新）"
    when: "—"
    url: "#"
  - tag: "感悟"
    title: "（文章即将更新）"
    when: "—"
    url: "#"
---
```

- [ ] **Step 2: 创建首页模板 layouts/index.html**

```html
{{ define "main" }}

<!-- Hero -->
<section class="hero">
  <div class="hero-left">
    <h1 class="hero-headline">
      A lifelong<br>learner,<br><em>always</em><br>growing.
    </h1>
    <p class="hero-bio">
      金融学生，读书，思考，写作。<br>
      记录关于财富、成长与生活的感悟。
    </p>
    <div class="hero-meta">
      <span class="meta-key">School</span>
      <span class="meta-val">{{ .Site.Params.school }}</span>

      <span class="meta-key">Major</span>
      <span class="meta-val">{{ .Site.Params.major }}</span>

      <span class="meta-key">Location</span>
      <span class="meta-val">{{ .Site.Params.location }}</span>

      <span class="meta-key">公众号</span>
      <span class="meta-val">{{ .Site.Params.wechat }}</span>

      <span class="meta-key">Since</span>
      <span class="meta-val">{{ .Site.Params.since }}</span>
    </div>
  </div>

  <div class="hero-right">
    <div class="dispatch-label">
      <span class="active">近期更新</span>
      <span><a href="/articles/" style="color:inherit">全部文章</a></span>
    </div>
    <ul class="dispatch-list">
      {{ range .Params.dispatch }}
      <li class="dispatch-item">
        <span class="d-tag">{{ .tag }}</span>
        <a href="{{ .url }}" class="d-title">{{ .title }}</a>
        <span class="d-when">{{ .when }}</span>
      </li>
      {{ end }}
    </ul>
  </div>
</section>

<!-- § 文章 -->
<section class="section">
  <div class="section-header">§ 文章</div>
  {{ $articles := where .Site.RegularPages "Section" "articles" }}
  {{ if $articles }}
  <ul class="article-list">
    {{ range first 5 $articles }}
    <li class="article-item">
      <span class="a-date">{{ .Date.Format "2006-01-02" }}</span>
      <a href="{{ .Permalink }}" class="a-title">{{ .Title }}</a>
      <span class="a-arrow">→</span>
    </li>
    {{ end }}
  </ul>
  {{ else }}
  <p style="font-size:13px;color:#bbb;">文章即将更新 ...</p>
  {{ end }}
  <a href="/articles/" class="view-all">查看全部 →</a>
</section>

<!-- § 书单 -->
<section class="section">
  <div class="section-header">§ 书单</div>
  {{ $books := .Site.Data.books }}
  {{ if $books }}
  <div class="book-grid">
    {{ range first 6 $books }}
    <div class="book-card">
      <div class="book-status {{ if eq .status "在读" }}reading{{ end }}">{{ .status }}</div>
      <div class="book-title">{{ .title }}</div>
      <div class="book-author">{{ .author }}</div>
    </div>
    {{ end }}
  </div>
  {{ else }}
  <p style="font-size:13px;color:#bbb;">书单整理中 ...</p>
  {{ end }}
  <a href="/books/" class="view-all">查看完整书单 →</a>
</section>

{{ end }}
```

- [ ] **Step 3: Commit**

```bash
cd /mnt/d/AIhouse/个人网站
git add layouts/index.html content/_index.md
git commit -m "feat: add homepage layout and content"
```

---

## Task 6: 文章页模板 + 示例文章

**Files:**
- Create: `layouts/articles/list.html`
- Create: `layouts/_default/single.html`
- Create: `content/articles/_index.md`
- Create: `content/articles/first-post.md`

- [ ] **Step 1: 创建文章列表模板 layouts/articles/list.html**

```html
{{ define "main" }}
<div class="articles-page">
  <h1>文章</h1>
  {{ $articles := .Pages }}
  {{ if $articles }}
  <ul class="article-list">
    {{ range $articles }}
    <li class="article-item">
      <span class="a-date">{{ .Date.Format "2006-01-02" }}</span>
      <a href="{{ .Permalink }}" class="a-title">{{ .Title }}</a>
      <span class="a-arrow">→</span>
    </li>
    {{ end }}
  </ul>
  {{ else }}
  <p style="font-size:14px;color:#bbb;font-family:Georgia,serif;">文章即将更新...</p>
  {{ end }}
</div>
{{ end }}
```

- [ ] **Step 2: 创建文章详情模板 layouts/_default/single.html**

```html
{{ define "main" }}
<div class="article-single">
  <header class="article-header">
    <h1 class="article-title-main">{{ .Title }}</h1>
    <div class="article-meta">
      <span>{{ .Date.Format "2006年01月02日" }}</span>
      {{ with .Params.tags }}
      {{ range . }}<span>{{ . }}</span>{{ end }}
      {{ end }}
    </div>
  </header>

  <div class="article-body">
    {{ .Content }}
  </div>

  <nav class="article-nav">
    {{ with .PrevInSection }}
    <a href="{{ .Permalink }}">← {{ .Title }}</a>
    {{ else }}<span></span>{{ end }}
    {{ with .NextInSection }}
    <a href="{{ .Permalink }}">{{ .Title }} →</a>
    {{ end }}
  </nav>
</div>
{{ end }}
```

- [ ] **Step 3: 创建文章列表页内容文件 content/articles/_index.md**

```markdown
---
title: "文章"
---
```

- [ ] **Step 4: 创建示例文章 content/articles/first-post.md**

```markdown
---
title: "关于财富自由，我目前的理解"
date: 2026-05-18
tags: ["思考", "财富"]
draft: false
---

这是第一篇文章的占位内容，后续会替换为正式文字。

财富自由不是终点，是起点。

...
```

- [ ] **Step 5: Commit**

```bash
cd /mnt/d/AIhouse/个人网站
git add layouts/articles/ layouts/_default/single.html content/articles/
git commit -m "feat: add articles list and single page templates with sample post"
```

---

## Task 7: 书单页

**Files:**
- Create: `layouts/books/list.html`
- Create: `content/books/_index.md`
- Create: `data/books.json`

- [ ] **Step 1: 创建书单数据文件 data/books.json**

```bash
mkdir -p /mnt/d/AIhouse/个人网站/data
```

```json
[
  { "title": "穷查理宝典", "author": "Charles T. Munger", "status": "在读" },
  { "title": "财富自由之路", "author": "李笑来", "status": "已读" },
  { "title": "把时间当作朋友", "author": "李笑来", "status": "已读" },
  { "title": "穷爸爸富爸爸", "author": "Robert Kiyosaki", "status": "已读" },
  { "title": "原则", "author": "Ray Dalio", "status": "想读" },
  { "title": "思考，快与慢", "author": "Daniel Kahneman", "status": "想读" }
]
```

- [ ] **Step 2: 创建书单模板 layouts/books/list.html**

```html
{{ define "main" }}
<div class="books-page">
  <h1>书单</h1>

  {{ $statuses := slice "在读" "已读" "想读" }}
  {{ range $statuses }}
  {{ $status := . }}
  {{ $filtered := where $.Site.Data.books "status" $status }}
  {{ if $filtered }}
  <div class="section-header" style="margin-bottom:20px;">{{ $status }}</div>
  <div class="book-grid" style="margin-bottom:40px;">
    {{ range $filtered }}
    <div class="book-card">
      <div class="book-status {{ if eq .status "在读" }}reading{{ end }}">{{ .status }}</div>
      <div class="book-title">{{ .title }}</div>
      <div class="book-author">{{ .author }}</div>
    </div>
    {{ end }}
  </div>
  {{ end }}
  {{ end }}
</div>
{{ end }}
```

- [ ] **Step 3: 创建书单内容文件 content/books/_index.md**

```markdown
---
title: "书单"
---
```

- [ ] **Step 4: Commit**

```bash
cd /mnt/d/AIhouse/个人网站
git add data/books.json layouts/books/ content/books/
git commit -m "feat: add books page with data-driven book list"
```

---

## Task 8: 关于页 + 联系页

**Files:**
- Create: `layouts/about/single.html` (复用 page-single 样式)
- Create: `content/about.md`
- Create: `content/contact.md`

- [ ] **Step 1: 创建通用独立页面模板**

```bash
mkdir -p /mnt/d/AIhouse/个人网站/layouts/page
```

在 `layouts/_default/single.html` 末尾已覆盖所有 single 页，关于页和联系页直接使用，无需额外模板。

- [ ] **Step 2: 创建 content/about.md**

```markdown
---
title: "关于"
layout: "single"
---

<div class="page-single">
  <h1 class="page-headline">A lifelong<br>learner,<br><em>always</em><br>growing.</h1>

  <div class="page-meta">
    <span class="meta-key">School</span><span class="meta-val">中国人民大学</span>
    <span class="meta-key">Major</span><span class="meta-val">金融学</span>
    <span class="meta-key">Location</span><span class="meta-val">北京</span>
    <span class="meta-key">公众号</span><span class="meta-val">Elowen Tian</span>
    <span class="meta-key">Since</span><span class="meta-val">2026</span>
  </div>

  <div class="page-body">

金融学在读。读书，思考，写作。

记录关于财富、成长与生活的感悟。这里是我的公开笔记本。

  </div>
</div>
```

- [ ] **Step 3: 创建 content/contact.md**

```markdown
---
title: "联系"
layout: "single"
---

<div class="page-single">
  <h1 class="page-headline" style="font-size:28px;margin-bottom:32px;">联系</h1>
  <div class="page-body">

微信公众号：**Elowen Tian**

邮件：（待补充）

  </div>
</div>
```

- [ ] **Step 4: 修改 layouts/_default/single.html 以支持 HTML 原生内容渲染**

single.html 已在 Task 6 中设置 `unsafe = true`（config.toml），HTML 内容可直接渲染。

- [ ] **Step 5: Commit**

```bash
cd /mnt/d/AIhouse/个人网站
git add content/about.md content/contact.md
git commit -m "feat: add about and contact pages"
```

---

## Task 9: 本地预览验证

**Files:** 无新文件

- [ ] **Step 1: 本地启动 Hugo 服务**

```bash
cd /mnt/d/AIhouse/个人网站
hugo server -D --bind 0.0.0.0 --port 1313
```

在浏览器打开 http://localhost:1313 验证以下页面正常渲染：
- `/` — 首页（Hero + 文章列表 + 书单）
- `/articles/` — 文章列表
- `/articles/first-post/` — 文章详情
- `/books/` — 书单
- `/about/` — 关于
- `/contact/` — 联系

- [ ] **Step 2: 停止服务**

`Ctrl+C`

---

## Task 10: GitHub 仓库 + Actions 自动部署

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 在 GitHub 创建仓库**

```bash
cd /mnt/d/AIhouse/个人网站
gh repo create tyihan-website --public --description "tyihan.com personal website"
```

Expected: 返回仓库 URL，如 `https://github.com/<username>/tyihan-website`

- [ ] **Step 2: 关联远程仓库并推送**

```bash
cd /mnt/d/AIhouse/个人网站
git remote add origin https://github.com/<username>/tyihan-website.git
git branch -M main
git push -u origin main
```

（将 `<username>` 替换为实际 GitHub 用户名）

- [ ] **Step 3: 创建 GitHub Actions 工作流**

```bash
mkdir -p /mnt/d/AIhouse/个人网站/.github/workflows
```

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Hugo to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: '0.147.1'
          extended: true

      - name: Build
        run: hugo --minify

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: 在 GitHub 仓库设置中开启 Pages**

浏览器打开：`https://github.com/<username>/tyihan-website/settings/pages`

- Source 选择：**GitHub Actions**

- [ ] **Step 5: 推送 Actions 配置触发首次部署**

```bash
cd /mnt/d/AIhouse/个人网站
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions auto deploy workflow"
git push
```

- [ ] **Step 6: 验证部署成功**

```bash
gh run list --repo <username>/tyihan-website --limit 1
```

Expected: status 显示 `completed` / `success`

---

## Task 11: Cloudflare 绑定域名

**Files:** 无代码文件，DNS 配置操作

- [ ] **Step 1: 获取 GitHub Pages 地址**

部署成功后，GitHub Pages 地址格式为：`<username>.github.io/tyihan-website`

或在仓库 Settings → Pages 页面查看。

- [ ] **Step 2: 在 GitHub 仓库配置自定义域名**

浏览器打开 `https://github.com/<username>/tyihan-website/settings/pages`

- Custom domain 填入：`tianyihan.tyihan.com`
- 保存，等待 DNS check

- [ ] **Step 3: 在 Cloudflare 添加 DNS 记录**

打开 https://dash.cloudflare.com → tyihan.com → DNS → 添加记录：

| Type  | Name       | Content                    | Proxy |
|-------|------------|----------------------------|-------|
| CNAME | tianyihan  | `<username>.github.io`     | DNS only（灰云） |

**注意：** GitHub Pages 验证期间必须关闭 Cloudflare 代理（灰云），验证通过后可开启。这是子域名配置，只需添加一条 CNAME 记录，Name 填 `tianyihan`，Content 填你的 GitHub Pages 地址。

- [ ] **Step 4: 等待 DNS 生效并验证**

```bash
dig tyihan.com +short
```

Expected: 返回 GitHub Pages IP 地址（185.199.x.x）

- [ ] **Step 5: 在 GitHub Pages 勾选 Enforce HTTPS**

GitHub 仓库 Settings → Pages → 勾选 `Enforce HTTPS`

- [ ] **Step 6: 最终验证**

浏览器打开 https://tyihan.com，确认网站正常加载。

---

## 文章更新工作流（日常使用）

部署完成后，每次更新文章的流程：

```
1. 用户提供文章标题 + 正文内容（粘贴给 Claude）
2. Claude 在 content/articles/ 创建 YYYY-MM-DD-slug.md
3. Claude 执行：
   git add content/articles/<file>.md
   git commit -m "content: add article '<title>'"
   git push
4. GitHub Actions 自动构建，约 1 分钟后 tyihan.com 更新
```

---

## 自审检查

- [x] Hugo 安装 → Task 1
- [x] 项目结构 + config.toml → Task 2
- [x] CSS → Task 3
- [x] baseof + partials → Task 4
- [x] 首页 → Task 5
- [x] 文章列表 + 详情 + 示例文章 → Task 6
- [x] 书单（数据驱动） → Task 7
- [x] 关于 + 联系 → Task 8
- [x] 本地预览 → Task 9
- [x] GitHub + Actions → Task 10
- [x] Cloudflare 域名 → Task 11
- [x] 日常文章更新工作流说明 → 末尾

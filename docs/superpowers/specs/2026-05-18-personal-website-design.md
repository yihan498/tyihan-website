# tyihan.com 个人网站设计文档

**日期**: 2026-05-18  
**状态**: 已确认，进入实现阶段

---

## 1. 概览

为田一含（Tian Yihan）搭建个人网站，托管于 tyihan.com。网站同时承担两个功能：个人品牌展示（关于我）和持续内容输出（文章、书单）。

---

## 2. 技术方案

| 项目 | 选型 |
|------|------|
| 静态网站生成器 | Hugo |
| 托管平台 | GitHub Pages |
| 域名 | tyihan.com（已有） |
| DNS / CDN | Cloudflare（已有账户） |
| 部署方式 | git push → GitHub Actions 自动构建发布 |
| 文章更新工作流 | 用户提供内容 → Claude 创建 Markdown 文件 → git push |

---

## 3. 视觉风格

- **参考**: lixiaolai.com（极简作家风）
- **色调**: 白底、黑字、极少装饰
- **字体**: 正文用衬线（Georgia），界面标签用无衬线
- **布局**: 首页左右两栏 Hero（大标题左，近期更新右），下方单栏内容区

---

## 4. 页面结构

### 4.1 全局导航（顶部，所有页面共享）
```
Tian Yihan          文章  书单  关于  联系
```

### 4.2 首页 `/`

**Hero 区（左右两栏）**
- 左侧：英文大标题（如 "A lifelong learner, always growing."）+ 两行简介词组 + 元数据键值对
  - SCHOOL · 中国人民大学
  - MAJOR · 金融学
  - LOCATION · 北京
  - 公众号 · Elowen Tian
  - SINCE · 2026
- 右侧：近期更新列表（标签 + 标题 + 时间）

**§ 文章**（最新 5 篇，日期 + 标题 + 箭头）

**§ 书单**（卡片网格，在读/已读标签）

**页脚**：© 田一含 · 公众号 Elowen Tian · 邮件

### 4.3 文章列表页 `/articles/`
全部文章，按时间倒序，日期 + 标题 + 标签

### 4.4 文章详情页 `/articles/<slug>/`
标题、日期、正文（Markdown 渲染）、底部上/下篇导航

### 4.5 书单页 `/books/`
完整书单，在读/已读/想读，书名 + 作者（+ 可选：简短评注）

### 4.6 关于页 `/about/`
英文大标题 + 个人简介正文（词组风格，无叙述句）+ 元数据

### 4.7 联系页 `/contact/`
邮件地址 + 微信公众号（Elowen Tian）

---

## 5. 内容更新工作流

```
用户写好文章内容
        ↓
告知 Claude（粘贴内容或放入约定文件夹）
        ↓
Claude 创建 content/articles/YYYY-MM-DD-title.md
        ↓
Claude 执行 git add / commit / push
        ↓
GitHub Actions 自动构建 → 发布到 tyihan.com
```

文章 Markdown front matter 模板：
```yaml
---
title: "文章标题"
date: 2026-05-18
tags: ["思考", "财富"]
draft: false
---
```

---

## 6. Hugo 目录结构

```
tyihan.com/
├── config.toml          # 站点配置（标题、baseURL、导航）
├── content/
│   ├── articles/        # 文章 Markdown 文件
│   ├── books/           # 书单数据
│   └── about.md         # 关于页
├── layouts/             # 自定义模板（覆盖主题）
├── static/              # 静态资源（图片、favicon）
├── themes/              # Hugo 主题
└── .github/workflows/   # GitHub Actions 自动部署
```

---

## 7. 内容占位说明

以下内容待用户后续补充：
- 个人简介正文
- 真实文章
- 完整书单
- 头像/照片（可选）
- 邮件地址

---

## 8. 首英文标题建议

类似 lixiaolai.com 的 "A life-long learner, reborn with AI."，待定选项：
- "A lifelong learner, always growing."
- "Learning. Thinking. Writing."
- "Finance student. Reader. Thinker."

用户可在实现阶段最终确认。

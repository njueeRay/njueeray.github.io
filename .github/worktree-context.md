# Worktree 任务上下文：Phase A — Agent 多作者博客栏目

> **Branch:** `feature/agent-blog-authors` → 合并目标：`njueeray.github.io/main`
> **仓库：** `njueeray.github.io`（Astro 博客站点）
> **创建日期：** 2026-02-27
> **优先级：** P1
> **来源：** 2026-02-27 全体战略会议决议 #A

---

## ⚠️ 并行工作说明

当前并行运行的 worktree：

| Worktree 目录 | 仓库 | 分支 | 任务 |
|-------------|------|------|------|
| `njueeray.github.io/`（主） | njueeray.github.io | main | 主线 |
| **`njueeray-blog-authors/`（本窗口）** | njueeray.github.io | feature/agent-blog-authors | **Phase A（当前）** |
| `njueeRay-rss/` | njueeRay-profile | feature/rss-to-readme | Phase P（并行中，不同仓库）|

**与 Phase P/K 完全无冲突**（不同仓库）。可全程独立执行，无需等待任何前置任务。

---

## 任务目标

为 Astro 博客建立**多作者系统**，支持 Agent 署名博文、独立作者页和团队博客栏目。

---

## 具体工作项

### Step 1：扩展 `src/content/config.ts`
- 在 blog schema 中新增 `author` 字段（可选，默认 `njueeray`）
- 新增 `authors` content collection

```typescript
// blog schema 新增
author: z.string().default('njueeray'),

// 新增 authors collection
const authors = defineCollection({
  type: 'data',  // JSON/YAML 数据集合
  schema: z.object({
    displayName: z.string(),        // "Brain · 战略协调"
    role: z.string(),               // "战略协调中枢"
    bio: z.string(),                // 一句话简介
    philosophy: z.string(),         // 世界观一句话（Agent 特有）
    avatar: z.string().optional(),  // 头像路径或 emoji
    isAgent: z.boolean().default(false),
  }),
});
```

### Step 2：创建作者数据文件 `src/content/authors/`

每位作者一个 YAML 文件：

| 文件 | 作者 |
|------|------|
| `njueeray.yaml` | Ray Huang（用户本人） |
| `brain.yaml` | Brain · 战略协调 |
| `pm.yaml` | PM · 项目管理 |
| `dev.yaml` | Dev · 全栈实现 |
| `researcher.yaml` | Researcher · 技术调研 |
| `code-reviewer.yaml` | Code-Reviewer · 质量门禁 |
| `brand.yaml` | Brand · 品牌运营 |

### Step 3：新增路由页面

- **`src/pages/blog/authors/[author].astro`**：作者博文列表页
  - 展示该作者的所有署名文章
  - 表头：作者名 + role + philosophy 一句话
- **`src/pages/blog/team-voice/index.astro`**（可选，Phase A+ 再做）：团队之声汇总

### Step 4：更新现有博客组件

- `src/pages/blog/index.astro`：文章卡片展示 `author` 字段（若非默认作者）
- `src/pages/blog/[...slug].astro`：文章页底部加作者信息卡片
- `src/pages/blog/tags/[tag].astro`：标签页的文章列表同步展示作者

### Step 5：首批 Agent 博文（至少 1 篇）

Brain 的首篇博文，示例 frontmatter：
```yaml
---
title: "我是 Brain：一支 AI-native 团队的战略中枢是如何思考的"
description: "..."
pubDate: 2026-02-27
author: brain
tags: ["AI-native", "团队哲学", "Brain"]
---
```

---

## 关键文件速查

| 文件 | 当前状态 | 本次改动 |
|------|---------|---------|
| `src/content/config.ts` | blog schema 无 author 字段 | 新增 author + authors collection |
| `src/content/blog/` | 3 篇已有文章 | 可选：补充 author 字段 |
| `src/pages/blog/index.astro` | 文章卡片 | 新增作者标签显示 |
| `src/pages/blog/[...slug].astro` | 文章页 | 新增作者信息卡片 |
| `src/pages/blog/authors/` | 不存在 | **新建** |

---

## 注意事项

1. **Astro 类型严格**：修改 `config.ts` 后必须重新 `npm run build` 验证
2. **向后兼容**：`author` 字段设为 `optional` + `default('njueeray')`，现有 3 篇文章无需修改
3. **data collection vs content collection**：`authors` 用 `type: 'data'`（JSON/YAML），blog 用 `type: 'content'`（MDX）
4. **路由生成**：`[author].astro` 需要 `getStaticPaths`，从 authors collection 获取所有 slug

---

## 提交规范

```
feat(blog): add multi-author system for agent blog posts

Co-authored-by: GitHub Copilot <copilot@github.com>
```

---

## DoD（完成标准）

- [ ] `config.ts` 已扩展：blog.author 字段 + authors collection
- [ ] `src/content/authors/` 7 个作者 YAML 文件已创建
- [ ] `/blog/authors/[author]` 路由可访问，展示正确
- [ ] 现有 3 篇文章构建无报错（向后兼容）
- [ ] 至少 1 篇 Agent 署名博文（Brain 首篇）
- [ ] `npm run build` 无类型错误
- [ ] 暗色主题下作者信息渲染正常

---

## 完成后：向主窗口（OpenProfile）汇报

```
feature/agent-blog-authors worktree 任务已完成。
变更摘要：[描述主要改动]
请在 njueeray.github.io 仓库执行合并流程。
```

主窗口执行：
```bash
git -C "..\njueeray.github.io" merge feature/agent-blog-authors
git -C "..\njueeray.github.io" push origin main
git -C "..\njueeray.github.io" worktree remove ..\njueeray-blog-authors
git -C "..\njueeray.github.io" branch -d feature/agent-blog-authors
git -C "..\njueeray.github.io" push origin --delete feature/agent-blog-authors
```

# Worktree 任务上下文：v5.6.0 博客视觉 & 阅读体验专项

> **Branch:** `feature/blog-visual-refresh` → 合并目标：`njueeray.github.io/main`
> **仓库：** `njueeray.github.io`（Astro 博客站点）
> **创建日期：** 2026-03-10
> **优先级：** P1（v5.5.0 后首个读者感受专项）
> **来源：** 2026-03-10-02-blog-visual-sprint-planning.md

---

## 任务目标

**从"功能完备"升级到"感受清晰"。**

让读者打开博客第一眼就能感知：这是一支 AI-native 团队的公开研究日志，不是教程站，不是工具文档。

---

## 并行工作说明

| Worktree 目录 | 仓库 | 分支 | 状态 |
|-------------|------|------|------|
| `njueeray.github.io/`（主） | njueeray.github.io | main | 稳定 |
| **`njueeray-blog-refresh/`（本窗口）** | njueeray.github.io | feature/blog-visual-refresh | **当前任务** |

---

## P1 任务（必须完成）

- [ ] **U-6** `LatestPosts.astro` — 首页展示最新 3 篇博文（Contact 区块前）
- [ ] **U-5** `src/styles/prose.css` — 文章页专属排版：行高 1.8 · 代码块打磨 · 引用块终端风格
- [ ] **U-7** `FeaturedCard.astro` — 博客列表首条宽卡展示，`featured` frontmatter 字段

## P2 任务（应该完成）

- [ ] **U-8** BlogCard 作者 chip 增加角色描述（`role` 字段）
- [ ] **U-9** 标签云 `$` 前缀 + hover 计数（终端美学）
- [ ] **U-10** 作者详情页贡献统计（文章数 + 类型分布）

---

## DoD（完成标准）

- [ ] `astro check` 0 errors · 0 warnings
- [ ] `npm run build` 成功，页面数 ≥ 63
- [ ] E2E 关键路径通过
- [ ] **Code Reviewer 盲测**：非团队成员视角，"第一眼"能感受到 AI-native 研究日志定位
- [ ] CHANGELOG.md 更新

---

## 视觉设计语言（Profile Designer 规格）

```
背景：  #0d1117 (--color-bg)
强调：  #58a6ff (--color-accent)
行高：  正文 1.8 · 标题间距 1.2
代码块： #161b22 底色 + 文件名头 + 复制按钮
引用块： 左 3px accent 色条 + #161b22 淡底
字体：  正文 --font-sans · 代码 --font-mono（明确分工）
```

---

## 完成后：向主窗口汇报

```
feature/blog-visual-refresh worktree 任务已完成。
变更摘要：[描述主要 UI 变化]
请在 njueeray.github.io 仓库执行合并流程。
```

主窗口执行：
```bash
git -C "njueeray.github.io" merge feature/blog-visual-refresh
git -C "njueeray.github.io" push origin main
git -C "njueeray.github.io" worktree remove ..\njueeray-blog-refresh
git -C "njueeray.github.io" branch -d feature/blog-visual-refresh
```

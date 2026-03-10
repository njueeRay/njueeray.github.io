# Changelog

All notable changes to this project will be documented here.

Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — v5.10.0 首页品牌化重设计

### Added

- **H-1** `src/components/Hero.astro` — 双栏叙事重设计：左侧保留 terminal 动效，右侧新增 `narrative-col`（identity-badge / 中文标题"人类判断力 × AI 执行力" / 简介 / 最新博文卡片 / quick-stats）；容器扩展至 1100px，≥720px 启用 58%/1fr CSS Grid。
- **H-2** `src/components/Projects.astro` — GitHub API 动态数据：TypeScript 接口 + `fetchRepo()` + 实时 stars/forks/activeLabel（Active / `Nd ago`）；新增 `.card-header`（repo-icon + active-badge）、`.card-footer`（tags + repo-stats）布局。

### Changed

- **H-3** `src/components/FeaturedCard.astro` + `Projects.astro` — 视觉语言统一：将 4 处硬编码 `20px`/`4px`/`8px` 半径值替换为设计 token（`var(--radius-pill)` / `var(--radius-sm)` / `var(--radius-md)`）；移除 fallback 用法。

---

## [v5.6.0…v5.9.0 历史区块保留]

### Added

- **U-5** `src/styles/prose.css` — 文章页专属排版 CSS（行高 1.8、代码块 `#161b22` 底色、终端风格引用块 `❯` 提示符、复制按钮样式），并在 `[...slug].astro` 中引入替换原内联样式。
- **U-6** `src/components/LatestPosts.astro` — 首页"最新博文"区块，展示最新 3 篇非草稿博文，含类型徽章、作者 chip、标签；置于 `Projects` 与 `Contact` 之间。
- **U-7** `src/components/FeaturedCard.astro` — 博客列表首条宽卡组件，`featured: true` 博文以渐变顶边 + 大字标题 + 3 行摘要形式展示；`src/content/config.ts` 新增 `featured` 布尔字段（默认 `false`）；`blog/index.astro` 按 `featured && idx === 0` 条件切换渲染。

### Changed

- **U-8** `BlogCard.astro` — 作者 chip 增加 `role` 字段展示（mono 字体、accent 色、细分隔线）；`blog/index.astro` authorMap 类型同步更新。
- **U-9** `blog/tags/index.astro` — 标签云每项添加 `$` 前缀（终端美学）；hover 时 `tag-count` 高亮为 accent 色背景。
- **U-10** `blog/authors/[author].astro` — 作者详情页添加贡献统计面板：文章总数大数字 + 各 contentType 水平进度条分布图。

### Fixed

- `FeaturedCard` 作者 chip 改为 `<a>` 链接（指向作者详情页）并加 hover 样式。
- `LatestPosts` 标签链接移除废弃 `event.stopPropagation()` 内联 onclick。
- `[author].astro` Props 接口补充 `export` 关键字。

---

### DoD 验证

| 指标 | 结果 |
|------|------|
| `astro check` | ✅ 0 errors · 0 warnings · 0 hints |
| `npm run build` 页面数 | ✅ 65 页（≥ 63） |
| E2E 关键路径 | 待主窗口合并后执行 |

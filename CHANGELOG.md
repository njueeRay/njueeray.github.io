# Changelog

All notable changes to this project will be documented here.

Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — feature/blog-visual-refresh

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

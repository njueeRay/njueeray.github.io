# Changelog

All notable changes to this project will be documented here.

Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

---

## [6.6.0] — 2026-03-14

> **Agent Persona Deep Layer — 动态办公室 + 协作网络面板 🏢**
>
> 参考工程：`yedanyagamiai-cmd/pixel-office`（活动模型）、`hulryung/mohano`（CSS 设计系统）

### Added

- **`src/data/agent-activities.ts`** — Agent 活动数据层：7 个 Agent 各自的 desk / errand / dialogue 三类活动定义（含对话关系图），Canvas Home 坐标 + Errand 漫游坐标
- **`src/components/AgentOffice.tsx`** — Canvas React Island 动态办公室：7 个 Agent 终端 token 在办公室布局中平滑移动；活动轮转状态机（desk/errand/dialogue）；对话时虚线连接动画；点击跳转 `/agents/<id>` 详情；无 JS 降级为静态列表
- **`src/pages/agents/office.astro`** — `/agents/office` 新页面：Canvas Office 展示 + 状态图例 + 相关导航
- **`/agents/index.astro`** — Hero 区新增「⌨ 实时办公室」入口（cyan 色调差异化）
- **`/agents/[id].astro`** — 详情页新增协作网络面板（从 AGENT_ACTIVITIES 自动提取 dialogue 关系）+ 典型工作内容列表（desk/errand 采样前 4 条）+ 跳转 Office 页面链接

### Technical

- `@data/agent-activities` 路径别名复用现有 tsconfig 配置（零额外依赖）
- Canvas `roundRect` polyfill：优雅兼容不支持的旧浏览器
- 活动状态机：错开初始化时序（index × 700ms stagger）防止同步切换视觉问题

---

## [6.5.0] — 2026-03-14

> **Agent Knowledge Graph — 供应链审计 + 力导向协作图谱 ⬡**

### Added

- **G-2** `src/data/agent-graph-data.ts` — Agent 图谱数据结构：11 个节点（1 人类 + 7 Agent + 3 Pattern）+ 17 条协作边，含完整 TypeScript 类型定义（`GraphNode` / `GraphEdge` / `GraphData`）
- **G-3** `src/components/AgentKnowledgeGraph.tsx` — React Island 力导向图组件（懒加载 `react-force-graph`）：节点悬浮信息卡 + canvas 标签渲染 + 终端主题图例 + 优雅降级加载态
- **G-4** `src/pages/agents/graph.astro` — `/agents/graph` 静态页面：全互动力导向图（client:load）+ 无 JS 降级为静态协作关系表格（节点色标 + 边类型徽章）
- `/agents/index.astro` — Hero 链接新增「⬡ 协作图谱」入口

### Technical

- 安装 `@astrojs/react` + `react` + `react-dom` + `react-force-graph`（MIT）
- `astro.config.mjs` 注册 React 集成；`tsconfig.json` 新增 `jsx: react-jsx`
- `react-force-graph` 通过动态 `import()` 懒加载，不影响首屏性能

### Security

- **G-1** `npm audit fix`：修复 `svgo` 高危 DoS 漏洞（GHSA-xpqw-6gx7-v673）
- 剩余 5 个 moderate 均为 `@astrojs/check` 开发工具链传递依赖，非生产运行时风险，记录在 `docs/governance/asset-health-check.md`
- `react-force-graph@1.48.2` 许可证验证：MIT ✅

---

## [6.4.0] — 2026-03-14

> **Agent Persona Layer Phase 2 — Agent 详情页 + 活动时间线 🔍**

### Added

- **F-2** `src/pages/agents/[id].astro` — 7 个 Agent 独立详情页（SSG）：大符号 Profile Card（名称/角色/tagline/技能 pills/加入日期/文章数）+ Bio & Philosophy 双栏 + 文章时序时间线（含内容类型徽章/系列标记/摘要）
- **F-3** `OpenProfile/docs/brand/discussion-agent-personas-draft.md` — Brand Discussion #9 草稿：7 个 Agent 第一人称自述 + 「为什么给 AI Agent 赋予人格」讨论话题

### Technical

- Agent 详情页使用相同 `--agent-color` CSS 变量系统，与列表页保持风格统一
- 时间线组件（`timeline` + `timeline-dot`）含 glow 效果，与 GitTimeline 组件视觉语言一致
- JSON-LD `SoftwareApplication` schema 注入各 Agent 详情页

---

## [6.3.0] — 2026-03-11

> **Agent Persona Layer Phase 0 + 1 — AI 团队可视化身份系统 🤖**

### Added

- **E-1** `src/content/config.ts` authors schema 扩展：新增 `color`（主题色 hex）/ `symbol`（几何符号）/ `joined`（加入日期）/ `tagline`（一句话简介）/ `skills`（能力标签数组）五个可选字段
- **E-2** 7 个 Agent YAML 文件填充视觉身份数据：每个 Agent 获得独特主题色、几何符号、tagline 和 4 个技能标签
- **E-4** `src/pages/agents/index.astro` — `/agents` 静态列表页：7 张 Agent Card，含 symbol / name / role / tagline / skills pills / joined / 文章数 + 最近一篇链接；底部附 AI-Native 哲学区块
- **E-5** `src/components/Nav.astro` — 导航栏新增 `/agents` 入口（位于 blog 与 team 之间）

### Technical

- Agent Card 使用 CSS 变量 `--agent-color` 驱动 `color-mix()` 实现per-agent 主题色，无需重复定义样式规则
- 7 个 Agent 视觉方案独立记录于 `OpenProfile/docs/strategy/agent-visual-spec.md`

---

## [6.2.0] — 2026-03-11

> **OpenProfile 正式开源宣布 🎉**

### Added

- **D-1** `src/content/blog/open-source-announcement.mdx` — 开源公告博文「如何用 AI Agent 协作构建你的 GitHub Profile」：技术选型 + Agent 架构 + 核心工作流 + 踩坑复盘 + Fork 上手指引；系列「AI-Native 思考框架」第 5 篇

---

## [6.1.0] — 2026-03-11

> **读者入口 + 外循环机制正式化 📖**

### Added

- **C-1** `src/content/blog/2-min-guide-njueeray-github-io.mdx` — 读者入口文章「用 2 分钟了解这个项目」：AI-native 工作方式核心主张 + 团队架构 + 项目地图；`featured: true`，系列「AI-Native 思考框架」第 4 篇

### Changed

- **C-2** v6.x 新规正式化：每个 Minor 版本发布后 Brand 72h 内输出 Discussion 或博文摘要；PM 在下一版本提案时强制检查上一版本外循环是否完成

---

## [6.0.0] — 2026-03-11

> **博客内容生态完整落地 📝 — 里程碑确认**
>
> 确认 v5.8.0~v5.10.0 系列完成所有博客内容质量目标，正式进入 v6.x 阶段。本版本为 Sprint Board 协议确立后的第一个 Major Release，标志着团队协作模式从「AI-assisted」升级为「Board 驱动 Ship 循环（AI-native）」。

### Confirmed Milestone（v5.8.0~v5.10.0 期间完成）

- **B-1** `astro-expressive-code` — `github-dark-dimmed` 主题 + `borderRadius: 6px` + copy button accent 色，代码块一键复制 + 文件名标注
- **B-2** `src/components/Callout.astro` — 四类（tip/warning/info/note），终端风 icon + uppercase 标签 + 对应色系
- **B-3** `src/lib/readingTime.ts` — 中文 500 字/分钟 + 英文 200 词/分钟，剥离 frontmatter/代码块/HTML；BlogCard + 文章页 header 均显示
- **B-4** `src/components/SeriesNav.astro` — series + seriesOrder frontmatter + 系列内上/下篇导航；author-card 后、相关文章前
- **H-1** `src/components/Hero.astro` — 双栏叙事重设计：terminal 动效 + narrative-col（AI-native 核心主张可见化）
- **H-2** `src/components/Projects.astro` — GitHub API 动态数据：实时 stars/forks/activeLabel
- **H-3** 视觉语言统一：硬编码半径值替换为设计 token

### Changed

- 协作模式：Board 驱动 Ship 循环（Meeting #09，2026-03-11 确立）
- SessionStart hook 改为优先读取 Sprint Board 而非全文 copilot-instructions

---

## [5.10.0] — 2026-03-10

> **首页品牌化重设计 🏠 — AI-native 核心主张可见化**

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

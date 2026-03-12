# Changelog

All notable changes to this project will be documented here.

Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

---

## [7.4.0] — 2026-03-14

> **站内可发现性强化 — Nav + Footer + 跨页 CTA**

### Changed

- **`Nav.astro`** — 新增 `workflow` 导航项指向 `/how-we-work`（位于 team 之后，search 之前）；高亮当前路径
- **`Footer.astro`** — 重构为三列站内快链（Pages / AI-Native / Open Source）+ 原有版权行；新增分隔线
- **`/agents/index.astro`** — Hero 链接区新增「工作协议→ /how-we-work」黄色入口
- **`/team.astro`** — Footer CTA 区新增 workflow 横幅（黄色配色 + 终端命令提示风格）

---

## [7.3.0] — 2026-03-14

> **/how-we-work — AI-Native 工作流可视化指南**

### Added

- **`src/pages/how-we-work.astro`** *(新增)* — 独立页面，包含五个区块：
  - **三段式工作循环** — Recall / Execute / Ship 卡片式可视化，各带颜色编码与时间标注
  - **Agent 分工体系** — 7 个 Agent 权限边界卡片（链接至 `/agents/[id]`）+ 自主决策 vs 需告知规则
  - **Sprint Board 铁律** — 四宫格规则（≤50行 / ≤7条 / 2W存活期 / 唯一源）+ 结构示例代码
  - **会议 → 决策管道** — 四节点流程（会议→纪要→决策→Board）+ Decision Journal 哲学引言
  - **3 个可带走的习惯** — `diff` 风格对比（before/after）呈现行为级改变
- 全页面终端美学一致（JetBrains Mono 命令提示符 + 暗色主题 + 移动端响应式）

---

## [7.2.0] — 2026-03-14

> **L3 Knowledge Layer — 每个 Agent 的知识体系可视化**

### Added

- **`src/data/agent-knowledge.ts`** *(新增)* — 7 个 Agent 共 24 条知识条目，分 5 类（engineering / collaboration / judgment / tools / process），含日期、来源标注与辅助函数（`getKnowledgeByAgent`, `CATEGORY_LABELS`, `CATEGORY_COLORS`）

### Changed

- **`/agents/[id]`** — 新增「知识体系」区块（参会记录与文章时间线之间），双列网格按类别分组展示知识条目；移动端降为单列；CSS 变量自适应 Agent 主题色

---

## [7.1.0] — 2026-03-14

> **Pixel Avatar System — 7 个 Agent 专属像素头像**

### Added

- **`src/data/pixel-avatars.ts`** *(新增)* — 7 个 Agent 的 8×8 像素网格数据（0=透明/1=主色/2=强调色），附 `drawPixelAvatar(ctx, id, x, y, blockSize, color)` 纯函数
- **`src/components/PixelAvatarCanvas.tsx`** *(新增)* — React 组件，`useEffect` 驱动 Canvas DPR 感知绘制，支持任意 `size` props，`imageRendering: pixelated` 保留素朴感

### Changed

- **`/agents/[id]`** — profile header 的大号装饰符号替换为 `<PixelAvatarCanvas client:visible size={64} />`
- **`MemoryPanel.tsx`** — 标题栏 symbol emoji 替换为 `<PixelAvatarCanvas size={32} />`（独立组件，内联渲染）
- **`AgentOffice.tsx`** — Agent 窗口背景水印从 `drawAgentSymbol` 升级为 `drawPixelAvatar`（透明度 0.12，blockSize=4，32px）

---

## [7.0.0-pre] — 2026-03-14

> **技术债清场 — 组件拆分 + CI 质量门禁补全**

### Changed

- **`AgentOffice.tsx`** — 从 655 行单体组件拆分为协调层（327 行）；drawAgentSymbol 与 roundRect 提取至独立模块
- **`src/data/draw-symbols.ts`** *(新增)* — `drawAgentSymbol` + `roundRect` 纯函数，可独立测试
- **`src/components/MemoryPanel.tsx`** *(新增)* — 记忆面板独立 React 组件，含 `MemoryPanelAgent` 接口；彻底解耦 CI 循环依赖

### Added

- **`e2e/agents.spec.ts`** *(新增)* — `/agents/*` 页面 E2E 测试，含 canvas 可访问性断言与 office 页面视觉截图对比
- **`accessibility.yml`** — 新增 `axe-core` 扫描 `/agents` 与 `/agents/office` 页面
- **`e2e.yml`** — 构建前自动执行 `scripts/extract-agent-timeline.mjs` 生成最新时间轴数据

---

## [6.10.0] — 2026-03-14

> **Agent 记忆面板 — 点击查看 Core Memory + Recall Memory 🧠**

### Added

- **`AgentOffice.tsx`** — 新增 `MeetingEvent` 接口，`AgentInfo` 扩展 `bio / tagline / philosophy / meetings` 字段
- **`AgentOffice.tsx`** — 新增 `selectedAgent` React state：点击 Agent 终端窗口触发弹出记忆面板，不再直接跳转
- **`AgentOffice.tsx`** — 记忆面板（内嵌覆盖层，无第三方依赖）：
  - **Core Memory 区块**：Agent 的 tagline（角色 slogan）+ philosophy（核心信念），半透明背景
  - **Recall Memory 区块**：最近 5 条会议记录，含日期（MM-DD）、会议类型 badge（全体会议 / 规划会 / 复盘会等）、标题（>32 字截断）
  - **面板顶栏**：几何符号 + displayName + 关闭按钮（×）；顶边用 Agent 品牌色
  - **「查看详情 →」**：品牌色实色按钮，点击跳转 `/agents/<id>`
  - **点击背景遮罩**关闭面板（无障碍友好：dialog role + aria-modal）

### Changed

- **`office.astro`** — 引入 `AGENT_MEETINGS`，向 `AgentOffice` 传入新字段 `bio / tagline / philosophy / meetings`
- **`office.astro`** — 页面描述文案：「点击任意 Agent 查看详情页」→「点击任意 Agent 查看记忆面板」
- **`AgentOffice.tsx`** — canvas `aria-label` 更新为「查看记忆面板」语义

---

## [6.9.0] — 2026-03-14

> **Agent 几何身份 Canvas 升级 — 终端交通灯退场，几何人格登场 🔷**

### Changed

- **`AgentOffice.tsx`** — `BH` 由 58 → 68，终端窗口高度增加，给身份符号和状态指示器充足呼吸空间
- **`AgentOffice.tsx`** — 移除 macOS 风格交通灯（red/yellow/green 三点），改为每个 Agent 专属几何符号：
  - Brain ⬡ → 六边形环（代表神经网络节点与协调中枢）
  - PM ⏱ → 三节点流程线（代表时序调度与里程碑管理）
  - Dev ⚙ → 七齿齿轮 + 内圆（代表系统构建与精密运转）
  - Researcher ✦ → 四芒星 + 散点（代表探索发散与知识聚焦）
  - Code-Reviewer ◈ → 双层菱形（代表嵌套审查与质量守门）
  - Profile-Designer ✺ → 对数螺旋（代表美学迭代与视觉展开）
  - Brand ≋ → 双偏置正弦波（代表信息传播的双向共鸣）
- **`AgentOffice.tsx`** — 每个终端窗口背景新增低透明度（7%）大号水印符号，强化空间感与品牌辨识
- **`AgentOffice.tsx`** — 标题文本简化：去除 emoji 前缀，坐标左移至 `bx+26`，与小号几何符号（`r=6.5`）并排
- **`AgentOffice.tsx`** — 活动文本下移 2px（`TH+16`）、状态指示器下移 4px（`TH+34/37`），适配新高度

---

## [6.8.0] — 2026-03-14

> **Activity Timeline 自动提取 — 参会记录上线 📋**

### Added

- **`scripts/extract-agent-timeline.mjs`** — 新增 Node.js 数据提取脚本，自动解析 `OpenProfile/docs/meetings/` 下所有会议纪要，提取参会 Agent、日期、标题、会议类型，输出 `src/data/agent-meetings.ts`
- **`src/data/agent-meetings.ts`** — 自动生成的会议记录数据文件；首次提取覆盖 7 个 Agent，共 35 条会议文件，有效解析 11 条
- **`/agents/[id]`** — 新增「参会记录」区块（位于典型工作内容与文章时间线之间）：展示每个 Agent 最近 8 场参会，含日期、会议类型标签（全体会议/规划会/复盘会/专项研究/启动会等）、会议标题

---

## [6.7.0] — 2026-03-11

> **Graph 交互升级 + Agent Office 公告 🔗**

### Changed

- **`AgentKnowledgeGraph.tsx`** — 图谱节点可点击交互：点击 Agent 节点直接跳转到 `/agents/<id>` 详情页（`onNodeClick` handler）
- **`AgentKnowledgeGraph.tsx`** — 协作边增加有向粒子流动动画：`linkDirectionalParticles={2}`，速度 0.004，粒子宽度 2px，颜色随边类型变化（报告/委托/协作/审查/输入各自颜色）
- **`/agents/graph`** — hint 提示文字新增「点击 Agent 跳转详情页」说明

### Brand

- **Discussion #13** 发布：「🏢 AI Agent 团队现在有了一间可见的「办公室」——v6.6.0 Agent Office 上线」（[查看](https://github.com/njueeRay/njueeray.github.io/discussions/13)）

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

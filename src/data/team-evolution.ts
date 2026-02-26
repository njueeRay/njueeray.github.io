// Team Evolution Timeline — 数据驱动的团队成长记录
// 新增事件只需在 events 数组末尾追加对象，零模板改动

export type EventType = 'release' | 'team' | 'playbook' | 'feature' | 'milestone';

export interface Agent {
  emoji: string;
  name: string;
}

export interface TimelineEvent {
  date: string;
  type: EventType;
  title: string;
  description: string;
  version?: string;
  agents: Agent[];
  /** 如果设置，表示这是一个分支事件 */
  branch?: string;
  /** 相同 branchGroup 的事件视觉上属于同一分支组 */
  branchGroup?: number;
}

export const typeConfig: Record<EventType, { color: string; label: string; icon: string }> = {
  release:   { color: '#58a6ff', label: 'Release',   icon: '🏷️' },
  team:      { color: '#3fb950', label: 'Team',      icon: '👥' },
  playbook:  { color: '#e3b341', label: 'Playbook',  icon: '📖' },
  feature:   { color: '#f778ba', label: 'Feature',   icon: '✨' },
  milestone: { color: '#bc8cff', label: 'Milestone', icon: '🎯' },
};

// 团队成员快速引用
const A = {
  ray:      { emoji: '👨‍💻', name: 'Ray' },
  brain:    { emoji: '🧠', name: 'Brain' },
  pm:       { emoji: '📋', name: 'PM' },
  dev:      { emoji: '💻', name: 'Dev' },
  researcher: { emoji: '🔬', name: 'Researcher' },
  reviewer: { emoji: '🔍', name: 'Reviewer' },
  designer: { emoji: '🎨', name: 'Designer' },
  brand:    { emoji: '📢', name: 'Brand' },
} as const;

export const events: TimelineEvent[] = [
  {
    date: '2026-02-25',
    type: 'release',
    title: 'v1.0.0 · 项目诞生',
    description: '首版全组件上线 — Profile README + Astro 站点 + 开源规范一步到位',
    version: 'v1.0.0',
    agents: [A.ray, A.designer, A.dev, A.researcher, A.reviewer],
  },
  {
    date: '2026-02-25',
    type: 'team',
    title: 'Team V1.0 · 初始阵容',
    description: 'profile-designer · dev · researcher · code-reviewer 四角色就位，首个 AI-native 团队成型',
    agents: [A.designer, A.dev, A.researcher, A.reviewer],
  },
  {
    date: '2026-02-25',
    type: 'release',
    title: 'v2.0.0 · 叙事重构',
    description: 'Profile README 完整重写（双模 <picture> + 12 字段 JSON）+ Astro Blog + CI 流水线',
    version: 'v2.0.0',
    agents: [A.ray, A.brain, A.pm, A.dev],
  },
  {
    date: '2026-02-25',
    type: 'team',
    title: 'Team V2.0 · 核心升级',
    description: 'brain（战略中枢）+ pm（项目管理）加入 → 五角色体系成型 | content-writer → dev · qa-reviewer → code-reviewer',
    agents: [A.brain, A.pm],
  },
  {
    date: '2026-02-26',
    type: 'release',
    title: 'v3.0.0 · SEO + 标签 + 可移植化',
    description: 'Astro SEO 地基 + Blog 标签系统 + Profile Trophy/3D 贡献图 + Playbook 项目无关化重构',
    version: 'v3.0.0',
    agents: [A.dev, A.reviewer],
  },
  {
    date: '2026-02-26',
    type: 'playbook',
    title: 'Playbook v1.0 → v2.0',
    description: '三层版本体系独立化（L1 项目 / L2 Playbook / L3 Agent）+ 招募决策树 + Agent 快照卡',
    version: 'PB v2.0',
    agents: [A.brain, A.pm],
  },
  {
    date: '2026-02-26',
    type: 'release',
    title: 'v4.0.0 · AI-native 地基',
    description: '全站搜索 + 主题切换 + 阅读进度 + 目录 + Giscus 评论 + Playbook 独立版本体系',
    version: 'v4.0.0',
    agents: [A.brain, A.dev, A.pm],
  },
  {
    date: '2026-02-26',
    type: 'milestone',
    title: 'AI-native Person 范式峰会',
    description: '全员深度讨论 — 确立核心世界观：能力 = 人类判断力 × AI 执行力的共生体',
    agents: [A.brain, A.pm, A.dev, A.researcher, A.reviewer, A.designer],
  },
  {
    date: '2026-02-26',
    type: 'playbook',
    title: 'Playbook v2.1 · 哲学嵌入',
    description: '§0 哲学立场 + 八维度质量门 + 全 Agent AI-native 声明 — 世界观从博文落入工具层',
    version: 'PB v2.1',
    agents: [A.brain],
  },
  {
    date: '2026-02-27',
    type: 'team',
    title: 'Brand Agent 加入',
    description: '团队品牌运营 + Build in Public + 内容发布策略 → 第六位核心成员就位',
    agents: [A.brand],
  },
  {
    date: '2026-02-27',
    type: 'feature',
    title: 'L2 知识库落地',
    description: 'Agent 经验沉淀机制：5 份 patterns.md + README 索引 → 团队记忆持久化',
    agents: [A.brain, A.pm, A.dev, A.researcher, A.reviewer],
  },
  {
    date: '2026-02-27',
    type: 'feature',
    title: 'Phase P · RSS 同步',
    description: 'Blog 文章自动同步到 Profile README — blog-posts.yml GitHub Action',
    agents: [A.dev],
    branch: 'feature/rss-to-readme',
    branchGroup: 1,
  },
  {
    date: '2026-02-27',
    type: 'feature',
    title: 'Phase A · 多作者博客',
    description: '7 位作者 YAML + Brain 首篇博文 + /blog/authors/[agent] 路由 → Agent 拥有自己的声音',
    agents: [A.dev, A.brain, A.brand],
    branch: 'feature/agent-blog-authors',
    branchGroup: 1,
  },
  {
    date: '2026-02-27',
    type: 'feature',
    title: 'Phase K · 知识图谱',
    description: 'Team Knowledge Graph SVG 可视化 → Profile README 嵌入',
    agents: [A.dev],
    branch: 'feature/knowledge-graph',
    branchGroup: 2,
  },
  {
    date: '2026-02-27',
    type: 'milestone',
    title: '团队进化可视化',
    description: '在 GitHub.io 构建 Git Graph 风格团队成长时间线 — 你现在看到的就是这个决议的产物',
    agents: [A.brain, A.designer, A.dev, A.brand, A.pm],
  },
];

// Playbook 迭代档案
export interface PlaybookVersion {
  version: string;
  date: string;
  subtitle: string;
  highlights: string[];
}

export const playbookVersions: PlaybookVersion[] = [
  {
    version: 'v2.1',
    date: '2026-02-26',
    subtitle: 'AI-native 哲学体系嵌入',
    highlights: [
      '§0 哲学立场章节（全新）— AI-native 团队本质 · 角色哲学定位',
      '§6 七维度升级为八维度 — 新增 AI-native 健康度审查',
      '6 个 Agent 文件全部新增 AI-native 工作哲学声明',
      'Release 编码规范修复（UTF-8 字节发送）',
    ],
  },
  {
    version: 'v2.0',
    date: '2026-02-26',
    subtitle: '三层版本体系独立化',
    highlights: [
      '§18 版本体系规范（L1 项目 / L2 Playbook / L3 Agent）',
      '§13 招募决策树：任务缺口 → 矩阵 → 识别 → 优先级',
      '附录 C Agent 能力快照卡格式规范',
      'PLAYBOOK-CHANGELOG.md 独立变更记录文件',
    ],
  },
  {
    version: 'v1.0',
    date: '2026-02-26',
    subtitle: '核心方法论基础（追溯标记）',
    highlights: [
      '§1-§11 核心章节：团队拓扑 / 任务流程 / Commit 规范 / Code Review / CI',
      '§12 新团队接手协议 — 四阶段冷启动',
      '§13-§17 进化机制 / 经验沉淀 / GitHub API / 品牌化 / 定制指南',
      '项目无关化重构完成 — Playbook 可随团队带入任意新项目',
    ],
  },
];

// 团队成员（用于页面底部展示）
export interface TeamMember {
  id: string;
  emoji: string;
  displayName: string;
  role: string;
  isAgent: boolean;
}

export const teamMembers: TeamMember[] = [
  { id: 'njueeray', emoji: '👨‍💻', displayName: 'Ray Huang', role: '创始人 · 全栈工程师', isAgent: false },
  { id: 'brain',    emoji: '🧠', displayName: 'Brain',      role: '战略协调中枢',       isAgent: true },
  { id: 'pm',       emoji: '📋', displayName: 'PM',         role: 'Sprint 规划与版本发布', isAgent: true },
  { id: 'dev',      emoji: '💻', displayName: 'Dev',        role: '全栈实现',           isAgent: true },
  { id: 'researcher', emoji: '🔬', displayName: 'Researcher', role: '技术调研',          isAgent: true },
  { id: 'code-reviewer', emoji: '🔍', displayName: 'Code Reviewer', role: '质量门禁',   isAgent: true },
  { id: 'brand',    emoji: '📢', displayName: 'Brand',      role: '品牌运营',           isAgent: true },
];

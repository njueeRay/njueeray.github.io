/**
 * agent-knowledge.ts — Agent L3 知识层数据
 *
 * 记录每个 Agent 在实际工作中积累的核心知识条目。
 * 分类：engineering / collaboration / judgment / tools / process
 *
 * 数据来源：Agent Playbook、会议决议、design-decisions.md
 * 维护：scripts/extract-agent-knowledge.mjs（可增量刷新）
 */

export type KnowledgeCategory =
  | 'engineering'
  | 'collaboration'
  | 'judgment'
  | 'tools'
  | 'process';

export interface KnowledgeEntry {
  id: string;
  agentId: string;
  category: KnowledgeCategory;
  /** 知识获取时间 YYYY-MM */
  date: string;
  title: string;
  /** 一到两句话说明 */
  content: string;
  /** 来源标注（可选） */
  source?: string;
}

export const AGENT_KNOWLEDGE: KnowledgeEntry[] = [
  // ── Brain ──────────────────────────────────────────────────────
  {
    id: 'brain-001',
    agentId: 'brain',
    category: 'process',
    date: '2026-02',
    title: '三段式会话协议',
    content: 'Recall → Execute → Ship。每次会话只做一件事，做完再 Ship，不积压任务。',
    source: 'Meeting #09 战略复盘',
  },
  {
    id: 'brain-002',
    agentId: 'brain',
    category: 'judgment',
    date: '2026-03',
    title: 'AI-native 健康指标',
    content: '衡量 AI-native 成熟度的唯一指标是判断力增长——即精准否决次数，而非产出量。',
    source: 'Meeting #10 Retrospective',
  },
  {
    id: 'brain-003',
    agentId: 'brain',
    category: 'collaboration',
    date: '2026-03',
    title: 'Sprint Board 铁律',
    content: 'Sprint Board ≤50 行 / ≤7 条 / 2 周存活期。超限即强制 triage，不允许无限膨胀。',
    source: 'governance/sprint-board.md',
  },
  {
    id: 'brain-004',
    agentId: 'brain',
    category: 'judgment',
    date: '2026-02',
    title: 'Agent 技术路径优先决定权',
    content: 'Agent 团队对技术路径拥有优先决定权，用户保留最终否决权。区分技术决策与价值取向。',
    source: 'copilot-instructions.md §Agent 权限',
  },

  // ── PM ─────────────────────────────────────────────────────────
  {
    id: 'pm-001',
    agentId: 'pm',
    category: 'process',
    date: '2026-02',
    title: 'DoD Checklist',
    content: '迭代完成需通过 6 项检查：CHANGELOG / 设计决策 / 组件文档 / Sprint Board / 会议存档 / Commit 规范。',
    source: 'copilot-instructions.md §DoD',
  },
  {
    id: 'pm-002',
    agentId: 'pm',
    category: 'tools',
    date: '2026-02',
    title: '语义化 Commit 规范',
    content: 'feat/fix/docs/style/chore 前缀，所有协作提交末尾附 Co-authored-by: GitHub Copilot。',
    source: '强制规范 §8',
  },
  {
    id: 'pm-003',
    agentId: 'pm',
    category: 'collaboration',
    date: '2026-03',
    title: 'Board 驱动 Ship 循环',
    content: 'Sprint Board 是唯一活跃状态源。每次提交后立即更新 Board，不允许状态滞后。',
    source: 'Meeting #09',
  },

  // ── Dev ────────────────────────────────────────────────────────
  {
    id: 'dev-001',
    agentId: 'dev',
    category: 'engineering',
    date: '2026-03',
    title: 'Astro 5 Content Layer',
    content: '使用 glob() loader 替代 legacy type:content。post.slug → post.id，render() 改为独立函数。',
    source: 'design-decisions.md V5.0',
  },
  {
    id: 'dev-002',
    agentId: 'dev',
    category: 'engineering',
    date: '2026-03',
    title: 'CSS 架构原则',
    content: 'global.css 作为设计 Token 唯一真实来源。组件局部样式保留在各 .astro <style> 块，不上移。',
    source: 'design-decisions.md V5.x',
  },
  {
    id: 'dev-003',
    agentId: 'dev',
    category: 'engineering',
    date: '2026-03',
    title: 'React Island 最小化原则',
    content: '仅交互式组件使用 client:load/visible。图谱是唯一需要运行时 DOM 的组件，其余全 SSG。',
    source: 'design-decisions.md v6.5.0',
  },
  {
    id: 'dev-004',
    agentId: 'dev',
    category: 'tools',
    date: '2026-03',
    title: 'Astro script is:inline 规范',
    content: '含属性的 <script> 块必须显式加 is:inline，否则 Astro 5 会尝试模块化处理导致运行时错误。',
    source: 'design-decisions.md Astro 5.0',
  },

  // ── Researcher ─────────────────────────────────────────────────
  {
    id: 'researcher-001',
    agentId: 'researcher',
    category: 'collaboration',
    date: '2026-02',
    title: '只读输出原则',
    content: 'Researcher 只读权限，输出浓缩结论。不直接修改文件——结论传递给 dev 或 brain 执行。',
    source: 'Agent 团队分工表',
  },
  {
    id: 'researcher-002',
    agentId: 'researcher',
    category: 'judgment',
    date: '2026-02',
    title: '废弃方案归档',
    content: '曾考虑但放弃的技术方案必须记录在 design-decisions.md「已废弃的方案」，避免未来重复讨论。',
    source: 'design-decisions.md §废弃',
  },
  {
    id: 'researcher-003',
    agentId: 'researcher',
    category: 'engineering',
    date: '2026-03',
    title: 'MDX 版本兼容矩阵',
    content: 'Astro 4.x 兼容 @astrojs/mdx@3；Astro 5.x 需 mdx@4。跨大版本升级时必须同步验证 MDX。',
    source: 'design-decisions.md V2.0',
  },

  // ── Code Reviewer ──────────────────────────────────────────────
  {
    id: 'reviewer-001',
    agentId: 'code-reviewer',
    category: 'judgment',
    date: '2026-02',
    title: '七维度审查框架',
    content: '安全 / WCAG 可访问性 / 性能预算 / 可维护性 / 测试覆盖 / 文档完整性 / 架构合理性。',
    source: 'code-reviewer.agent.md',
  },
  {
    id: 'reviewer-002',
    agentId: 'code-reviewer',
    category: 'process',
    date: '2026-03',
    title: '停止强制出完整报告',
    content: 'Ship 环节做轻量级检查即可。只有 Major 版本必须出完整结构化审查报告，释放执行带宽。',
    source: 'Meeting #09 协作模式决策',
  },
  {
    id: 'reviewer-003',
    agentId: 'code-reviewer',
    category: 'engineering',
    date: '2026-03',
    title: 'Lighthouse CI 阈值',
    content: 'a11y ≥ 0.90 / seo ≥ 0.90（error 阻断）/ perf ≥ 0.85 / bp ≥ 0.90（warn）。',
    source: 'design-decisions.md v5.x',
  },

  // ── Profile Designer ───────────────────────────────────────────
  {
    id: 'designer-001',
    agentId: 'profile-designer',
    category: 'engineering',
    date: '2026-02',
    title: '暗色优先 + 品牌色原则',
    content: 'GitHub Dark (#0d1117) 为基础，#58a6ff 蓝色为主强调色。浅色模式使用蓝白渐变兼容方案。',
    source: 'design-decisions.md §视觉风格',
  },
  {
    id: 'designer-002',
    agentId: 'profile-designer',
    category: 'judgment',
    date: '2026-02',
    title: '动效克制原则',
    content: '最多3类动效组件：Typing SVG + capsule-render twinkling + 贡献蛇。避免过度动效分散注意力。',
    source: 'design-decisions.md §动效密度',
  },
  {
    id: 'designer-003',
    agentId: 'profile-designer',
    category: 'tools',
    date: '2026-03',
    title: 'OG 封面图方案',
    content: 'satori + @resvg/resvg-js + @fontsource/jetbrains-mono，构建时静态生成 1200×630 暗色终端风 PNG。',
    source: 'design-decisions.md v5.3.0',
  },

  // ── Brand ──────────────────────────────────────────────────────
  {
    id: 'brand-001',
    agentId: 'brand',
    category: 'collaboration',
    date: '2026-03',
    title: 'Build in Public 节奏',
    content: '任意 Discussion 发布后 72h 内 Brand 必须发跟进评论（听到什么 / 调整什么 / 怎么验证）。',
    source: 'docs/brand/discussion-72h-followup-template.md',
  },
  {
    id: 'brand-002',
    agentId: 'brand',
    category: 'judgment',
    date: '2026-03',
    title: 'Brand 平等优先权',
    content: '对外是平级任务——Brand 直接向 Sprint Board 贡献事项，与技术任务平等竞争优先级。',
    source: 'Meeting #09 V6.x 协作模式决策',
  },
  {
    id: 'brand-003',
    agentId: 'brand',
    category: 'tools',
    date: '2026-02',
    title: '开源规范四件套',
    content: 'CONTRIBUTING.md + CHANGELOG (Keep a Changelog) + LICENSE (MIT) + README.md 必须同步完备。',
    source: '强制规范 §开源',
  },
];

/** 按 agentId 分组 */
export function getKnowledgeByAgent(agentId: string): KnowledgeEntry[] {
  return AGENT_KNOWLEDGE.filter(k => k.agentId === agentId);
}

/** 类别标签映射 */
export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  engineering:   '工程实现',
  collaboration: '协作模式',
  judgment:      '判断力',
  tools:         '工具规范',
  process:       '流程机制',
};

/** 类别颜色映射 */
export const CATEGORY_COLORS: Record<KnowledgeCategory, string> = {
  engineering:   '#3fb950',
  collaboration: '#58a6ff',
  judgment:      '#e3b341',
  tools:         '#bc8cff',
  process:       '#f78166',
};

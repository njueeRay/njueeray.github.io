// Agent Knowledge Graph 数据结构
// 节点 = Agent + Ray（人类）+ 关键 Pattern
// 边 = 协作关系（类型：报告/委托/协作/审查/输入）

export type NodeType = 'human' | 'agent' | 'pattern';
export type EdgeType = 'reports_to' | 'delegates_to' | 'collaborates' | 'reviews' | 'feeds_into';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  color: string;
  symbol?: string;
  role?: string;
  size: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: EdgeType;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphEdge[];
}

export const agentGraphData: GraphData = {
  nodes: [
    // 人类节点
    {
      id: 'ray',
      label: 'Ray',
      type: 'human',
      color: '#f0883e',
      symbol: '👨‍💻',
      role: '人类决策者',
      size: 20,
    },
    // Agent 节点
    {
      id: 'brain',
      label: 'Brain',
      type: 'agent',
      color: '#3B5BDB',
      symbol: '⬡',
      role: '战略协调中枢',
      size: 16,
    },
    {
      id: 'pm',
      label: 'PM',
      type: 'agent',
      color: '#2F9E44',
      symbol: '⏱',
      role: '执行节奏引擎',
      size: 14,
    },
    {
      id: 'dev',
      label: 'Dev',
      type: 'agent',
      color: '#7048E8',
      symbol: '⚙',
      role: '全栈实现引擎',
      size: 14,
    },
    {
      id: 'researcher',
      label: 'Researcher',
      type: 'agent',
      color: '#1098AD',
      symbol: '✦',
      role: '技术调研中枢',
      size: 12,
    },
    {
      id: 'code-reviewer',
      label: 'Reviewer',
      type: 'agent',
      color: '#C92A2A',
      symbol: '◈',
      role: '质量门禁',
      size: 12,
    },
    {
      id: 'profile-designer',
      label: 'Designer',
      type: 'agent',
      color: '#E67700',
      symbol: '✺',
      role: '视觉规划专家',
      size: 12,
    },
    {
      id: 'brand',
      label: 'Brand',
      type: 'agent',
      color: '#862E9C',
      symbol: '≋',
      role: '品牌运营',
      size: 12,
    },
    // Pattern 节点（关键工作流）
    {
      id: 'sprint-board',
      label: 'Sprint Board',
      type: 'pattern',
      color: '#495057',
      size: 8,
    },
    {
      id: 'decision-log',
      label: 'Decision Log',
      type: 'pattern',
      color: '#495057',
      size: 8,
    },
    {
      id: 'build-in-public',
      label: 'Build in Public',
      type: 'pattern',
      color: '#495057',
      size: 8,
    },
  ],
  links: [
    // Ray ↔ Brain（双向）
    { source: 'ray', target: 'brain', type: 'delegates_to', label: '意图输入' },
    { source: 'brain', target: 'ray', type: 'reports_to', label: '决策汇报' },

    // Brain → 各 Agent
    { source: 'brain', target: 'pm', type: 'delegates_to', label: '任务分配' },
    { source: 'brain', target: 'dev', type: 'delegates_to', label: '技术指令' },
    { source: 'brain', target: 'researcher', type: 'delegates_to', label: '调研委托' },
    { source: 'brain', target: 'profile-designer', type: 'delegates_to', label: '视觉委托' },
    { source: 'brain', target: 'brand', type: 'delegates_to', label: '发布指令' },

    // PM ↔ Dev
    { source: 'pm', target: 'dev', type: 'delegates_to', label: 'Sprint 任务' },
    { source: 'dev', target: 'pm', type: 'reports_to', label: '完成报告' },

    // Researcher → Dev
    { source: 'researcher', target: 'dev', type: 'feeds_into', label: '技术选型建议' },

    // Code Reviewer ↔ Dev
    { source: 'dev', target: 'code-reviewer', type: 'reviews', label: '提交审查' },
    { source: 'code-reviewer', target: 'dev', type: 'feeds_into', label: '审查反馈' },

    // Profile Designer → Dev
    { source: 'profile-designer', target: 'dev', type: 'feeds_into', label: '视觉规范' },

    // Dev / PM → Sprint Board
    { source: 'pm', target: 'sprint-board', type: 'feeds_into', label: '维护' },

    // Brain → Decision Log
    { source: 'brain', target: 'decision-log', type: 'feeds_into', label: '记录决策' },
    { source: 'ray', target: 'decision-log', type: 'feeds_into', label: '判断力记录' },

    // Brand → Build in Public
    { source: 'brand', target: 'build-in-public', type: 'feeds_into', label: '发布内容' },

    // Sprint Board → PM
    { source: 'sprint-board', target: 'pm', type: 'feeds_into', label: '驱动执行' },
  ],
};

// 节点类型颜色映射（用于图例）
export const nodeTypeConfig: Record<NodeType, { label: string; color: string }> = {
  human:   { label: '人类', color: '#f0883e' },
  agent:   { label: 'AI Agent', color: '#58a6ff' },
  pattern: { label: '工作流 Pattern', color: '#495057' },
};

// 边类型颜色映射
export const edgeTypeConfig: Record<EdgeType, { label: string; color: string }> = {
  reports_to:   { label: '汇报', color: '#58a6ff' },
  delegates_to: { label: '委托', color: '#3fb950' },
  collaborates: { label: '协作', color: '#e3b341' },
  reviews:      { label: '审查', color: '#f85149' },
  feeds_into:   { label: '输入', color: '#bc8cff' },
};

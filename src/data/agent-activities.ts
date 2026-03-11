/**
 * agent-activities.ts
 * Agent 办公室模拟的活动数据层
 * 灵感来源：yedanyagamiai-cmd/pixel-office（MIT）
 * 适配版本：静态 SSG + React Island Canvas 动画
 */

export interface AgentActivity {
  /** 当前状态文本（用于 speech bubble / terminal 行） */
  status: string;
  /** desk = 在工位打字；errand = 外出游走；dialogue = 与其他 Agent 对话 */
  type: 'desk' | 'errand' | 'dialogue';
  /** 持续时间范围 [min, max] ms */
  duration: [number, number];
  /** 对话对象 agent id（dialogue 类型专用） */
  meetWith?: string;
}

/** 每个 Agent 的活动列表 */
export const AGENT_ACTIVITIES: Record<string, AgentActivity[]> = {
  brain: [
    { status: '规划本周 Sprint 路径', type: 'desk', duration: [7000, 12000] },
    { status: '分析团队 KPI 指标', type: 'desk', duration: [5000, 10000] },
    { status: '梳理项目全局视野', type: 'desk', duration: [8000, 13000] },
    { status: '审阅 PM 的规划文稿', type: 'errand', duration: [5000, 9000] },
    { status: '沿走廊巡视 👁', type: 'errand', duration: [4000, 7000] },
    { status: '→ PM：Sprint 优先级确认', type: 'dialogue', duration: [4000, 7000], meetWith: 'pm' },
    { status: '→ Dev：架构方向对齐', type: 'dialogue', duration: [4000, 7000], meetWith: 'dev' },
    { status: '→ Researcher：新趋势简报', type: 'dialogue', duration: [4000, 6000], meetWith: 'researcher' },
  ],
  pm: [
    { status: '更新 Sprint Board', type: 'desk', duration: [6000, 11000] },
    { status: '编写 DoD Checklist', type: 'desk', duration: [7000, 12000] },
    { status: '整理版本变更日志', type: 'desk', duration: [6000, 11000] },
    { status: '检查任务堆积情况', type: 'errand', duration: [4000, 8000] },
    { status: '复盘归档历史纪要', type: 'errand', duration: [5000, 9000] },
    { status: '→ Brain：进度汇报', type: 'dialogue', duration: [3000, 6000], meetWith: 'brain' },
    { status: '→ Dev：排期协商', type: 'dialogue', duration: [3000, 6000], meetWith: 'dev' },
  ],
  dev: [
    { status: '实现新组件逻辑', type: 'desk', duration: [8000, 15000] },
    { status: '修复 TypeScript 错误', type: 'desk', duration: [5000, 10000] },
    { status: '优化构建性能', type: 'desk', duration: [6000, 11000] },
    { status: '调试 Astro 渲染问题', type: 'desk', duration: [5000, 10000] },
    { status: '部署到 GitHub Pages 📦', type: 'errand', duration: [5000, 9000] },
    { status: '→ Code Reviewer：PR 提交', type: 'dialogue', duration: [4000, 7000], meetWith: 'code-reviewer' },
    { status: '→ Profile Designer：实现确认', type: 'dialogue', duration: [3000, 6000], meetWith: 'profile-designer' },
  ],
  researcher: [
    { status: '扫描最新 AI 工具生态', type: 'desk', duration: [7000, 14000] },
    { status: '撰写技术调研报告', type: 'desk', duration: [8000, 15000] },
    { status: '对比竞品项目架构', type: 'desk', duration: [6000, 12000] },
    { status: '翻阅 GitHub 趋势', type: 'errand', duration: [5000, 9000] },
    { status: '整理 docs/research 归档', type: 'errand', duration: [4000, 8000] },
    { status: '→ Brain：调研结论输出', type: 'dialogue', duration: [4000, 7000], meetWith: 'brain' },
    { status: '→ Dev：技术方案建议', type: 'dialogue', duration: [3000, 6000], meetWith: 'dev' },
  ],
  'code-reviewer': [
    { status: '扫描安全漏洞 (OWASP)', type: 'desk', duration: [7000, 14000] },
    { status: '输出结构化评审报告', type: 'desk', duration: [6000, 12000] },
    { status: '验证测试覆盖率 ✓', type: 'desk', duration: [5000, 10000] },
    { status: '审查 Accessibility 问题', type: 'desk', duration: [5000, 11000] },
    { status: '标注待改进代码段', type: 'errand', duration: [5000, 8000] },
    { status: '→ Dev：问题清单反馈', type: 'dialogue', duration: [4000, 7000], meetWith: 'dev' },
  ],
  'profile-designer': [
    { status: '设计视觉规格文档', type: 'desk', duration: [7000, 13000] },
    { status: '确定色彩排版方案', type: 'desk', duration: [6000, 11000] },
    { status: '绘制 SVG 几何符号 🎨', type: 'desk', duration: [8000, 14000] },
    { status: '审阅品牌一致性', type: 'errand', duration: [5000, 9000] },
    { status: '→ Dev：视觉细节交付', type: 'dialogue', duration: [3000, 6000], meetWith: 'dev' },
    { status: '→ Brand：风格对齐确认', type: 'dialogue', duration: [3000, 5000], meetWith: 'brand' },
  ],
  brand: [
    { status: '撰写对外传播文案', type: 'desk', duration: [6000, 12000] },
    { status: '准备 Discussion 草稿', type: 'desk', duration: [7000, 13000] },
    { status: '分析受众触达策略', type: 'desk', duration: [5000, 10000] },
    { status: '整理内容矩阵', type: 'errand', duration: [5000, 9000] },
    { status: '发布 GitHub Discussion 📢', type: 'errand', duration: [4000, 8000] },
    { status: '→ Brain：传播策略评审', type: 'dialogue', duration: [4000, 7000], meetWith: 'brain' },
    { status: '→ Profile Designer：素材需求', type: 'dialogue', duration: [3000, 5000], meetWith: 'profile-designer' },
  ],
};

/**
 * Agent 在 700×560 Canvas 上的「工位」中心坐标
 * 布局：左列（brain/dev/code-reviewer） + 右列（pm/researcher/profile-designer） + 底部中央（brand）
 */
export const AGENT_HOME_POSITIONS: Record<string, [number, number]> = {
  brain:              [115,  98],
  pm:                 [455,  98],
  dev:                [115, 238],
  researcher:         [455, 238],
  'code-reviewer':    [115, 378],
  'profile-designer': [455, 378],
  brand:              [285, 490],
};

/**
 * Errand 时的游走目标坐标（走向走廊/公共区域）
 */
export const ERRAND_POSITIONS: Record<string, [number, number]> = {
  brain:              [285,  80],
  pm:                 [285, 155],
  dev:                [200, 260],
  researcher:         [370, 260],
  'code-reviewer':    [200, 400],
  'profile-designer': [370, 400],
  brand:              [285, 440],
};

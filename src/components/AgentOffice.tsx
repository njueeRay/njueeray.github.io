/**
 * AgentOffice.tsx — Agent 团队可视化办公室
 * Astro React Island (client:load)
 *
 * 方案参考：
 *   - yedanyagamiai-cmd/pixel-office（活动模型、Canvas 精灵思路）
 *   - hulryung/mohano（CSS 设计系统、状态色彩体系）
 *
 * 实现策略：
 *   - 每个 Agent = 终端风格 "窗口" token（无需外部 sprite 资源）
 *   - 活动状态驱动：desk / errand / dialogue 三类
 *   - requestAnimationFrame 动画循环：平滑位置插值 + glow 脉冲
 *   - 点击 Agent token → 跳转 /agents/<id>
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import {
  AGENT_ACTIVITIES,
  AGENT_HOME_POSITIONS,
  ERRAND_POSITIONS,
} from '../data/agent-activities';
import type { AgentActivity } from '../data/agent-activities';
import { drawAgentSymbol, roundRect } from '../data/draw-symbols';
import MemoryPanel from './MemoryPanel';

// ── Canvas 尺寸 ───────────────────────────────────────────────────
const CW = 700; // canvas width
const CH = 560; // canvas height
const BW = 128; // agent box width
const BH = 68;  // agent box height

// ── 办公室区域（背景装饰） ─────────────────────────────────────────
const ZONES = [
  { x: 18,  y: 18,  w: 218, h: 162, label: '战略总部',  rgb: '59,91,219'   },
  { x: 348, y: 18,  w: 218, h: 162, label: '项目管理',  rgb: '47,158,68'   },
  { x: 18,  y: 158, w: 218, h: 162, label: 'Dev  Lab',  rgb: '112,72,232'  },
  { x: 348, y: 158, w: 218, h: 162, label: '研究区',    rgb: '232,89,12'   },
  { x: 18,  y: 298, w: 218, h: 162, label: '质量门禁',  rgb: '201,42,42'   },
  { x: 348, y: 298, w: 218, h: 162, label: '设计工作室', rgb: '240,140,0'  },
  { x: 170, y: 432, w: 230, h: 110, label: '品牌中心',  rgb: '12,133,153'  },
] as const;

// ── Agent 状态（运行时） ──────────────────────────────────────────
interface AgentRunState {
  id:          string;
  displayName: string;
  shortName:   string; // "Brain" (去掉 "· xxx" 后缀)
  color:       string;
  symbol:      string;

  activity:     AgentActivity;
  activityText: string;
  nextSwitch:   number; // timestamp when to switch activity

  // 平滑位置
  curX: number;
  curY: number;
  tgtX: number;
  tgtY: number;
}

// ── Props ─────────────────────────────────────────────────────────
export interface MeetingEvent {
  date:  string;
  title: string;
  type:  string;
}

export interface AgentInfo {
  id:          string;
  displayName: string;
  color:       string;
  symbol:      string;
  bio?:        string;
  tagline?:    string;
  philosophy?: string;
  meetings?:   MeetingEvent[];
}

interface Props {
  agents: AgentInfo[];
}

// ── 辅助 ─────────────────────────────────────────────────────────
function pickActivity(id: string, prevType?: string): AgentActivity {
  const all = AGENT_ACTIVITIES[id] ?? [];
  if (!all.length) return { status: '待机中…', type: 'desk', duration: [5000, 10000] };

  // 倾向于交替：desk 之后选非 desk，反之亦然
  let pool = all;
  if (prevType === 'desk') {
    const nonDesk = all.filter(a => a.type !== 'desk');
    if (nonDesk.length) pool = nonDesk;
  } else if (prevType) {
    const desk = all.filter(a => a.type === 'desk');
    if (desk.length) pool = desk;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ── Main Component ────────────────────────────────────────────────
export default function AgentOffice({ agents }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const statesRef  = useRef<Map<string, AgentRunState>>(new Map());
  const frameRef   = useRef(0); // animation frame counter
  const rafRef     = useRef(0);

  // ── 初始化状态 ───────────────────────────────────────────────────
  useEffect(() => {
    const now = Date.now();
    const map = new Map<string, AgentRunState>();

    agents.forEach((info, idx) => {
      // 错开不同 Agent 的初始活动，避免全部同时切换
      const stagger = idx * 700;
      const firstAct = AGENT_ACTIVITIES[info.id]?.[idx % (AGENT_ACTIVITIES[info.id]?.length ?? 1)]
        ?? { status: '初始化…', type: 'desk' as const, duration: [5000, 8000] };
      const dur = firstAct.duration[0] + Math.random() * (firstAct.duration[1] - firstAct.duration[0]);

      const [hx, hy] = AGENT_HOME_POSITIONS[info.id] ?? [285, 280];

      map.set(info.id, {
        id:          info.id,
        displayName: info.displayName,
        shortName:   info.displayName.split('·')[0].trim(),
        color:       info.color,
        symbol:      info.symbol,
        activity:    firstAct,
        activityText: firstAct.status,
        nextSwitch:  now + stagger + dur,
        curX: hx, curY: hy,
        tgtX: hx, tgtY: hy,
      });
    });

    statesRef.current = map;
  }, [agents]);

  // ── 动画循环 ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const now   = Date.now();
      const frame = ++frameRef.current;

      // ── 更新各 Agent 状态 ─────────────────────────────────────
      statesRef.current.forEach((s) => {
        // 切换活动
        if (now >= s.nextSwitch) {
          const next = pickActivity(s.id, s.activity.type);
          const dur  = next.duration[0] + Math.random() * (next.duration[1] - next.duration[0]);
          s.activity     = next;
          s.activityText = next.status;
          s.nextSwitch   = now + dur;

          const [hx, hy] = AGENT_HOME_POSITIONS[s.id] ?? [285, 280];
          if (next.type === 'desk') {
            s.tgtX = hx; s.tgtY = hy;
          } else if (next.type === 'errand') {
            const [ex, ey] = ERRAND_POSITIONS[s.id] ?? [hx, hy];
            s.tgtX = ex; s.tgtY = ey;
          } else if (next.type === 'dialogue' && next.meetWith) {
            const [tx, ty] = AGENT_HOME_POSITIONS[next.meetWith] ?? [hx, hy];
            // 走向目标 Agent 中间
            s.tgtX = lerp(hx, tx, 0.42);
            s.tgtY = lerp(hy, ty, 0.42);
          }
        }

        // 平滑位置插值（lerp）
        s.curX = lerp(s.curX, s.tgtX, 0.04);
        s.curY = lerp(s.curY, s.tgtY, 0.04);

        // Errand 模式微抖动
        if (s.activity.type === 'errand') {
          const agentIdx = [...statesRef.current.keys()].indexOf(s.id);
          s.curY += Math.sin(frame * 0.05 + agentIdx * 1.3) * 0.6;
        }
      });

      // ── 绘制 ──────────────────────────────────────────────────
      ctx.clearRect(0, 0, CW, CH);

      // 背景
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, CW, CH);

      // 地板网格线
      ctx.strokeStyle = 'rgba(48,54,61,0.55)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < CW; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke();
      }
      for (let y = 0; y < CH; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke();
      }

      // 区域背景
      ZONES.forEach(z => {
        ctx.fillStyle = `rgba(${z.rgb},0.07)`;
        ctx.strokeStyle = `rgba(${z.rgb},0.28)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        roundRect(ctx, z.x, z.y, z.w, z.h, 8);
        ctx.fill();
        ctx.stroke();
        // 角标签
        ctx.fillStyle = `rgba(${z.rgb},0.55)`;
        ctx.font = '9px "JetBrains Mono",monospace';
        ctx.fillText(z.label, z.x + 8, z.y + 15);
      });

      // 走廊中心线（装饰）
      ctx.strokeStyle = 'rgba(48,54,61,0.8)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(236, 0); ctx.lineTo(236, CH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(348, 0); ctx.lineTo(348, CH); ctx.stroke();
      ctx.setLineDash([]);

      // ── 对话连线 ──────────────────────────────────────────────
      statesRef.current.forEach((s) => {
        if (s.activity.type !== 'dialogue' || !s.activity.meetWith) return;
        const target = statesRef.current.get(s.activity.meetWith);
        if (!target) return;

        const elapsed  = now - (s.nextSwitch - s.activity.duration[0]);
        const progress = Math.max(0, Math.min(1, elapsed / Math.max(1, s.activity.duration[0])));
        const alpha    = Math.min(1, progress * 4) * (1 - Math.max(0, (progress - 0.75) / 0.25));

        ctx.save();
        ctx.strokeStyle = `rgba(88,166,255,${alpha * 0.55})`;
        ctx.lineWidth   = 1;
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -(frame * 0.6);
        ctx.beginPath();
        ctx.moveTo(s.curX, s.curY);
        ctx.lineTo(target.curX, target.curY);
        ctx.stroke();
        ctx.restore();
      });

      // ── 绘制 Agent 终端窗口 ────────────────────────────────────
      statesRef.current.forEach((s) => {
        const bx = s.curX - BW / 2;
        const by = s.curY - BH / 2;

        // Glow（desk 模式脉冲）
        if (s.activity.type === 'desk') {
          ctx.shadowColor = s.color;
          ctx.shadowBlur  = 10 + 5 * Math.sin(frame * 0.04);
        }

        // 外框
        ctx.strokeStyle = s.color;
        ctx.lineWidth   = 1;
        ctx.beginPath();
        roundRect(ctx, bx, by, BW, BH, 6);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 背景
        ctx.fillStyle = '#161b22';
        ctx.beginPath();
        roundRect(ctx, bx, by, BW, BH, 6);
        ctx.fill();

        // 大号水印符号（低透明度，背景层）
        ctx.globalAlpha = 0.07;
        drawAgentSymbol(ctx, s.id, bx + BW * 0.72, by + BH / 2 + 4, 20, s.color);
        ctx.globalAlpha = 1;

        // 标题栏背景
        const TH = 20;
        ctx.fillStyle = s.color + '26'; // ~15% alpha
        ctx.beginPath();
        roundRect(ctx, bx, by, BW, TH, 6);
        ctx.fill();

        // 标题栏几何符号（小号，替代交通灯）
        drawAgentSymbol(ctx, s.id, bx + 12, by + 10, 6.5, s.color);

        // 标题：ShortName
        ctx.fillStyle = s.color;
        ctx.font      = 'bold 11px "JetBrains Mono",monospace';
        ctx.fillText(s.shortName, bx + 26, by + 14);

        // 活动文本（截断 + 省略）
        const maxChars = 17;
        const txt = s.activityText.length > maxChars
          ? s.activityText.substring(0, maxChars - 1) + '…'
          : s.activityText;
        ctx.fillStyle = '#c9d1d9';
        ctx.font      = '10px "JetBrains Mono",monospace';
        ctx.fillText(txt, bx + 8, by + TH + 16);

        // 状态点 + 类型标签
        const stateMap = {
          desk:     { color: '#3fb950', label: 'ACTIVE',  pulse: true  },
          dialogue: { color: '#58a6ff', label: 'COLLAB',  pulse: false },
          errand:   { color: '#e3b341', label: 'ERRAND',  pulse: false },
        } as const;
        const st    = stateMap[s.activity.type];
        const alpha = st.pulse ? 0.65 + 0.35 * Math.sin(frame * 0.07) : 1;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = st.color;
        ctx.beginPath();
        ctx.arc(bx + 8, by + TH + 34, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.fillStyle = st.color;
        ctx.font      = '9px "JetBrains Mono",monospace';
        ctx.fillText(`● ${st.label}`, bx + 16, by + TH + 37);
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── 点击展开记忆面板 ────────────────────────────────────────────
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = CW / rect.width;
    const scaleY = CH / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top)  * scaleY;

    let hit: AgentInfo | null = null;
    statesRef.current.forEach((s) => {
      const bx = s.curX - BW / 2;
      const by = s.curY - BH / 2;
      if (mx >= bx && mx <= bx + BW && my >= by && my <= by + BH) {
        hit = agents.find(a => a.id === s.id) ?? null;
      }
    });
    if (hit) setSelectedAgent(hit);
  }, [agents]);

  // ── 渲染 ─────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: '100%',
        position: 'relative',
        background: '#0d1117',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #30363d',
      }}
    >
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        onClick={handleClick}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          cursor: 'pointer',
        }}
        role="img"
        aria-label="AI 协作团队实时工作状态可视化 — 点击任意 Agent 查看记忆面板"
      />
      {selectedAgent && (
        <MemoryPanel
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}

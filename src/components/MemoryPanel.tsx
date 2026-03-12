/**
 * MemoryPanel.tsx — Agent 记忆面板弹出组件
 * 独立 React 组件，由 AgentOffice 点击 Agent token 后弹出
 */
import type React from 'react';

// 最小化局部接口定义，避免与 AgentOffice 循环依赖
interface MeetingRecord {
  date: string;
  title: string;
  type: string;
}

export interface MemoryPanelAgent {
  id: string;
  displayName: string;
  color: string;
  symbol: string;
  bio?: string;
  tagline?: string;
  philosophy?: string;
  meetings?: MeetingRecord[];
}

interface Props {
  agent: MemoryPanelAgent;
  onClose: () => void;
}

const MEETING_TYPE_LABELS: Record<string, string> = {
  'all-hands':     '全体会议',
  'planning':      '规划会',
  'retrospective': '复盘会',
  'kickoff':       '启动会',
  'brainstorm':    '头脑风暴',
  'research':      '专项研究',
  'meeting':       '专题会',
};

export default function MemoryPanel({ agent, onClose }: Props): React.ReactElement {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${agent.displayName} 记忆面板`}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(4px)',
        zIndex: 10,
      }}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={{
        width: '88%', maxWidth: 520,
        background: '#0d1117',
        border: `1px solid ${agent.color}55`,
        borderTop: `2px solid ${agent.color}`,
        borderRadius: 8,
        fontFamily: '"JetBrains Mono",monospace',
        color: '#c9d1d9',
        fontSize: 13,
        overflow: 'hidden',
      }}>
        {/* ── 标题栏 ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px',
          background: agent.color + '18',
          borderBottom: `1px solid ${agent.color}33`,
        }}>
          <span style={{ color: agent.color, fontSize: 15, lineHeight: 1 }}>
            {agent.symbol}
          </span>
          <span style={{ color: agent.color, fontWeight: 700, fontSize: 13, flex: 1 }}>
            {agent.displayName}
          </span>
          <button
            onClick={onClose}
            aria-label="关闭面板"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#8b949e', fontSize: 16, lineHeight: 1, padding: '2px 4px',
            }}
          >×</button>
        </div>

        {/* ── Core Memory ── */}
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #21262d' }}>
          <div style={{ color: '#8b949e', fontSize: 10, letterSpacing: '0.08em', marginBottom: 8 }}>
            CORE MEMORY
          </div>
          {agent.tagline && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: agent.color, marginRight: 6 }}>❯</span>
              <span style={{ color: '#e6edf3', fontStyle: 'italic' }}>{agent.tagline}</span>
            </div>
          )}
          {agent.philosophy && (
            <div style={{ color: '#8b949e', fontSize: 12, lineHeight: 1.6, paddingLeft: 14 }}>
              {agent.philosophy}
            </div>
          )}
        </div>

        {/* ── Recall Memory ── */}
        {agent.meetings && agent.meetings.length > 0 && (
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #21262d' }}>
            <div style={{ color: '#8b949e', fontSize: 10, letterSpacing: '0.08em', marginBottom: 8 }}>
              RECALL MEMORY — 最近 {Math.min(5, agent.meetings.length)} 条
            </div>
            {agent.meetings.slice(0, 5).map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start' }}>
                <span style={{ color: '#484f58', fontSize: 11, whiteSpace: 'nowrap', marginTop: 1 }}>
                  {m.date.slice(5)}
                </span>
                <span style={{
                  background: agent.color + '22',
                  color: agent.color,
                  fontSize: 9, padding: '1px 5px', borderRadius: 3,
                  whiteSpace: 'nowrap', marginTop: 1,
                }}>
                  {MEETING_TYPE_LABELS[m.type] ?? m.type}
                </span>
                <span style={{ fontSize: 12, lineHeight: 1.4, color: '#adbac7' }}>
                  {m.title.length > 32 ? m.title.slice(0, 30) + '…' : m.title}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── 操作按钮 ── */}
        <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href={`/agents/${agent.id}`}
            style={{
              background: agent.color,
              color: '#0d1117',
              padding: '6px 16px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            查看详情 →
          </a>
        </div>
      </div>
    </div>
  );
}

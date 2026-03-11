// AgentKnowledgeGraph.tsx
// Astro Island — client:load，懒加载 react-force-graph
// 渲染 Agent 协作关系的力导向图

import { useEffect, useRef, useState, useCallback } from 'react';
import type { GraphData, GraphNode } from '../data/agent-graph-data';
import { nodeTypeConfig, edgeTypeConfig } from '../data/agent-graph-data';

interface Props {
  data: GraphData;
  width?: number;
  height?: number;
}

export default function AgentKnowledgeGraph({ data, width = 800, height = 520 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ReturnType<typeof import('react-force-graph').ForceGraph2D> | null>(null);
  const [hovered, setHovered] = useState<GraphNode | null>(null);
  const [ForceGraph, setForceGraph] = useState<any>(null);

  // 懒加载 react-force-graph（客户端专有库）
  useEffect(() => {
    import('react-force-graph').then(mod => {
      setForceGraph(() => mod.ForceGraph2D);
    });
  }, []);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHovered(node);
    if (containerRef.current) {
      containerRef.current.style.cursor = node ? 'pointer' : 'default';
    }
  }, []);

  if (!ForceGraph) {
    return (
      <div className="graph-loading" aria-label="图谱加载中">
        <span className="graph-loading-text">$ loading graph...</span>
        <span className="graph-loading-cursor" aria-hidden="true">▋</span>
      </div>
    );
  }

  return (
    <div className="graph-wrapper" ref={containerRef}>
      {/* 悬浮信息卡 */}
      {hovered && (
        <div className="graph-tooltip" role="tooltip">
          <span className="tooltip-symbol">{hovered.symbol ?? '●'}</span>
          <div className="tooltip-body">
            <strong>{hovered.label}</strong>
            {hovered.role && <span className="tooltip-role">{hovered.role}</span>}
            <span className="tooltip-type">{nodeTypeConfig[hovered.type].label}</span>
          </div>
        </div>
      )}

      {/* 力导向图 */}
      <ForceGraph
        graphData={data}
        width={width}
        height={height}
        backgroundColor="transparent"
        nodeLabel={(node: GraphNode) => `${node.symbol ?? ''} ${node.label}${node.role ? ` · ${node.role}` : ''}`}
        nodeColor={(node: GraphNode) => node.color}
        nodeRelSize={4}
        nodeVal={(node: GraphNode) => node.size}
        linkColor={() => 'rgba(139,148,158,0.35)'}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkWidth={1.2}
        nodeCanvasObjectMode={() => 'after'}
        nodeCanvasObject={(node: GraphNode & { x?: number; y?: number }, ctx: CanvasRenderingContext2D) => {
          if (node.x == null || node.y == null) return;
          // 绘制节点标签
          const label = node.symbol ? `${node.symbol} ${node.label}` : node.label;
          ctx.font = `${node.type === 'human' ? '600 ' : ''}10px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.type === 'pattern' ? '#6e7681' : '#e6edf3';
          ctx.fillText(label, node.x, node.y + (node.size ?? 6) * 2.2);
        }}
        onNodeHover={handleNodeHover}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />

      {/* 图例 */}
      <div className="graph-legend" aria-label="图谱图例">
        <div className="legend-section">
          <span className="legend-title">节点类型</span>
          {Object.entries(nodeTypeConfig).map(([key, cfg]) => (
            <span key={key} className="legend-item">
              <span className="legend-dot" style={{ background: cfg.color }} />
              {cfg.label}
            </span>
          ))}
        </div>
        <div className="legend-section">
          <span className="legend-title">关系类型</span>
          {Object.entries(edgeTypeConfig).map(([key, cfg]) => (
            <span key={key} className="legend-item">
              <span className="legend-dash" style={{ background: cfg.color }} />
              {cfg.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

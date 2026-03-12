/**
 * draw-symbols.ts — Agent 几何身份符号绘制系统
 *
 * 纯函数，无副作用，可独立测试。
 * 每个 Agent 对应唯一几何图形：
 *   brain         → Hexagon ⬡
 *   pm            → Flow nodes ⏱
 *   dev           → Gear ⚙
 *   researcher    → 4-point star ✦
 *   code-reviewer → Diamond ◈
 *   profile-designer → Spiral ✺
 *   brand         → Double sine wave ≋
 */

// ── roundRect polyfill helper ─────────────────────────────────────
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}

// ── 每个 Agent 的几何身份符号 ─────────────────────────────────────
export function drawAgentSymbol(
  ctx: CanvasRenderingContext2D,
  id: string,
  cx: number,
  cy: number,
  r: number,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle   = color;
  ctx.lineWidth   = Math.max(1, r * 0.15);
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  switch (id) {
    case 'brain': {
      // Hexagon ⬡
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case 'pm': {
      // Flow nodes ⏱: 3 dots connected by a line
      const gap = r * 0.65;
      ctx.beginPath();
      ctx.moveTo(cx - gap, cy);
      ctx.lineTo(cx + gap, cy);
      ctx.stroke();
      [-gap, 0, gap].forEach((ox) => {
        ctx.beginPath();
        ctx.arc(cx + ox, cy, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
    case 'dev': {
      // Gear ⚙: 7-tooth jagged circle + inner circle
      const teeth = 7;
      ctx.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const angle = (Math.PI / teeth) * i;
        const rad   = i % 2 === 0 ? r : r * 0.72;
        const x = cx + rad * Math.cos(angle - Math.PI / 2);
        const y = cy + rad * Math.sin(angle - Math.PI / 2);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 'researcher': {
      // 4-point star ✦ + accent dots
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i - Math.PI / 2;
        const rad   = i % 2 === 0 ? r : r * 0.42;
        const x = cx + rad * Math.cos(angle);
        const y = cy + rad * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      if (r >= 10) {
        [[-r*0.72, -r*0.8], [r*0.82, -r*0.55], [-r*0.85, r*0.5], [r*0.6, r*0.78]].forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.arc(cx + dx!, cy + dy!, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      break;
    }
    case 'code-reviewer': {
      // Diamond ◈: outer + inner rhombus
      ctx.beginPath();
      ctx.moveTo(cx,          cy - r);
      ctx.lineTo(cx + r*0.65, cy);
      ctx.lineTo(cx,          cy + r);
      ctx.lineTo(cx - r*0.65, cy);
      ctx.closePath();
      ctx.stroke();
      const ir = r * 0.38;
      ctx.beginPath();
      ctx.moveTo(cx,           cy - ir);
      ctx.lineTo(cx + ir*0.65, cy);
      ctx.lineTo(cx,           cy + ir);
      ctx.lineTo(cx - ir*0.65, cy);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case 'profile-designer': {
      // Spiral ✺
      const turns = r >= 10 ? 2.5 : 1.8;
      ctx.beginPath();
      for (let t = 0; t <= turns * Math.PI * 2; t += 0.18) {
        const rad = r * 0.12 + (r * 0.82 * t) / (turns * Math.PI * 2);
        const x = cx + rad * Math.cos(t - Math.PI / 2);
        const y = cy + rad * Math.sin(t - Math.PI / 2);
        t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      break;
    }
    case 'brand': {
      // Double sine wave ≋
      ctx.beginPath();
      for (let i = -r; i <= r; i++) {
        const x = cx + i;
        const y = cy - r * 0.45 * Math.sin((i / r) * Math.PI * 1.6);
        i === -r ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = -r; i <= r; i++) {
        const x = cx + i;
        const y = cy + r * 0.45 * Math.sin((i / r) * Math.PI * 1.6 + Math.PI);
        i === -r ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      break;
    }
    default: {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

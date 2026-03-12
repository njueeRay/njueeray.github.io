/**
 * PixelAvatarCanvas.tsx — Agent 像素头像 React 组件
 * 用于 Agent 详情页 profile header 和记忆面板标题栏
 */
import { useEffect, useRef } from 'react';
import { drawPixelAvatar } from '../data/pixel-avatars';

interface Props {
  id: string;
  color: string;
  /** 总尺寸（px），默认 64；8×8 网格 × (size/8) 块尺寸 */
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export default function PixelAvatarCanvas({
  id,
  color,
  size = 64,
  className,
  ariaLabel,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blockSize = Math.max(1, Math.floor(size / 8));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cssSize = blockSize * 8;
    canvas.width  = cssSize * dpr;
    canvas.height = cssSize * dpr;
    canvas.style.width  = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, cssSize, cssSize);
    drawPixelAvatar(ctx, id, 0, 0, blockSize, color);
  }, [id, color, blockSize]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={ariaLabel ?? `${id} Agent 像素头像`}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    />
  );
}

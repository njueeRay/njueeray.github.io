/**
 * OG Cover Image Generator — v5.3.0
 * Generates a 1200×630 PNG for each blog post at build time.
 * Uses satori (HTML→SVG) + @resvg/resvg-js (SVG→PNG, WASM-based).
 * Terminal aesthetic: dark #0d1117 bg, #58a6ff accent, JetBrains Mono font.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const prerender = true;

// Read JetBrains Mono font from @fontsource package (bundled locally, no network)
let _fontData: ArrayBuffer | null = null;
function getFont(): ArrayBuffer {
  if (_fontData) return _fontData;
  const fontPath = resolve(
    'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'
  );
  const buffer = readFileSync(fontPath);
  _fontData = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
  return _fontData;
}

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      author: post.data.author,
      pubDate: post.data.pubDate,
      tags: post.data.tags ?? [],
      description: post.data.description ?? '',
    },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, author, pubDate, tags } = props;
  const fontData = getFont();

  const dateStr = new Date(pubDate).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Truncate title if too long
  const displayTitle = title.length > 52 ? title.slice(0, 50) + '…' : title;
  // Up to 4 tags shown
  const displayTags = (tags as string[]).slice(0, 4);

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: '#0d1117',
          fontFamily: '"JetBrains Mono", monospace',
          padding: '60px 72px',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Left accent bar
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: '0',
                top: '0',
                width: '6px',
                height: '100%',
                background: 'linear-gradient(180deg, #58a6ff 0%, #1f6feb 100%)',
              },
            },
          },
          // Top decorative dots
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '8px',
                marginBottom: '36px',
              },
              children: ['#ff5f57', '#febc2e', '#28c840'].map(color => ({
                type: 'div',
                props: {
                  style: {
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: color,
                  },
                },
              })),
            },
          },
          // Prompt + title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                flex: '1',
              },
              children: [
                // Prompt symbol
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#58a6ff',
                      fontSize: '36px',
                      lineHeight: '1.3',
                      marginTop: '4px',
                      flexShrink: '0',
                    },
                    children: '>',
                  },
                },
                // Title text
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#e6edf3',
                      fontSize: displayTitle.length > 30 ? '40px' : '48px',
                      lineHeight: '1.35',
                      fontWeight: '600',
                      flex: '1',
                    },
                    children: displayTitle,
                  },
                },
              ],
            },
          },
          // Tags row
          displayTags.length > 0
            ? {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                  },
                  children: displayTags.map((tag: string) => ({
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: 'rgba(88,166,255,0.12)',
                        color: '#58a6ff',
                        border: '1px solid rgba(88,166,255,0.3)',
                        borderRadius: '6px',
                        padding: '4px 14px',
                        fontSize: '18px',
                      },
                      children: `#${tag}`,
                    },
                  })),
                },
              }
            : { type: 'div', props: { style: { display: 'none' }, children: '' } },
          // Footer: author, date, site
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #21262d',
                paddingTop: '20px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { color: '#8b949e', fontSize: '20px' },
                    children: `${author} · ${dateStr}`,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { color: '#58a6ff', fontSize: '20px' },
                    children: 'njueeray.github.io',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'JetBrains Mono', data: fontData, weight: 400, style: 'normal' }],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const rendered = resvg.render();
  const pngBuffer = rendered.asPng();
  // slice() returns a plain ArrayBuffer (non-SharedArrayBuffer) — required for BodyInit/Uint8Array generic
  const pngData = new Uint8Array(
    pngBuffer.buffer.slice(pngBuffer.byteOffset, pngBuffer.byteOffset + pngBuffer.byteLength) as ArrayBuffer
  );

  return new Response(pngData, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

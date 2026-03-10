/**
 * readingTime.ts — 阅读时长估算工具 (v5.8.0, B-3)
 *
 * 支持中英混排：中文 500 字/分钟，英文 200 词/分钟。
 * 会自动剥离 frontmatter、代码块、HTML 标签和 MDX 组件标签。
 */

export interface ReadingTimeResult {
  /** 估算分钟数（最少 1） */
  minutes: number;
  /** 展示文本，如 "3 分钟阅读" */
  text: string;
}

/**
 * 根据原始 Markdown/MDX 文本估算阅读时长。
 *
 * @param rawBody - 原始文件内容（含 frontmatter 也可以，会自动剥离）
 */
export function calcReadingTime(rawBody: string): ReadingTimeResult {
  const cleaned = rawBody
    // 剥离 frontmatter
    .replace(/^---[\s\S]*?---\n?/, '')
    // 剥离围栏代码块
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    // 剥离行内代码
    .replace(/`[^`]*`/g, '')
    // 剥离 HTML / JSX 标签
    .replace(/<[^>]+>/g, '')
    // 剥离 Markdown 链接语法
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 剥离 Markdown 图片
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    // 剥离横线分隔符
    .replace(/^[-*_]{3,}\s*$/gm, '');

  // 中文字符数
  const chineseChars = (cleaned.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) ?? []).length;
  // 英文单词数
  const englishWords = (cleaned.match(/[a-zA-Z]+/g) ?? []).length;

  const minutes = Math.max(1, Math.round(chineseChars / 500 + englishWords / 200));

  return { minutes, text: `${minutes} 分钟阅读` };
}

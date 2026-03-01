import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    bilingual: z.boolean().default(false),
    author: z.string().default('njueeray'),
    // 内容风格分类（taste-level，非主题标签）
    // insight: 思想笔记 | technical: 技术实录 | member-essay: 成员随笔 | meeting: 会议纪实
    contentType: z.enum(['insight', 'technical', 'member-essay', 'meeting']).default('insight'),
  }),
});

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    displayName: z.string(),
    role: z.string(),
    bio: z.string(),
    philosophy: z.string(),
    avatar: z.string().optional(),
    isAgent: z.boolean().default(false),
  }),
});

export const collections = { blog, authors };

import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    bilingual: z.boolean().default(false),
    author: z.string().default('njueeray'),
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

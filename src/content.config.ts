import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), text: z.string() }),
  z.object({ type: z.literal('paragraph'), text: z.string() }),
  z.object({ type: z.literal('image'), src: z.string(), caption: z.string().optional() }),
  z.object({ type: z.literal('quote'), text: z.string(), author: z.string().optional() }),
  z.object({ type: z.literal('twoColumn'), left: z.string(), right: z.string() }),
  z.object({ type: z.literal('gallery'), images: z.array(z.string()) }),
  z.object({ type: z.literal('list'), items: z.array(z.string()) }),
]);

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.enum(['Pest Guides', 'Fumigation Tips', 'Company News']),
    coverImage: z.string(),
    excerpt: z.string(),
    lang: z.enum(['en', 'id']),
    tags: z.array(z.string()),
    author: z.object({
      name: z.string(),
      bio: z.string(),
      avatar: z.string(),
    }),
    blocks: z.array(blockSchema),
  }),
});

const clients = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/clients' }),
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    projectImage: z.string(),
    servedSince: z.date().optional(),
    testimonial: z.string().optional(),
  }),
});

export const collections = { articles, clients };
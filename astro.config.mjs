// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/.wrangler/**', '**/.astro/**'],
      },
    },
  },
  adapter: cloudflare(),
  i18n: {
    locales: ['en', 'id'],
    defaultLocale: 'id',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
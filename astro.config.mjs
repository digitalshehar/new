// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind(), react()],
  output: 'server', // Changed from 'static' to 'server' to support API endpoints
  build: {
    format: 'file'
  }
});

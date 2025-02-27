// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Output mode: 'server' for server-side rendering
  output: 'server',
  // Adapter for Vercel deployment
  adapter: vercel(),
  // Integrations for Tailwind CSS and React
  integrations: [tailwind(), react()],
  // Build configuration
  build: {
    // Output format: 'file' for optimized file output
    format: 'file'
  },
  // Define a custom server port (optional)
  server: {
    port: 3000 // Default is 3000
  }
});

import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('scheduler'))
              return 'vendor-react';
            if (id.includes('@supabase'))
              return 'vendor-supabase';
            if (id.includes('motion'))
              return 'vendor-motion';
            if (id.includes('recharts') || id.includes('d3-'))
              return 'vendor-charts';
            if (id.includes('@radix-ui'))
              return 'vendor-ui';
            if (id.includes('lucide-react'))
              return 'vendor-icons';
          }
        },
      },
    },
    target: 'es2020',
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
    },
  },
})

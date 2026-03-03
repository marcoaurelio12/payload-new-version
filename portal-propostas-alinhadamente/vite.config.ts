import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3005,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            tailwind: path.resolve(__dirname, 'index-tailwind.html'),
          },
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'framer-motion': ['framer-motion'],
              'heroicons': ['@heroicons/react'],
            },
          },
        },
        minify: 'esbuild',
        sourcemap: false,
      },
    };
});

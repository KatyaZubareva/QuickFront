import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { visualizer } from 'rollup-plugin-visualizer';
import checker from 'vite-plugin-checker';
import viteCompression from 'vite-plugin-compression';
import type { PluginOption } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const plugins: PluginOption[] = [
    react({
      jsxImportSource: '@emotion/react',
      tsDecorators: true,
      plugins: [['@swc/plugin-emotion', {}]]
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        useFlatConfig: true,
        dev: {
          logLevel: ['error']
        }
      }
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ];

  if (mode === 'analyze') {
    plugins.push(
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true
      }) as PluginOption
    );
  }

  return {
    plugins,
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()]
      },
      modules: {
        localsConvention: 'camelCaseOnly'
      },
      devSourcemap: true
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
          secure: false
        },
        '/health': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          ws: false
        }
      },
      open: true
    },
    preview: {
      port: 4173,
      strictPort: true
    },
    build: {
      emptyOutDir: true,
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true
        }
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('@mui')) return 'vendor-mui';
              if (id.includes('@emotion')) return 'vendor-emotion';
              return 'vendor';
            }
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]'
        }
      },
      chunkSizeWarningLimit: 1600
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@emotion/react',
        '@emotion/styled'
      ],
      exclude: ['js-big-decimal']
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html']
      }
    }
  };
});
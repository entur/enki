/// <reference types="vitest" />
/// <reference types="vite-plugin-svgr/client" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import reactComponentToggle from '@entur/rollup-plugin-react-component-toggle';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    (() => {
      let base = '/';
      return {
        name: 'preload-bootstrap',
        configResolved(config) {
          base = config.base;
        },
        transformIndexHtml: {
          order: 'pre' as const,
          handler(_: string, ctx: { server?: unknown }) {
            if (ctx.server) return [];
            return [
              {
                tag: 'link',
                attrs: { rel: 'preload', href: `${base}bootstrap.json`, as: 'fetch', crossorigin: 'anonymous' },
                injectTo: 'head' as const,
              },
            ];
          },
        },
      };
    })(),
    (() => {
      const preloadLocale = process.env.PRELOAD_LOCALE;
      let base = '/';
      return {
        name: 'preload-locale',
        configResolved(config) {
          base = config.base;
        },
        transformIndexHtml: {
          order: 'post' as const,
          handler(_: string, ctx: { server?: unknown; bundle?: Record<string, { fileName: string }> }) {
            if (ctx.server || !preloadLocale || !ctx.bundle) return [];
            const chunk = Object.values(ctx.bundle).find(
              (c) => c.fileName.match(new RegExp(`^assets/${preloadLocale}-.*\\.js$`))
            );
            if (!chunk) return [];
            return [
              {
                tag: 'link',
                attrs: { rel: 'modulepreload', href: `${base}${chunk.fileName}` },
                injectTo: 'head' as const,
              },
            ];
          },
        },
      };
    })(),
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    reactComponentToggle({
      componentsPath: '/src/ext',
      manualChunks: (id) => {
        if (id.includes("node_modules")) {
          return 'vendor';
        } else if (!id.includes("/i18n/translations/")) {
          return 'index';
        }
      }
    })
  ],
  server: {
    port: 3001,
  },
  publicDir: 'public',
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  resolve: {
    alias: [
      // @ts-ignore
      {
        find: /^~.+/,
        replacement: (val: any) => {
          return val.replace(/^~/, "");
        },
      },
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    exclude: ['e2e/**', 'node_modules/**'],
    reporters: [
      'default',
      ['vitest-sonar-reporter', { outputFile: 'test-report.xml' }],
    ],
    coverage: {
      reporter: ['lcov'],
    },
  },
});

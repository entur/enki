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
    reporters: [
      'default',
      ['vitest-sonar-reporter', { outputFile: 'test-report.xml' }],
    ],
    coverage: {
      reporter: ['lcov'],
    },
  },
});

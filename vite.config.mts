/// <reference types="vitest" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    port: 3001,
  },
  publicDir: 'public',
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return 'vendor';
          } else if (id.includes("/src/ext/")) {
            const split = id.split("/src/ext/");
            return `ext-${split[split.length - 1].split("/")[0]}`;
          }
        }
      }
    }
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
    environment: 'happy-dom'
  },
});

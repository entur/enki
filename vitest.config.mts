// vitest.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config'
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    test: {
        globals: true,
    },
});
// vitest.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config'
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    test: {
        globals: true,
        reporters: [
            ['vitest-sonar-reporter', { outputFile: 'test-report.xml' }],
        ],
        coverage: {
            reporters: 'lcov',
        },
    },
});
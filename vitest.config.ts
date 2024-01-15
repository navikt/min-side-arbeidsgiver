/// <reference types="vitest" />

import { configDefaults, defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __BUILD_TIMESTAMP__: new Date(),
        __BASE_PATH__: JSON.stringify('http://localhost/min-side-arbeidsgiver'),
    },
    test: {
        globals: true,
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, './vitest.setup.ts', 'build/**/*'],
        setupFiles: './vitest.setup.ts',
        reporters: 'verbose',
    },
});

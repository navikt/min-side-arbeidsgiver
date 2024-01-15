/// <reference types="vitest" />

import { configDefaults, defineConfig } from 'vitest/config';
// import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    //     plugins: [react()],
    define: {
        __BUILD_TIMESTAMP__: new Date(),
        __BASE_PATH__: JSON.stringify('http://localhost/min-side-arbeidsgiver'),
    },
    test: {
        globals: true,
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, './vitest.setup.ts', 'build/**/*'],
        setupFiles: './vitest.setup.ts',
        //         coverage: {
        //             reporter: ['text', 'lcov', 'html'],
        //             provider: 'v8',
        //         },
        //         reporters: ['vitest-sonar-reporter', 'default'],
        //         outputFile: 'sonar-report.xml',
        //         css: {
        //             modules: {
        //                 classNameStrategy: 'non-scoped',
        //             },
        //         },
    },
});

/// <reference types="vitest" />

import { configDefaults, defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import graphqlLoader from 'vite-plugin-graphql-loader';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __BUILD_TIMESTAMP__: new Date(),
        __BASE_PATH__: JSON.stringify('http://localhost/min-side-arbeidsgiver'),
    },
    plugins: [
        tsconfigPaths(),
        graphqlLoader(),
        react(),
        legacy({
            modernPolyfills: ['es.string.replace', 'esnext.string.replace-all'],
            polyfills: ['es.string.replace', 'esnext.string.replace-all'],
        }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, './vitest.setup.ts', 'build/**/*'],
        setupFiles: './vitest.setup.ts',
        reporters: 'verbose',
    },
});

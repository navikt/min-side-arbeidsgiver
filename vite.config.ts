import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import graphqlLoader from 'vite-plugin-graphql-loader';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    return {
        base: `https://cdn.nav.no/fager/min-side-arbeidsgiver/build/${mode}`,
        plugins: [
            tsconfigPaths(),
            graphqlLoader(),
            react(),
            legacy({
                modernPolyfills: ['es.string.replace', 'esnext.string.replace-all'],
                polyfills: ['es.string.replace', 'esnext.string.replace-all'],
            }),
        ],
        optimizeDeps: {
            exclude: ['js-big-decimal'],
        },
        define: {
            __BUILD_TIMESTAMP__: new Date(),
            __BASE_PATH__: JSON.stringify('/min-side-arbeidsgiver'),
        },
        build: {
            outDir: `build/${mode}`,
            sourcemap: true,
        },
        server: {
            port: 3000,
            proxy: {
                '/min-side-arbeidsgiver/artikler': 'http://localhost:8080',
            },
        },
    };
});

import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        tsconfigPaths(),
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
        outDir: 'build',
        sourcemap: true,
    },
    server: {
        port: 3000,
        proxy: {
            '/min-side-arbeidsgiver/api': 'http://localhost:8080',
            '/min-side-arbeidsgiver/mock': 'http://localhost:8080',
            '/min-side-arbeidsgiver/redirect-til-login': 'http://localhost:8080',
            '/min-side-arbeidsgiver/artikler': 'http://localhost:8080',
            '/min-side-arbeidsgiver/notifikasjon-bruker-api': 'http://localhost:8080',
            '/min-side-arbeidsgiver/tiltaksgjennomforing-api': 'http://localhost:8080',
            '/min-side-arbeidsgiver/presenterte-kandidater-api': 'http://localhost:8080',
            '/min-side-arbeidsgiver/stillingsregistrering-api': 'http://localhost:8080',
        },
    },
});

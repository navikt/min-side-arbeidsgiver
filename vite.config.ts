import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        sentryVitePlugin({
            url: 'https://sentry.gc.nav.no/',
            org: 'nav',
            project: 'min-side-arbeidsgiver',
            authToken: process.env.SENTRY_AUTH_TOKEN,
            release: {
                name: process.env.GITHUB_SHA,
                // onprem trenger legacy upload
                uploadLegacySourcemaps: {
                    paths: ['./build/assets'],
                    urlPrefix: '~/fager/min-side-arbeidsgiver/build/assets/',
                },
                setCommits: {
                    auto: true,
                },
            },
        }),
    ],
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
            '/min-side-arbeidsgiver/notifikasjon-bruker-api': 'http://localhost:8080',
            '/min-side-arbeidsgiver/tiltaksgjennomforing-api': 'http://localhost:8080',
            '/min-side-arbeidsgiver/presenterte-kandidater-api': 'http://localhost:8080',
            '/min-side-arbeidsgiver/stillingsregistrering-api': 'http://localhost:8080',
        },
    },
});

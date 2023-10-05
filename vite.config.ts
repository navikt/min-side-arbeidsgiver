import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [react()],
    build: {
        outDir: 'build',
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
        },
        headers: {
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            Expires: '-1',
            Pragma: 'no-cache',
        },
    },
});

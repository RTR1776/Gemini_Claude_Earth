import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    server: {
        proxy: {
            '/nominatim': {
                target: 'https://nominatim.openstreetmap.org',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/nominatim/, ''),
            },
            '/iss-api': {
                target: 'http://api.open-notify.org',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/iss-api/, ''),
            }
        }
    }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        // Keep Create React App's output directory so the coust.github.io
        // deployment step stays unchanged.
        outDir: 'build',
        sourcemap: true,
    },
    server: {
        port: 3000,
        open: true,
    },
});

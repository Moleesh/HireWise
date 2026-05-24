/** @format */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	base: '/HireWise/',
	plugins: [react()],
	optimizeDeps: {
		exclude: ['lucide-react'],
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '',
			},
		},
	},
	build: {
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes('pdfjs-dist')) return 'pdf';
					if (id.includes('mammoth')) return 'mammoth';
				},
				entryFileNames: '[name]-[hash].js',
				chunkFileNames: '[name]-[hash].js',
				assetFileNames: '[name]-[hash][extname]',
			},
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/test-setup.ts'],
		css: true,
	},
});

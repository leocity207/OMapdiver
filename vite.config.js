import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

const orm_host = process.env.ORM_HOST ?? '127.0.0.1';

console.log(`Using ORM_HOST: ${orm_host}`);

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],

	optimizeDeps: {
		include: ['fabric', 'animejs', 'hammerjs', 'normalize-wheel', 'rxjs']
	},

	server: {
		port: 3000,
		host: true,
		proxy: {
			'/dyn': {
				target: `http://${orm_host}:8000`,
				changeOrigin: true
			}
		}
	},

	test: {
		environment: 'jsdom',

		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			thresholds: {
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100
			}
		},
		include: [
			'resources/**/*.test.ts'
		]
	},

	build: {
		target: 'es2020',
		sourcemap: true,
		cssCodeSplit: true,
		minify: 'esbuild'
	}
});
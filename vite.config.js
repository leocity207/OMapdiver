import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	optimizeDeps: {
		include: ['fabric', 'animejs', 'hammerjs', 'normalize-wheel', 'rxjs']
	},

	server: {
		port: 3000,
		host: true,
		proxy: {
			'/dyn': {
				target: 'http://127.0.0.1:8080',
				changeOrigin: true
			}
		}
	},

	build: {
		target: 'es2020',
		sourcemap: false,
		cssCodeSplit: true,
		minify: 'esbuild'
	}
});
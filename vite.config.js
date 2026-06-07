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
				target: 'http://oatpp-orm:8000',
				changeOrigin: true
			}
		}
	},

	build: {
		target: 'es2020',
		sourcemap: true,
		cssCodeSplit: true,
		minify: 'esbuild'
	}
});
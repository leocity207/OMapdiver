import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

const orm_host = process.env.ORM_HOST ?? '127.0.0.1';

console.log(`Using ORM_HOST: ${orm_host}`);
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
				target: `http://${orm_host}:8000`,
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
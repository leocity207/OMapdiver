import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		files: {
			routes: 'resources/routes',
			lib: 'resources/lib',
			assets: 'resources/static',
			appTemplate: 'resources/app.html'
		},

		alias: {
			$lib: 'resources/lib',
			$components: 'resources/lib/components',
			$stores: 'resources/lib/stores',
			$types: 'resources/lib/types',
			$server: 'resources/lib/server'
		}
	}
};

export default config;
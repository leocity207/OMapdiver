import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import typescript from '@rollup/plugin-typescript';

const isDev = process.env.NODE_ENV === 'dev';

export default {
	input: 'resources/src/initializer.js', // can stay .js for now
	output: {
		file: 'resources/tsbuild/bundle.js',
		format: 'iife',
		name: 'AppBundle',
		sourcemap: isDev,
		sourcemapExcludeSources: false
	},
	plugins: [
		resolve(),
		typescript({
			tsconfig: './tsconfig.rollup.json',
		}),
		commonjs(),
		postcss({
			extensions: ['.css'],
			extract: false,
			inject: false,
			minimize: !isDev,
			sourceMap: isDev,
			plugins: [
				autoprefixer(),
				!isDev && cssnano()
			].filter(Boolean)
		}),
		!isDev && terser({
			compress: {
				passes: 5,
				drop_console: true,
				drop_debugger: true
			},
			format: {
				comments: false
			}
		})
	]
};
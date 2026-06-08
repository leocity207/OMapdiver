import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-config-prettier';

export default defineConfig([
	js.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs.recommended,

	{
		files: ['**/*.{js,ts,svelte}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			'unused-imports': unusedImports
		},
		rules: {
			'@typescript-eslint/naming-convention': [
				'error',

				{
					selector: 'variable',
					modifiers: ['destructured'],
					format: null
				},
				{
					selector: 'variable',
					modifiers: ['const'],
					types: ['function'],
					filter: {
						regex: '^load$',
						match: true
					},
					format: null
				},
				{
					selector: 'variable',
					format: ['snake_case', 'UPPER_CASE']
				},
				{
					selector: 'function',
					filter: {
						regex: '^load$',
						match: true
					},
					format: null
				},
				{
					selector: 'function',
					format: null,
					custom: {
						regex: '^[A-Z][a-zA-Z0-9]*(_[A-Z][a-zA-Z0-9]*)*$',
						match: true
					}
				},
				{
					selector: 'variable',
					modifiers: ['const'],
					types: ['function'],
					format: null,
					custom: {
					regex: '^[A-Z][a-zA-Z0-9]*(_[A-Z][a-zA-Z0-9]*)*$',
					match: true
					}
				},
				{
					selector: 'typeLike',
					format: null,
					custom: {
						regex: '^[A-Z][a-zA-Z0-9]*(_[A-Z][a-zA-Z0-9]*)*$',
						match: true
					}
				},
				{
					selector: 'parameter',
					format: ['snake_case'],
					leadingUnderscore: 'allow'
				},
				{
					selector: 'property',
					format: null
				}
			],

			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'off',

			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_'
				}
			],

			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/consistent-type-imports': 'error'
		}
	},

	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: tseslint.parser
			}
		}
	},

	prettier
]);
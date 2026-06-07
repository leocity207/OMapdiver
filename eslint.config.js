import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],

	{
		files: ['**/*.{js,ts,svelte}'],

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},

		plugins: {
			import: importPlugin,
			'unused-imports': unusedImports
		},

		rules: {
			/*
			 * Naming conventions
			 */
			'@typescript-eslint/naming-convention': [
				'error',

				// variables
				{
					selector: 'variable',
					format: ['snake_case', 'UPPER_CASE']
				},

				// functions
				{
					selector: 'function',
					format: null,
					custom: {
						regex: '^[A-Z][a-zA-Z0-9]*(_[A-Z][a-zA-Z0-9]*)*$',
						match: true
					}
				},

				// classes / interfaces / types
				{
					selector: 'typeLike',
					custom: {
						regex: '^[A-Z][a-zA-Z0-9]*(_[A-Z][a-zA-Z0-9]*)*$',
						match: true
					}
				},

				// parameters
				{
					selector: 'parameter',
					format: ['snake_case'],
					leadingUnderscore: 'allow'
				},

				// object properties untouched
				{
					selector: 'property',
					format: null
				}
			],

			/*
			 * Imports cleanup
			 */
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

			/*
			 * TypeScript
			 */
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/consistent-type-imports': 'error',

			/*
			 * Import sorting
			 */
			'import/order': [
				'warn',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true
					}
				}
			]
		}
	},

	prettier
];
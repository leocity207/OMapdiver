import { defineConfig, devices } from '@playwright/test';

const is_ci = !!process.env.CI;

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: is_ci,
	retries: is_ci ? 2 : 0,
	workers: is_ci ? 1 : undefined,
	reporter: [
		['html', { outputFolder: 'playwright-report' }],
		['list'],
	],

	use: {
		baseURL: 'http://localhost:3000',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'on-first-retry',
	},

	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit',   use: { ...devices['Desktop Safari'] } },
	],

	// Only start dev server locally — CI uses the Docker stack directly
	webServer: is_ci ? undefined : {
		command: 'pnpm dev',
		url: 'http://localhost:3000',
		reuseExistingServer: true,
		stdout: 'ignore',
		stderr: 'pipe',
	},
});
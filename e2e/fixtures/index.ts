import { test as base, expect } from '@playwright/test';
import { NavPage } from '../pages/nav_page';

type Fixtures = {
	nav: NavPage;
	console_errors: string[];
};

export const test = base.extend<Fixtures>({
	console_errors: async ({ page }, use) => {
		const errors: string[] = [];
		page.on('console', msg => {
			if (msg.type() === 'error') errors.push(msg.text());
		});
		await use(errors);
	},

	nav: async ({ page }, use) => {
		const nav = new NavPage(page);
		await page.goto('/');
		await use(nav);
	},
});

export { expect };
import type { Page } from '@playwright/test';

export class BasePage {
	constructor(protected page: Page) {}

	async navigate(path: string) {
		await this.page.goto(path);
	}

	async waitForHydration() {
		await this.page.waitForLoadState('networkidle');
	}
}
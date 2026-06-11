import type { Page, Locator } from '@playwright/test';
import { BasePage } from './base_page';

export class NavPage extends BasePage {
	readonly nav: Locator;
	readonly map_link: Locator;
	readonly line_timetable_link: Locator;
	readonly station_timetable_link: Locator;

	constructor(page: Page) {
		super(page);
		this.nav                    = page.locator('nav.app-selector');
		this.map_link               = page.locator('a[href="/map"]');
		this.line_timetable_link    = page.locator('a[href="/line-timetable"]');
		this.station_timetable_link = page.locator('a[href="/station-timetable"]');
	}

	async click_map() {
		await this.map_link.click();
		await this.page.waitForURL(/\/map/);
	}

	async click_line_timetable() {
		await this.line_timetable_link.click();
		await this.page.waitForURL(/\/line-timetable/);
	}

	async click_station_timetable() {
		await this.station_timetable_link.click();
		await this.page.waitForURL(/\/station-timetable/);
	}

	async is_link_selected(link: Locator): Promise<boolean> {
		return link.evaluate(el => el.classList.contains('selected'));
	}
}
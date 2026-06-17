import { test, expect } from '../fixtures/index';

test.describe('top navigation', () => {
	test.afterEach(async ({ console_errors }) => {
		expect(
			console_errors,
			`unexpected console errors:\n${console_errors.join('\n')}`
		).toHaveLength(0);
	});

	test('nav bar is visible on load', async ({ nav }) => {
		await expect(nav.nav).toBeVisible();
		await expect(nav.map_link).toBeVisible();
		await expect(nav.line_timetable_link).toBeVisible();
		await expect(nav.station_timetable_link).toBeVisible();
	});

	test('navigates to /map and marks only map as selected', async ({ nav, page }) => {
		await nav.click_map();

		await expect(page).toHaveURL(/\/map/);
		expect(await nav.is_link_selected(nav.map_link)).toBe(true);
		expect(await nav.is_link_selected(nav.line_timetable_link)).toBe(false);
		expect(await nav.is_link_selected(nav.station_timetable_link)).toBe(false);
	});

	test('navigates to /line-timetable and marks only line timetable as selected', async ({ nav, page }) => {
		await nav.click_line_timetable();

		await expect(page).toHaveURL(/\/line-timetable/);
		expect(await nav.is_link_selected(nav.line_timetable_link)).toBe(true);
		expect(await nav.is_link_selected(nav.map_link)).toBe(false);
		expect(await nav.is_link_selected(nav.station_timetable_link)).toBe(false);
	});

	test('navigates to /station-timetable and marks only station timetable as selected', async ({ nav, page }) => {
		await nav.click_station_timetable();

		await expect(page).toHaveURL(/\/station-timetable/);
		expect(await nav.is_link_selected(nav.station_timetable_link)).toBe(true);
		expect(await nav.is_link_selected(nav.map_link)).toBe(false);
		expect(await nav.is_link_selected(nav.line_timetable_link)).toBe(false);
	});

	test('cycles through all nav items without errors', async ({ nav, page }) => {
		await nav.click_map();
		await expect(page).toHaveURL(/\/map/);

		await nav.click_line_timetable();
		await expect(page).toHaveURL(/\/line-timetable/);

		await nav.click_station_timetable();
		await expect(page).toHaveURL(/\/station-timetable/);

		// return to map confirms state resets correctly
		await nav.click_map();
		await expect(page).toHaveURL(/\/map/);
		expect(await nav.is_link_selected(nav.map_link)).toBe(true);
		expect(await nav.is_link_selected(nav.station_timetable_link)).toBe(false);
	});
});
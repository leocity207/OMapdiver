import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import Hamburger from '$lib/componants/hamburger.svelte';

describe('hamburger button', () => {
	it('active false', async () => {
		const hamburger_mock = render(Hamburger, {
			props: { active: false },
		});
		const button = hamburger_mock.getByRole('button');

		expect(button.classList.contains('active')).toBe(false);
		expect(button.getAttribute('aria-pressed')).toBe('false');

		await fireEvent.click(button);
		expect(button.classList.contains('active')).toBe(true);
		expect(button.getAttribute('aria-pressed')).toBe('true');

		await fireEvent.click(button);
		expect(button.classList.contains('active')).toBe(false);
		expect(button.getAttribute('aria-pressed')).toBe('false');
	});

	it('active true, title', async () => {
		const title = "this is a title";
		const hamburger_mock = render(Hamburger, {
			props: { active: true, title: title },
		});
		const button = hamburger_mock.getByRole('button');
		const div = hamburger_mock.container.querySelector('button > div');
		expect(div).toBeTruthy();

		expect(button.getAttribute('title')).toEqual(title);

		expect(button.classList.contains('active')).toBe(true);
		expect(button.getAttribute('aria-pressed')).toBe('true');

		await fireEvent.click(button)
		expect(button.classList.contains('active')).toBe(false);
		expect(button.getAttribute('aria-pressed')).toBe('false');
	});
});

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import Cross_Button from '$lib/componants/cross_button.svelte';

describe('cross button', () => {
	it('calls the provided click handler when clicked', async () => {
		const On_Click = vi.fn();
		const cross_button_mock = render(Cross_Button, {
			props: { onclick: On_Click },
		});

		const button = cross_button_mock.getByRole('button');
        expect(On_Click).toHaveBeenCalledTimes(0);
		await fireEvent.click(button);

		expect(On_Click).toHaveBeenCalledTimes(1);
	});
});

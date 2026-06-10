import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import TopPanel from '$lib/componants/top_panel.svelte';

describe('top panel', () => {
	it('On click', async () => {
		const { getByRole, getByText, container } = render(TopPanel, {
			props: {
				open: false,
				children: createRawSnippet(() => ({ render: () => '<div>Top panel child</div>' })),
			},
		});

		const button = getByRole('button');
		const content = getByText('Top panel child').parentElement;

		expect(button.getAttribute('aria-expanded')).toBe('false');
		expect(content?.hasAttribute('hidden')).toBe(true);

		await fireEvent.click(button);

		expect(button.getAttribute('aria-expanded')).toBe('true');
		expect(getByText('Top panel child').parentElement?.hasAttribute('hidden')).toBe(false);
	});
});

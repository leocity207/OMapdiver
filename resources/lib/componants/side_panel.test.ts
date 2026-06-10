import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Panel from '$lib/componants/side_panel.svelte';

const sides = ['left', 'right'] as const;

describe('panel', () => {
    for (const side of sides) {
        const Snippet = createRawSnippet(() => ({
            render: () => `<div>${side} panel content</div>`,
        }));

        describe(`side="${side}"`, () => {
            it('hidden', () => {
                const side_panel_mock= render(Panel, {
                    props: { open: false, side, children: Snippet },
                });

                const aside = side_panel_mock.container.querySelector('aside');
                const content = side_panel_mock.getByText(`${side} panel content`).parentElement;

                expect(aside?.classList.contains('open')).toBe(false);
                expect(aside?.classList.contains(side)).toBe(true);
                expect(content?.hasAttribute('hidden')).toBe(true);
            });

            it('visible', () => {
                const side_panel_mock = render(Panel, {
                    props: { open: true, side, children: Snippet },
                });

                const aside = side_panel_mock.container.querySelector('aside');
                const content = side_panel_mock.getByText(`${side} panel content`).parentElement;

                expect(aside?.classList.contains('open')).toBe(true);
                expect(aside?.classList.contains(side)).toBe(true);
                expect(content?.hasAttribute('hidden')).toBe(false);
            });
        });
    }

    it('defaults to side="left" when omitted', () => {
        const { container } = render(Panel, {
            props: {
                open: false,
                children: createRawSnippet(() => ({ render: () => '<div>x</div>' })),
            },
        });

        const aside = container.querySelector('aside');
        expect(aside?.classList.contains('left')).toBe(true);
    });
});
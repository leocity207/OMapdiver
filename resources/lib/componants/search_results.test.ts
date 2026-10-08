import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import Search_Results from "$lib/componants/search_results.svelte";

describe("search results component", () => {
	it("shows the empty-state label when there are no items", () => {
		const search_results_mock = render(Search_Results, {
			props: {
				items: [],
				current_focus: -1,
				search_text: "",
				on_select: vi.fn(),
				on_keydown: vi.fn(),
				empty_label: "No matching results",
			},
		});

		expect(search_results_mock.getByText("No matching results")).toBeTruthy();
	});

	it("renders a custom row snippet", () => {
		const items = [{ id: "station-a", label: "Station A", type: "station" }];
		const search_results_mock = render(Search_Results, {
			props: {
				items,
				current_focus: -1,
				search_text: "",
				on_select: vi.fn(),
				on_keydown: vi.fn(),
				row: createRawSnippet((get_item: () => { id: string; label: string }) => ({
					render: () => `<span>${get_item().label} custom row</span>`,
				})),
			},
		});

		expect(search_results_mock.getByText("Station A custom row")).toBeTruthy();
	});
});

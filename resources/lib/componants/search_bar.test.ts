import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/svelte";
import type { Search_Item } from "$lib/componants/search_bar.svelte";
import Search_Bar from "$lib/componants/search_bar.svelte";

const items = [
	{ label: "Station A", id: "station-a", type: "station" },
	{ label: "Station B", id: "station-b", type: "station" },
	{ label: "Line 1", id: "line-1", type: "line" },
] as Search_Item[];

describe("search bar component", () => {
	it("shows autocomplete click", async () => {
		const On_Select = vi.fn();
		const search_bar_mock = render(Search_Bar, {
			props: {
				placeholder: "Search",
				items,
				On_Select: On_Select,
			},
		});

		const input = search_bar_mock.getByPlaceholderText("Search") as HTMLInputElement;
		await fireEvent.focus(input);
		await fireEvent.input(input, { target: { value: "Station" } });

		const suggestions = search_bar_mock.getAllByRole("option");
		expect(suggestions.length).toBe(2);

		await fireEvent.click(suggestions[0]);
		expect(On_Select).toHaveBeenCalledWith(items[0]);
		expect(input.value).toBe("Station A");
	});

	it("show autocomplete keyboards", async () => {
		const On_Select = vi.fn();
		const search_bar_mock = render(Search_Bar, {
			props: {
				placeholder: "Search",
				items,
				On_Select: On_Select,
			},
		});

		const input = search_bar_mock.getByPlaceholderText("Search") as HTMLInputElement;
		await fireEvent.focus(input);
		await fireEvent.input(input, { target: { value: "Station" } });

		const options = search_bar_mock.getAllByRole("option");
		expect(options.length).toBe(2);

		await fireEvent.keyDown(input, { key: "ArrowDown" });
		await fireEvent.keyDown(input, { key: "Enter" });

		expect(On_Select).toHaveBeenCalledWith(items[0]);
		expect(input.value).toBe("Station A");
	});

	it("hides suggestions on Escape and Tab keys", async () => {
		const On_Select = vi.fn();
		const search_bar_mock = render(Search_Bar, {
			props: {
				placeholder: "Search",
				items,
				On_Select: On_Select,
			},
		});

		const input = search_bar_mock.getByPlaceholderText("Search") as HTMLInputElement;
		await fireEvent.focus(input);
		await fireEvent.input(input, { target: { value: "Station" } });

		expect(search_bar_mock.queryAllByRole("option").length).toBe(2);

		await fireEvent.keyDown(input, { key: "Escape" });
		expect(search_bar_mock.queryAllByRole("option").length).toBe(0);

		await fireEvent.focus(input);
		await fireEvent.input(input, { target: { value: "Station" } });
		await fireEvent.keyDown(input, { key: "Tab" });
		expect(search_bar_mock.queryAllByRole("option").length).toBe(0);
	});

	it("hides suggestions after blur timeout", async () => {
		vi.useFakeTimers();
		const On_Select = vi.fn();
		const search_bar_mock = render(Search_Bar, {
			props: {
				placeholder: "Search",
				items,
				On_Select: On_Select,
			},
		});

		const input = search_bar_mock.getByPlaceholderText("Search") as HTMLInputElement;
		await fireEvent.focus(input);
		await fireEvent.input(input, { target: { value: "Station" } });

		expect(search_bar_mock.queryAllByRole("option").length).toBe(2);

		await fireEvent.blur(input);
		vi.advanceTimersByTime(100);
		await Promise.resolve();

		expect(search_bar_mock.queryAllByRole("option").length).toBe(0);
		vi.useRealTimers();
	});

	it("pressing Enter when dropdown is closed sets focused to true", async () => {
		const search_bar_mock = render(Search_Bar, {
			props: { placeholder: "Search", items, On_Select: vi.fn() },
		});

		const input = search_bar_mock.getByPlaceholderText("Search") as HTMLInputElement;
		await fireEvent.keyDown(input, { key: "Enter" });
		expect(search_bar_mock.queryAllByRole("option").length).toBe(0);

		await fireEvent.input(input, { target: { value: "Station" } });
		expect(search_bar_mock.queryAllByRole("option").length).toBe(2);
	});

	it("pressing Enter when focused but no suggestions does nothing", async () => {
		const On_Select = vi.fn();
		const search_bar_mock = render(Search_Bar, {
			props: { placeholder: "Search", items, On_Select: On_Select },
		});

		const input = search_bar_mock.getByPlaceholderText("Search") as HTMLInputElement;
		await fireEvent.focus(input);
		await fireEvent.input(input, { target: { value: "ZZZZ" } });
		expect(search_bar_mock.queryAllByRole("option").length).toBe(0);

		await fireEvent.keyDown(input, { key: "Enter" });
		expect(On_Select).not.toHaveBeenCalled();
	});

	it("navigates up through suggestions with ArrowUp", async () => {
		const On_Select = vi.fn();
		const search_bar_mock = render(Search_Bar, {
			props: { placeholder: "Search", items, On_Select: On_Select },
		});

		const input = search_bar_mock.getByPlaceholderText("Search") as HTMLInputElement;
		await fireEvent.focus(input);
		await fireEvent.input(input, { target: { value: "Station" } });

		// Go down to index 0, then down to index 1, then up back to index 0
		await fireEvent.keyDown(input, { key: "ArrowDown" }); // → 0
		await fireEvent.keyDown(input, { key: "ArrowDown" }); // → 1
		await fireEvent.keyDown(input, { key: "ArrowUp" }); // → 0
		await fireEvent.keyDown(input, { key: "Enter" });

		expect(On_Select).toHaveBeenCalledWith(items[0]);
	});

	it("pressing Enter with no highlighted suggestion does not select", async () => {
		const On_Select = vi.fn();
		const search_bar_mock = render(Search_Bar, {
			props: { placeholder: "Search", items, On_Select: On_Select },
		});

		const input = search_bar_mock.getByPlaceholderText("Search") as HTMLInputElement;
		await fireEvent.focus(input);
		await fireEvent.input(input, { target: { value: "Station" } });

		await fireEvent.keyDown(input, { key: "Enter" });
		expect(On_Select).not.toHaveBeenCalled();
	});

	it("pressing a non-Enter key while dropdown is closed does nothing", async () => {
		const On_Select = vi.fn();
		const search_bar_mock = render(Search_Bar, {
			props: { placeholder: "Search", items, On_Select: On_Select },
		});

		const input = search_bar_mock.getByPlaceholderText("Search") as HTMLInputElement;
		await fireEvent.keyDown(input, { key: "ArrowDown" });

		expect(search_bar_mock.queryAllByRole("option").length).toBe(0);
		expect(On_Select).not.toHaveBeenCalled();
	});
});

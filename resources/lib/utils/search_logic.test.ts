import { describe, expect, it } from "vitest";
import { Create_Search_State } from "$lib/utils/search_logic.svelte";
import type { Search_Item } from "$lib/types/search_items";

const items: Search_Item[] = [
	{ label: "Station A", id: "station-a", type: "station" },
	{ label: "Station B", id: "station-b", type: "station" },
];

describe("search state", () => {
	it("updates focus through the exposed setter", () => {
		const search = Create_Search_State(() => items);

		search.focused = true;
		expect(search.focused).toBe(true);

		search.focused = false;
		expect(search.focused).toBe(false);
	});

	it("resets text, focus, and the highlighted result", () => {
		const search = Create_Search_State(() => items);
		search.search_text = "Station";
		search.Handle_Focus();
		search.Handle_Key_Down(new KeyboardEvent("keydown", { key: "ArrowDown" }), () => {});

		expect(search.current_focus).toBe(0);
		expect(search.filtered).toHaveLength(2);

		search.Reset();

		expect(search.search_text).toBe("");
		expect(search.focused).toBe(false);
		expect(search.current_focus).toBe(-1);
		expect(search.filtered).toHaveLength(0);
	});
});

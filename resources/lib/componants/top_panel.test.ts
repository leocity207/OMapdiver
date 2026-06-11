import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import Top_Panel from "$lib/componants/top_panel.svelte";

describe("top panel", () => {
	it("On click", async () => {
		const top_panel_mock = render(Top_Panel, {
			props: {
				open: false,
				children: createRawSnippet(() => ({ render: () => "<div>Top panel child</div>" })),
			},
		});

		const button = top_panel_mock.getByRole("button");
		const content = top_panel_mock.getByText("Top panel child").parentElement;

		expect(button.getAttribute("aria-expanded")).toBe("false");
		expect(content?.hasAttribute("hidden")).toBe(true);

		await fireEvent.click(button);

		expect(button.getAttribute("aria-expanded")).toBe("true");
		expect(
			top_panel_mock.getByText("Top panel child").parentElement?.hasAttribute("hidden")
		).toBe(false);
	});
});

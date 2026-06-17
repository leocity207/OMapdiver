import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/svelte";
import Expand_Button from "$lib/componants/expand_button.svelte";

describe("expand_button", () => {
	it("active false", async () => {
		const expand_button_mock = render(Expand_Button, {
			props: { active: false },
		});
		const button = expand_button_mock.getByRole("button");
		const div = expand_button_mock.container.querySelector("button > div");
		expect(div).toBeTruthy();

		expect(button.getAttribute("title")).toEqual("Expand");

		expect(button.getAttribute("aria-pressed")).toBe("false");
		expect(div!.classList.contains("plus")).toBe(true);

		await fireEvent.click(button);
		expect(button.getAttribute("aria-pressed")).toBe("true");
		expect(div!.classList.contains("minus")).toBe(true);

		await fireEvent.click(button);
		expect(button.getAttribute("aria-pressed")).toBe("false");
		expect(div!.classList.contains("plus")).toBe(true);
	});

	it("active true, title", async () => {
		const title = "this is a title";
		const expand_button_mock = render(Expand_Button, {
			props: { active: true, title: title },
		});
		const button = expand_button_mock.getByRole("button");
		const div = expand_button_mock.container.querySelector("button > div");
		expect(div).toBeTruthy();

		expect(button.getAttribute("title")).toEqual(title);

		expect(button.getAttribute("aria-pressed")).toBe("true");
		expect(div!.classList.contains("minus")).toBe(true);

		await fireEvent.click(button);
		expect(button.getAttribute("aria-pressed")).toBe("false");
		expect(div!.classList.contains("plus")).toBe(true);
	});
});

import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/svelte";
import Switch from "$lib/componants/switch.svelte";

describe("switch component", () => {
	it("checked state", async () => {
		const switch_mock = render(Switch, {
			props: { label: "Enable feature", checked: false },
		});

		const checkbox = switch_mock.getByRole("checkbox") as HTMLInputElement;
		expect(switch_mock.getByText("Enable feature")).toBeTruthy();
		expect(checkbox.checked).toBe(false);

		await fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(true);
	});

	it("label", async () => {
		const switch_mock = render(Switch, {
			props: { label: null, checked: false },
		});

		const checkbox = switch_mock.getByRole("checkbox") as HTMLInputElement;
		expect(checkbox.checked).toBe(false);
		await fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(true);
	});
});

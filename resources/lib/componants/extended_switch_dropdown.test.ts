import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/svelte";
import Extended_Pattern_Switch from "$lib/componants/extended_switch_dropdown.svelte";

const choices = [
	{ id: "all", label: "All" },
	{ id: "week", label: "Week" },
	{ id: "special", label: "Special", is_exceptional: true },
];

describe("pattern switch component", () => {
	it("default choice", () => {
		const eps_mock = render(Extended_Pattern_Switch, {
			props: {
				choices,
				default_choice: "week",
				On_Change: () => null,
			},
		});

		const normal_buttons = eps_mock.container.querySelectorAll(".switch-normal-option");
		expect(normal_buttons[0]?.textContent?.trim()).toBe("Week");
	});

	it("normal choice", async () => {
		const On_Change = vi.fn();
		const eps_mock = render(Extended_Pattern_Switch, {
			props: {
				choices,
				default_choice: "week",
				On_Change: On_Change,
			},
		});

		expect(On_Change).not.toHaveBeenCalled();
		await fireEvent.click(eps_mock.getByText("All"));
		expect(On_Change).toHaveBeenCalledWith("all");
	});

	it("special choice", async () => {
		const On_Change = vi.fn();
		const eps_mock = render(Extended_Pattern_Switch, {
			props: {
				choices,
				default_choice: "week",
				On_Change: On_Change,
			},
		});

		expect(On_Change).not.toHaveBeenCalled();
		const toggle_button = eps_mock.container.querySelector(
			".switch-special-toggle"
		) as HTMLElement;
		await fireEvent.click(toggle_button!);

		const special_option = eps_mock.container.querySelector(
			".switch-special-item"
		) as HTMLElement;
		await fireEvent.click(special_option!);

		expect(On_Change).toHaveBeenCalledWith("special");
		expect(special_option?.classList.contains("is-selected")).toBe(true);

		const indicator = eps_mock.container.querySelector(".switch-indicator") as HTMLElement;
		expect(indicator?.style.opacity).toBe("1");
		expect(indicator?.style.width).toBeTruthy();
		expect(indicator?.style.transform).toContain("translate3d");
	});

	it("click outside container", async () => {
		const On_Change = vi.fn();
		const eps_mock = render(Extended_Pattern_Switch, {
			props: {
				choices,
				default_choice: "week",
				On_Change: On_Change,
			},
		});

		const toggle_button = eps_mock.container.querySelector(
			".switch-special-toggle"
		) as HTMLElement;
		await fireEvent.click(toggle_button!);

		const menu = eps_mock.container.querySelector(".switch-special-menu") as HTMLElement;
		expect(menu?.classList.contains("open")).toBe(true);

		// Click on a child element within the container should NOT close menu
		const track = eps_mock.container.querySelector(".switch-track") as HTMLElement;
		await fireEvent.click(track);
		expect(menu?.classList.contains("open")).toBe(true);

		// Click outside container should close menu
		await fireEvent.click(document.body);
		expect(menu?.classList.contains("open")).toBe(false);
	});

	it("No choices", () => {
		const eps_mock = render(Extended_Pattern_Switch, {
			props: {
				choices: [],
				default_choice: "",
				On_Change: vi.fn(),
			},
		});

		const indicator = eps_mock.container.querySelector(".switch-indicator") as HTMLElement;
		expect(indicator?.style.opacity).toBe("0");
	});

	it("No special choices", async () => {
		const normal_only_choices = [
			{ id: "all", label: "All" },
			{ id: "week", label: "Week" },
			{ id: "custom", label: "Custom" },
		];
		const On_Change = vi.fn();
		const eps_mock = render(Extended_Pattern_Switch, {
			props: {
				choices: normal_only_choices,
				default_choice: "week",
				On_Change: On_Change,
			},
		});

		// Verify normal buttons are present
		const normal_buttons = eps_mock.container.querySelectorAll(".switch-normal-option");
		expect(normal_buttons.length).toBe(3);
		expect(normal_buttons[0]?.textContent?.trim()).toBe("Week");

		// Verify special toggle is NOT present
		const special_toggle = eps_mock.container.querySelector(".switch-special-toggle");
		expect(special_toggle).toBeNull();

		// Verify special menu is NOT present
		const special_menu = eps_mock.container.querySelector(".switch-special-menu");
		expect(special_menu).toBeNull();

		// Verify selecting a normal choice still works
		await fireEvent.click(eps_mock.getByText("All"));
		expect(On_Change).toHaveBeenCalledWith("all");
	});

	it("special choice as default", async () => {
		const On_Change = vi.fn();
		const eps_mock = render(Extended_Pattern_Switch, {
			props: {
				choices,
				default_choice: "special",
				On_Change: On_Change,
			},
		});

		// Verify special option is selected by default
		const special_toggle = eps_mock.container.querySelector(
			".switch-special-toggle"
		) as HTMLElement;
		expect(special_toggle?.classList.contains("is-selected")).toBe(true);

		// Verify indicator is positioned on the special toggle button
		const indicator = eps_mock.container.querySelector(".switch-indicator") as HTMLElement;
		expect(indicator?.style.opacity).toBe("1");
		expect(indicator?.style.width).toBeTruthy();
		expect(indicator?.style.transform).toContain("translate3d");

		// Verify selecting a normal choice moves indicator to that button
		await fireEvent.click(eps_mock.getByText("Week"));
		expect(On_Change).toHaveBeenCalledWith("week");
		expect(special_toggle?.classList.contains("is-selected")).toBe(false);
		const normal_button = eps_mock.container.querySelector(
			".switch-normal-option.is-selected"
		) as HTMLElement;
		expect(normal_button?.textContent?.trim()).toBe("Week");
	});
});

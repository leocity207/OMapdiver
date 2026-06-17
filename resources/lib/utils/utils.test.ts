import { describe, expect, it } from "vitest";
import Utils from "./utils";

describe("Rgba_To_Hex", () => {
	it("returns an existing hex color unchanged", () => {
		expect(Utils.Rgba_To_Hex("#1234FE")).toBe("#1234FE");
	});

	it("converts an rgb color to uppercase hexadecimal", () => {
		expect(Utils.Rgba_To_Hex("rgb(255, 0, 128)")).toBe("#FF0080");
	});

	it("converts an rgba color and ignores alpha channel", () => {
		expect(Utils.Rgba_To_Hex("rgba(255, 0, 128, 0.5)")).toBe("#FF0080");
	});

	it("returns an empty string when the input is not a valid rgb color", () => {
		expect(Utils.Rgba_To_Hex("banana")).toBe("");
	});
});

describe("Round_Bound", () => {
	it("returns the value when already inside bounds", () => {
		expect(Utils.Round_Bound(5, 0, 10)).toBe(5);
	});

	it("clamps values below the minimum", () => {
		expect(Utils.Round_Bound(-5, 0, 10)).toBe(0);
	});

	it("clamps values above the maximum", () => {
		expect(Utils.Round_Bound(15, 0, 10)).toBe(10);
	});
});

describe("Get_First_Part", () => {
	it("returns the first two segments of a longer identifier", () => {
		expect(Utils.Get_First_Part("abc-def-ghi")).toBe("abc-def");
	});

	it("returns a two segment identifier unchanged", () => {
		expect(Utils.Get_First_Part("abc-def")).toBe("abc-def");
	});

	it("returns the original string when no separator exists", () => {
		expect(Utils.Get_First_Part("abcdef")).toBe("abcdef");
	});
});

describe("Format_Minute", () => {
	it("formats durations shorter than one hour", () => {
		expect(Utils.Format_Minute(300)).toBe(":05");
	});

	it("formats durations longer than one hour", () => {
		expect(Utils.Format_Minute(3660)).toBe("1:01");
	});

	it("formats negative durations", () => {
		expect(Utils.Format_Minute(-300)).toBe("-:05");
	});

	it("formats negative durations longer than one hour", () => {
		expect(Utils.Format_Minute(-3660)).toBe("-1:01");
	});
});

describe("Lighten_Color", () => {
	it("lightens a color using the default percentage", () => {
		expect(Utils.Lighten_Color("#000000")).toBe("rgb(217, 217, 217)");
	});

	it("supports a custom percentage", () => {
		expect(Utils.Lighten_Color("#000000", 0.5)).toBe("rgb(128, 128, 128)");
	});

	it("returns white when lightening white", () => {
		expect(Utils.Lighten_Color("#FFFFFF")).toBe("rgb(255, 255, 255)");
	});
});

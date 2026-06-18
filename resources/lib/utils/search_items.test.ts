import { describe, it, expect } from "vitest";
import {
	Get_Line_Search_Items,
	Get_Station_Search_Items,
	Get_All_Search_Items,
} from "./search_items";
import type { Network } from "$lib/types/network";

const mock_lines: Network["lines"] = {
	l1: {
		id: "l1",
		label: "Zephyr",
		icon: "",
		url: "",
		color: {},
		info_messages: [],
		stations: [],
		patterns: [],
		timetables: [],
	},
	l2: {
		id: "l2",
		label: "Apollo",
		icon: "",
		url: "",
		color: {},
		info_messages: [],
		stations: [],
		patterns: [],
		timetables: [],
	},
	l3: {
		id: "l3",
		label: "Mercury",
		icon: "",
		url: "",
		color: {},
		info_messages: [],
		stations: [],
		patterns: [],
		timetables: [],
	},
};

const mock_stations: Network["stations"] = {
	s1: {
		id: "s1",
		label: "Central",
		url: "",
		lines: [],
		directions: {},
		have_disabled_equipment: undefined,
		have_bike_parking: undefined,
		have_car_parking: undefined,
		have_car_sharing: undefined,
		opening_time: undefined,
		closing_time: undefined,
		parent: null,
	},
	s2: {
		id: "s2",
		label: "Airport",
		url: "",
		lines: [],
		directions: {},
		have_disabled_equipment: undefined,
		have_bike_parking: undefined,
		have_car_parking: undefined,
		have_car_sharing: undefined,
		opening_time: undefined,
		closing_time: undefined,
		parent: null,
	},
};

describe("Get_Line_Search_Items", () => {
	it("maps lines to search items with correct shape", () => {
		const result = Get_Line_Search_Items(mock_lines);
		expect(result[0]).toEqual({ id: "l2", label: "Apollo", type: "line" });
	});

	it("returns only line types", () => {
		const result = Get_Line_Search_Items(mock_lines);
		expect(result.every((item) => item.type === "line")).toBe(true);
	});

	it("sorts alphabetically by label", () => {
		const result = Get_Line_Search_Items(mock_lines);
		const labels = result.map((i) => i.label);
		expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)));
	});

	it("returns empty array for empty input", () => {
		expect(Get_Line_Search_Items({})).toEqual([]);
	});
});

describe("Get_Station_Search_Items", () => {
	it("maps stations to search items with correct shape", () => {
		const result = Get_Station_Search_Items(mock_stations);
		expect(result[0]).toEqual({ id: "s2", label: "Airport", type: "station" });
	});

	it("returns only station types", () => {
		const result = Get_Station_Search_Items(mock_stations);
		expect(result.every((item) => item.type === "station")).toBe(true);
	});

	it("sorts alphabetically by label", () => {
		const result = Get_Station_Search_Items(mock_stations);
		const labels = result.map((i) => i.label);
		expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)));
	});

	it("returns empty array for empty input", () => {
		expect(Get_Station_Search_Items({})).toEqual([]);
	});
});

describe("Get_All_Search_Items", () => {
	it("combines lines and stations", () => {
		const result = Get_All_Search_Items({ lines: mock_lines, stations: mock_stations });
		const types = result.map((i) => i.type);
		expect(types).toContain("line");
		expect(types).toContain("station");
		expect(result.length).toBe(
			Object.keys(mock_lines).length + Object.keys(mock_stations).length
		);
	});

	it("sorts all items alphabetically by label", () => {
		const result = Get_All_Search_Items({ lines: mock_lines, stations: mock_stations });
		const labels = result.map((i) => i.label);
		expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)));
	});

	it("returns empty array when both are empty", () => {
		expect(Get_All_Search_Items({ lines: {}, stations: {} })).toEqual([]);
	});

	it("works with only lines and no stations", () => {
		const result = Get_All_Search_Items({ lines: mock_lines, stations: {} });
		expect(result.every((i) => i.type === "line")).toBe(true);
	});

	it("works with only stations and no lines", () => {
		const result = Get_All_Search_Items({ lines: {}, stations: mock_stations });
		expect(result.every((i) => i.type === "station")).toBe(true);
	});
});

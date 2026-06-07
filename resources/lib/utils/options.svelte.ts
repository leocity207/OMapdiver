import { setContext, getContext } from "svelte";
import type {
	Global_Options,
	Map_Options,
	Line_Timetable_Options,
	Station_Timetable_Options,
} from "$lib/types/options";

const GLOBAL_OPTIONS_KEY = Symbol("GLOBAL_OPTIONS");
const MAP_OPTIONS_KEY = Symbol("MAP_OPTIONS");
const LINE_TIMETABLE_OPTIONS_KEY = Symbol("LINE_TIMETABLE_OPTIONS");
const STATION_TIMETABLE_OPTIONS_KEY = Symbol("STATION_TIMETABLE_OPTIONS");

export function Set_Global_Options(update: Global_Options): void {
	setContext<Global_Options>(GLOBAL_OPTIONS_KEY, update);
}

export function Set_Map_Options(update: Map_Options): void {
	setContext<Map_Options>(MAP_OPTIONS_KEY, update);
}

export function Set_Line_Timetable_Options(update: Line_Timetable_Options): void {
	setContext<Line_Timetable_Options>(LINE_TIMETABLE_OPTIONS_KEY, update);
}

export function Set_Station_Timetable_Options(update: Station_Timetable_Options): void {
	setContext<Station_Timetable_Options>(STATION_TIMETABLE_OPTIONS_KEY, update);
}

export function Get_Global_Options(): Global_Options {
	let options = getContext<Global_Options>(GLOBAL_OPTIONS_KEY);
	if (!options) {
		let options2 = $state({
			easy_color_mode: false,
		});
		setContext(GLOBAL_OPTIONS_KEY, options2);
		return options2;
	}
	return options;
}

export function Get_Map_Options(): Map_Options {
	return getContext<Map_Options>(MAP_OPTIONS_KEY);
}

export function Get_Line_Timetable_Options(): Line_Timetable_Options {
	let options = getContext<Line_Timetable_Options>(LINE_TIMETABLE_OPTIONS_KEY);
	if (!options) {
		let options2 = $state({
			selected_calendar_pattern: "all",
			selected_stop_pattern: "all",
			show_hidden_stations: false,
			first_last_mode: false,
			show_arrival_times: false,
		});
		setContext(LINE_TIMETABLE_OPTIONS_KEY, options2);
		return options2;
	}
	return options;
}

export function Get_Station_Timetable_Options(): Station_Timetable_Options {
	let options = getContext<Station_Timetable_Options>(STATION_TIMETABLE_OPTIONS_KEY);
	if (!options) {
		let option2s = $state({
			selected_calendar_pattern: "all",
			selected_stop_pattern: "all",
			show_arrival_times: false,
			display_mode: "hourly",
			group_by_direction: false,
		});
		setContext(STATION_TIMETABLE_OPTIONS_KEY, option2s);
		return option2s;
	}
	return options;
}

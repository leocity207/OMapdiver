import { setContext, getContext } from 'svelte';
import type { Global_Options, Map_Options, Line_Timetable_Options, Station_Timetable_Options } from '$lib/types/options';

const GLOBAL_OPTIONS_KEY = Symbol('GLOBAL_OPTIONS');
const MAP_OPTIONS_KEY = Symbol('MAP_OPTIONS');
const LINE_TIMETABLE_OPTIONS_KEY = Symbol('LINE_TIMETABLE_OPTIONS');
const STATION_TIMETABLE_OPTIONS_KEY = Symbol('STATION_TIMETABLE_OPTIONS');


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
	return getContext<Global_Options>(GLOBAL_OPTIONS_KEY);
}

export function Get_Map_Options(): Map_Options {
	return getContext<Map_Options>(MAP_OPTIONS_KEY);
}

export function Get_Line_Timetable_Options(): Line_Timetable_Options {
	return getContext<Line_Timetable_Options>(LINE_TIMETABLE_OPTIONS_KEY);
}	

export function Get_Station_Timetable_Options(): Station_Timetable_Options {
	return getContext<Station_Timetable_Options>(STATION_TIMETABLE_OPTIONS_KEY);
}	
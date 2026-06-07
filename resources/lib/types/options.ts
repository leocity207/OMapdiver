export interface Global_Options {
	easy_color_mode: boolean;
}

export interface Map_Options {}

export interface Line_Timetable_Options {
	selected_calendar_pattern: "all" | string;
	selected_stop_pattern: "all" | string;
	first_last_mode: boolean;
	show_arrival_times: boolean;
	show_hidden_stations?: boolean;
}

export interface Station_Timetable_Options {
	selected_calendar_pattern: "all" | string;
	selected_stop_pattern: "all" | string;
	show_arrival_times: boolean;
}

export interface Global_Options {
	easy_color_mode: boolean;
}

export interface Map_Options {

}

export interface Line_Timetable_Options {
	selected_calendar_pattern: 'all' | string;
	selected_stop_pattern: 'all' | string;
	force_show_all_stations: boolean;
	first_last_departure_mode: boolean;
	show_arrival_times: boolean;
}

export interface Station_Timetable_Options {
	selected_calendar_pattern: 'all' | string;
	selected_stop_pattern: 'all' | string;
	show_arrival_times: boolean;
	display_mode: 'hourly' | 'list';
	group_by_direction: boolean;
}
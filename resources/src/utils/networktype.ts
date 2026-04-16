export interface Pattern_Schemes {	
	id : string,
	label: string,
	is_exceptional : boolean,
}

export interface Territorry {
	id: string,
	label: string,
}

export interface Stop_Patterns {
	id : string,
	label : string,
	level: number,
	variant: string[],
	is_exceptional : boolean,
	color : string,
	icon : string
}

export interface Station {
	id: string,
	label: string,
	url: string,
	lines: string[],
	directions: {[index: string]: string};
	have_disabled_equipment: boolean | undefined,
	have_bike_parking: boolean | undefined,
	have_car_parking: boolean | undefined,
	have_car_sharing: boolean | undefined,
	opening_hour: number | undefined,
	closing_hour: number | undefined
	parent: any
}

export interface Organiser {
	id: string,
	label: string,
}

export interface Operators {
	id: string,
	label: string,
}

export interface InfoMessage {
	index: number | null,
	level: number,
	message: string
}

export interface Pattern {
	id: string,
	label: string,
	interval_minutes: number,
	departure_minute: number,
	first_departure: string,
	last_departure: string,
	stop_pattern: string,
	is_reversed : boolean,
	info_messages: InfoMessage[],
	arrival_minutes: (number | null)[],
	departure_minutes: (number | null)[],
	parent: any
}

export interface Timetable {
		id: string,
		label: string,
		stop_pattern: string,
		calendar_pattern: string,
		info_messages: InfoMessage[],
		arrival_minutes: (number | null)[],
		departure_minutes: (number | null)[]
}

export interface Line {
	id: string,
	label: string,
	url: string,
	color: {[index: string]: string},
	info_messages: InfoMessage[],
	icon: string,
	stations: string[],
	patterns: Pattern[],
	timetables: Timetable[]
}

export interface Landmark {
	id: string,
	label: string,
}

export interface Calendar_Pattern {	
	id : string,
	label: string,
	is_exceptional : boolean,
	info: string | null,
	icon: string | null,
}

export interface Network {
	calendar_patterns: {[index: string]: Calendar_Pattern},
	landmarks :        {[index: string]: Landmark},
	lines:             {[index: string]: Line},
	stations:          {[index: string]: Station},
	operator :         {[index: string]: Operators},
	organiser :        {[index: string]: Organiser},
	stop_patterns :    {[index: string]: Stop_Patterns},
	territories:       {[index: string]: Territorry},
}

-- territories
CREATE TABLE IF NOT EXISTS territories (
	id    text PRIMARY KEY,
	label text NOT NULL
);

-- organisers
CREATE TABLE IF NOT EXISTS organisers (
	id    text PRIMARY KEY,
	label text NOT NULL
);

-- operators
CREATE TABLE IF NOT EXISTS operators (
	id    text PRIMARY KEY,
	label text NOT NULL
);

-- landmarks
CREATE TABLE IF NOT EXISTS landmarks (
	id    text PRIMARY KEY,
	label text NOT NULL
);

-- Calendar Patterns
CREATE TABLE IF NOT EXISTS calendar_patterns (
	id             text PRIMARY KEY,
	label          text NOT NULL,
	is_exceptional boolean NOT NULL DEFAULT false,
	info           text NULL,
	icon           text NULL
);

-- stop_patterns
CREATE TABLE IF NOT EXISTS stop_patterns (
	id             text PRIMARY KEY,
	label          text NOT NULL,
	level          integer NOT NULL,
	is_exceptional boolean NOT NULL DEFAULT false,
	color          text NOT NULL,
	icon           text NOT NULL
	-- stop_pattern_variants
);

CREATE TABLE IF NOT EXISTS stop_pattern_variants (
	stop_pattern_id text    NOT NULL REFERENCES stop_patterns(id) ON DELETE CASCADE,
	position        integer NOT NULL,
	variant         text    NOT NULL,
	PRIMARY KEY (stop_pattern_id, position)
);

-- stations
CREATE TABLE IF NOT EXISTS stations (
	id                    text PRIMARY KEY,
	label                 text NOT NULL,
	url                   text NOT NULL,
	have_disabled_equipment boolean NULL,
	have_bike_parking       boolean NULL,
	have_car_parking        boolean NULL,
	have_car_sharing        boolean NULL,
	opening_hour          smallint NULL,
	closing_hour          smallint NULL,
	CONSTRAINT stations_opening_hour_chk CHECK (opening_hour IS NULL OR opening_hour BETWEEN 0 AND 86400),
	CONSTRAINT stations_closing_hour_chk CHECK (closing_hour IS NULL OR closing_hour BETWEEN 0 AND 86400)
	-- station_directions
	-- line_stations
);

CREATE TABLE IF NOT EXISTS station_directions (
	station_id     text NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
	direction_key  text NOT NULL,
	direction_value text NOT NULL,
	PRIMARY KEY (station_id, direction_key)
);

-- lines
CREATE TABLE IF NOT EXISTS lines (
	id    text PRIMARY KEY,
	label text NOT NULL,
	url   text NOT NULL,
	icon  text NOT NULL
	-- line_colors (object)
	-- line_stations (list)
	-- patterns (list)
	-- timetable (list)
	-- line_info_messages (list)
);

CREATE TABLE IF NOT EXISTS line_colors (
	line_id      text NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
	color_key    text NOT NULL,
	color_value   text NOT NULL,
	PRIMARY KEY (line_id, color_key)
);

CREATE TABLE IF NOT EXISTS line_stations (
	line_id    text    NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
	station_id  text    NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
	position    integer NOT NULL,
	PRIMARY KEY (line_id, position),
	UNIQUE (line_id, station_id)
);

CREATE TABLE IF NOT EXISTS patterns (
	id                  text PRIMARY KEY,
	line_id             text NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
	label               text NOT NULL,
	interval_minutes    integer NOT NULL,
	departure_minute    integer NOT NULL,
	first_departure     text NOT NULL,
	last_departure      text NOT NULL,
	stop_pattern_id     text NOT NULL REFERENCES stop_patterns(id) ON DELETE RESTRICT,
	is_reversed         boolean NOT NULL DEFAULT false,
	position            integer NOT NULL DEFAULT 0
	-- pattern_info_messages (list)
	-- pattern_times (list)
);

CREATE TABLE IF NOT EXISTS pattern_info_messages (
	pattern_id    text    NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
	position      integer NOT NULL,
	message_index integer NULL,
	level         integer NOT NULL,
	message       text    NOT NULL,
	PRIMARY KEY (pattern_id, position)
);

CREATE TABLE IF NOT EXISTS pattern_times (
	pattern_id        text    NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
	position          integer NOT NULL,
	arrival_minute    integer NULL,
	departure_minute  integer NULL,
	PRIMARY KEY (pattern_id, position)
);

CREATE TABLE IF NOT EXISTS timetables (
	id                  text PRIMARY KEY,
	line_id             text NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
	label               text NOT NULL,
	stop_pattern_id     text NOT NULL REFERENCES stop_patterns(id) ON DELETE RESTRICT,
	calendar_pattern_id text NOT NULL REFERENCES calendar_patterns(id) ON DELETE RESTRICT,
	position            integer NOT NULL DEFAULT 0
	-- timetable info message (list)
	-- timetable_times (list)
);

CREATE TABLE IF NOT EXISTS timetable_info_messages (
	timetable_id  text    NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
	position      integer NOT NULL,
	message_index integer NULL,
	level         integer NOT NULL,
	message       text    NOT NULL,
	PRIMARY KEY (timetable_id, position)
);

CREATE TABLE IF NOT EXISTS timetable_times (
	timetable_id      text    NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
	position          integer NOT NULL,
	arrival_minute    integer NULL,
	departure_minute  integer NULL,
	PRIMARY KEY (timetable_id, position)
);

CREATE TABLE IF NOT EXISTS line_info_messages (
	line_id       text    NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
	position      integer NOT NULL,
	message_index integer NULL,
	level         integer NOT NULL,
	message       text    NOT NULL,
	PRIMARY KEY (line_id, position)
);

CREATE INDEX IF NOT EXISTS idx_stations_parent_station_id ON stations(parent_station_id);
CREATE INDEX IF NOT EXISTS idx_station_directions_station_id ON station_directions(station_id);
CREATE INDEX IF NOT EXISTS idx_line_stations_station_id ON line_stations(station_id);
CREATE INDEX IF NOT EXISTS idx_patterns_line_id ON patterns(line_id);
CREATE INDEX IF NOT EXISTS idx_patterns_stop_pattern_id ON patterns(stop_pattern_id);
CREATE INDEX IF NOT EXISTS idx_timetables_line_id ON timetables(line_id);
CREATE INDEX IF NOT EXISTS idx_timetables_stop_pattern_id ON timetables(stop_pattern_id);
CREATE INDEX IF NOT EXISTS idx_timetables_calendar_pattern_id ON timetables(calendar_pattern_id);
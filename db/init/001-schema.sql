
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
	icon           text NOT NULL,
	variant        text[] NULL
);

-- stations
CREATE TABLE IF NOT EXISTS stations (
	id                    text PRIMARY KEY,
	label                 text NOT NULL,
	url                   text NOT NULL,
	lines                 text[] NOT NULL,
	have_disabled_equipment boolean NULL,
	have_bike_parking       boolean NULL,
	have_car_parking        boolean NULL,
	have_car_sharing        boolean NULL,
	opening_time            integer NULL,
	closing_time            integer NULL,
	directions              jsonb NOT NULL,
	CONSTRAINT stations_opening_time_chk CHECK (opening_time IS NULL OR opening_time BETWEEN 0 AND 86400),
	CONSTRAINT stations_closing_time_chk CHECK (closing_time IS NULL OR closing_time BETWEEN 0 AND 86400)
	-- line_stations
);

-- lines
CREATE TABLE IF NOT EXISTS lines (
	id    text PRIMARY KEY,
	label text NOT NULL,
	url   text NOT NULL,
	icon  text NOT NULL,
	stations text[] NOT NULL,
	color jsonb NOT NULL
	-- patterns (list)
	-- timetable (list)
	-- info_messages (list)
);

CREATE TABLE IF NOT EXISTS patterns (
	id                  text PRIMARY KEY,
	line_id             text NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
	label               text NOT NULL,
	interval_time    integer NOT NULL,
	departure_time    integer NOT NULL,
	first_departure     text NOT NULL,
	last_departure      text NOT NULL,
	stop_pattern     text NOT NULL REFERENCES stop_patterns(id) ON DELETE RESTRICT,
	is_reversed         boolean NOT NULL DEFAULT false,
	arrival_times     integer[],
	departure_times   integer[]
	-- pattern_info_messages (list)
);

CREATE TABLE IF NOT EXISTS timetables (
	id                  text PRIMARY KEY,
	line_id             text NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
	label               text NOT NULL,
	stop_pattern     text NOT NULL REFERENCES stop_patterns(id) ON DELETE RESTRICT,
	calendar_pattern text NOT NULL REFERENCES calendar_patterns(id) ON DELETE RESTRICT,
	arrival_times     integer[],
	departure_times   integer[]
	-- timetable info message (list)
);

CREATE TABLE IF NOT EXISTS info_messages (
    info_message_id text PRIMARY KEY,

    line_id      text REFERENCES lines(id) ON DELETE CASCADE,
    pattern_id   text REFERENCES patterns(id) ON DELETE CASCADE,
    timetable_id text REFERENCES timetables(id) ON DELETE CASCADE,

    index integer NULL,
    level integer NOT NULL,
    message text NOT NULL,
	UNIQUE (line_id, pattern_id, timetable_id, info_message_id),

    CONSTRAINT one_parent_check CHECK (
        (line_id IS NOT NULL AND pattern_id IS NULL AND timetable_id IS NULL) OR
        (line_id IS NULL AND pattern_id IS NOT NULL AND timetable_id IS NULL) OR
        (line_id IS NULL AND pattern_id IS NULL AND timetable_id IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_patterns_line_id ON patterns(line_id);
CREATE INDEX IF NOT EXISTS idx_patterns_stop_pattern ON patterns(stop_pattern);
CREATE INDEX IF NOT EXISTS idx_timetables_line_id ON timetables(line_id);
CREATE INDEX IF NOT EXISTS idx_timetables_stop_pattern ON timetables(stop_pattern);
CREATE INDEX IF NOT EXISTS idx_timetables_calendar_pattern ON timetables(calendar_pattern);
CREATE INDEX IF NOT EXISTS idx_stations_label ON stations(label);
CREATE INDEX IF NOT EXISTS idx_lines_label ON lines(label);
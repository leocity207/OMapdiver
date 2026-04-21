
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
	opening_hour          integer NULL,
	closing_hour          integer NULL,
	directions   jsonb NOT NULL,
	CONSTRAINT stations_opening_hour_chk CHECK (opening_hour IS NULL OR opening_hour BETWEEN 0 AND 86400),
	CONSTRAINT stations_closing_hour_chk CHECK (closing_hour IS NULL OR closing_hour BETWEEN 0 AND 86400)
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
	interval_minutes    integer NOT NULL,
	departure_minute    integer NOT NULL,
	first_departure     text NOT NULL,
	last_departure      text NOT NULL,
	stop_pattern_id     text NOT NULL REFERENCES stop_patterns(id) ON DELETE RESTRICT,
	is_reversed         boolean NOT NULL DEFAULT false,
	arrival_minutes     integer[],
	departure_minutes   integer[]
	-- pattern_info_messages (list)
);

CREATE TABLE IF NOT EXISTS timetables (
	id                  text PRIMARY KEY,
	line_id             text NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
	label               text NOT NULL,
	stop_pattern_id     text NOT NULL REFERENCES stop_patterns(id) ON DELETE RESTRICT,
	calendar_pattern_id text NOT NULL REFERENCES calendar_patterns(id) ON DELETE RESTRICT,
	arrival_minutes     integer[],
	departure_minutes   integer[]
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
CREATE INDEX IF NOT EXISTS idx_patterns_stop_pattern_id ON patterns(stop_pattern_id);
CREATE INDEX IF NOT EXISTS idx_timetables_line_id ON timetables(line_id);
CREATE INDEX IF NOT EXISTS idx_timetables_stop_pattern_id ON timetables(stop_pattern_id);
CREATE INDEX IF NOT EXISTS idx_timetables_calendar_pattern_id ON timetables(calendar_pattern_id);
CREATE INDEX IF NOT EXISTS idx_stations_label ON stations(label);
CREATE INDEX IF NOT EXISTS idx_lines_label ON lines(label);
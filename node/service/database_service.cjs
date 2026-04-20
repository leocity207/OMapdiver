const { Pool } = require('pg');
const Config = require('../config.cjs');

function groupBy(rows, key) {
	const map = new Map();

	for (const row of rows) {
		const parentId = row[key];
		if (parentId == null) continue;

		if (!map.has(parentId)) {
			map.set(parentId, []);
		}
		map.get(parentId).push(row);
	}

	return map;
}

function mapInfoMessage(row) {
	return {
		index: row.message_index,
		level: row.level,
		message: row.message,
	};
}

function mapPattern(row, info_messages) {
	return {
		id: row.id,
		label: row.label,
		interval_minutes: row.interval_minutes,
		departure_minute: row.departure_minute,
		first_departure: row.first_departure,
		last_departure: row.last_departure,
		stop_pattern: row.stop_pattern_id,
		is_reversed: row.is_reversed,
		arrival_minutes: row.arrival_minutes,
		departure_minutes: row.departure_minutes,
		info_messages,
	};
}

function mapTimetable(row, info_messages) {
	return {
		id: row.id,
		label: row.label,
		stop_pattern: row.stop_pattern_id,
		calendar_pattern: row.calendar_pattern_id,
		arrival_minutes: row.arrival_minutes,
		departure_minutes: row.departure_minutes,
		info_messages,
	};
}

class DatabaseService {
	constructor() {
		this.pool = new Pool({
			host: Config.DB_HOST,
			port: Config.DB_PORT,
			database: Config.DB_NAME,
			user: Config.DB_USER,
			password: Config.DB_PASSWORD,
		});
	}

	async close() {
		await this.pool.end();
	}

	async query(text, params = []) {
		const result = await this.pool.query(text, params);
		return result.rows;
	}

	async Load_Network() {
		const [
			calendar_patterns,
			landmarks,
			lines,
			stations,
			operators,
			organisers,
			stop_patterns,
			territories,
			patterns,
			timetables,
			line_info_messages,
			pattern_info_messages,
			timetable_info_messages,
		] = await Promise.all([
			this.query(`
				SELECT id, label, is_exceptional, info, icon
				FROM calendar_patterns
				ORDER BY id
			`),

			this.query(`
				SELECT id, label
				FROM landmarks
				ORDER BY id
			`),

			this.query(`
				SELECT id, label, url, icon, stations, color
				FROM lines
				ORDER BY id
			`),

			this.query(`
				SELECT
					id,
					label,
					url,
					lines,
					directions,
					have_disabled_equipment,
					have_bike_parking,
					have_car_parking,
					have_car_sharing,
					opening_hour,
					closing_hour,
					parent
				FROM stations
				ORDER BY id
			`),

			this.query(`
				SELECT id, label
				FROM operators
				ORDER BY id
			`),

			this.query(`
				SELECT id, label
				FROM organisers
				ORDER BY id
			`),

			this.query(`
				SELECT id, label, level, is_exceptional, color, icon, variants
				FROM stop_patterns
				ORDER BY id
			`),

			this.query(`
				SELECT id, label
				FROM territories
				ORDER BY id
			`),

			this.query(`
				SELECT
					id,
					line_id,
					label,
					interval_minutes,
					departure_minute,
					first_departure,
					last_departure,
					stop_pattern_id,
					is_reversed,
					arrival_minutes,
					departure_minutes
				FROM patterns
				ORDER BY line_id, id
			`),

			this.query(`
				SELECT
					id,
					line_id,
					label,
					stop_pattern_id,
					calendar_pattern_id,
					arrival_minutes,
					departure_minutes
				FROM timetables
				ORDER BY line_id, id
			`),

			this.query(`
				SELECT line_id, message_index, level, message
				FROM info_messages
				WHERE line_id IS NOT NULL
				ORDER BY line_id, COALESCE(message_index, 2147483647), id
			`),

			this.query(`
				SELECT pattern_id, message_index, level, message
				FROM info_messages
				WHERE pattern_id IS NOT NULL
				ORDER BY pattern_id, COALESCE(message_index, 2147483647), id
			`),

			this.query(`
				SELECT timetable_id, message_index, level, message
				FROM info_messages
				WHERE timetable_id IS NOT NULL
				ORDER BY timetable_id, COALESCE(message_index, 2147483647), id
			`),
		]);

		const patternsByLine = groupBy(patterns, 'line_id');
		const timetablesByLine = groupBy(timetables, 'line_id');

		const lineInfoByLine = groupBy(line_info_messages, 'line_id');
		const patternInfoByPattern = groupBy(pattern_info_messages, 'pattern_id');
		const timetableInfoByTimetable = groupBy(timetable_info_messages, 'timetable_id');

		const fullLines = lines.map((line) => {
			const linePatterns = (patternsByLine.get(line.id) || []).map((p) =>
				mapPattern(
					p,
					(patternInfoByPattern.get(p.id) || []).map(mapInfoMessage)
				)
			);

			const lineTimetables = (timetablesByLine.get(line.id) || []).map((t) =>
				mapTimetable(
					t,
					(timetableInfoByTimetable.get(t.id) || []).map(mapInfoMessage)
				)
			);

			return {
				id: line.id,
				label: line.label,
				url: line.url,
				icon: line.icon,
				stations: line.stations,
				color: line.color,
				info_messages: (lineInfoByLine.get(line.id) || []).map(mapInfoMessage),
				patterns: linePatterns,
				timetables: lineTimetables,
			};
		});

		return {
			calendar_patterns,
			landmarks,
			lines: fullLines,
			stations,
			operator: operators,
			organiser: organisers,
			stop_patterns: stop_patterns.map((sp) => ({
				id: sp.id,
				label: sp.label,
				level: sp.level,
				variant: sp.variants || [],
				is_exceptional: sp.is_exceptional,
				color: sp.color,
				icon: sp.icon,
			})),
			territories,
		};
	}
}

module.exports = DatabaseService;
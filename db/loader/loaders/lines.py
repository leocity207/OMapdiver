from __future__ import annotations

from pathlib import Path
from typing import Mapping

from psycopg2.extensions import cursor as PGCursor

from common import Load_Index_List, Read_Json, Replace_Child_Rows, As_Text_List, As_JsonB, As_Int_List


def Load_Lines(cur: PGCursor, data_root: Path) -> None:
	index_file = data_root / "lines.json"
	folder = data_root / "lines"
	ids = Load_Index_List(index_file, "lines")

	for line_id in ids:
		data = Read_Json(folder / f"{line_id}.json")
		_Load_One_Line(cur, data)


def _Load_One_Line(cur: PGCursor, data: dict) -> None:
	_Upsert_Line(cur, data)
	_Load_Info_Messages(cur,  "line_id", data["id"], data)
	_Load_Patterns(cur, data)
	_Load_Timetables(cur, data)


def _Upsert_Line(cur: PGCursor, data: dict) -> None:
	cur.execute(
		"""
		INSERT INTO lines (
			id,
			label,
			url,
			icon,
			stations,
			color
		)
		VALUES (%s, %s, %s, %s, %s, %s)
		ON CONFLICT (id) DO UPDATE SET
			label = EXCLUDED.label,
			url = EXCLUDED.url,
			icon = EXCLUDED.icon,
			stations = EXCLUDED.stations,
			color = EXCLUDED.color
		""",
		(
			data["id"],
			data["label"],
			data.get("url", ""),
			data.get("icon", ""),
			As_Text_List(data["stations"]),
			As_JsonB(data["color"])
		),
	)

def _Load_Patterns(cur: PGCursor, data: dict) -> None:
	line_id = data["id"]
	Replace_Child_Rows(cur, "patterns", "line_id", line_id)
	patterns = data.get("patterns", [])

	if not isinstance(patterns, list):
		return

	for pattern in patterns:
		pattern_id = pattern["id"]

		cur.execute(
			"""
			INSERT INTO patterns (
				id,
				line_id,
				label,
				interval_time,
				departure_time,
				first_departure,
				last_departure,
				stop_pattern,
				is_reversed,
				arrival_times,
				departure_times

			)
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
			ON CONFLICT (id) DO UPDATE SET
				line_id = EXCLUDED.line_id,
				label = EXCLUDED.label,
				interval_time = EXCLUDED.interval_time,
				departure_time = EXCLUDED.departure_time,
				first_departure = EXCLUDED.first_departure,
				last_departure = EXCLUDED.last_departure,
				stop_pattern = EXCLUDED.stop_pattern,
				is_reversed = EXCLUDED.is_reversed,
				arrival_times = EXCLUDED.arrival_times,
				departure_times = EXCLUDED.departure_times
			""",
			(
				pattern_id,
				line_id,
				pattern["label"],
				int(pattern["interval_time"]),
				int(pattern["departure_time"]),
				pattern.get("first_departure", ""),
				pattern.get("last_departure", ""),
				pattern["stop_pattern"],
				bool(pattern.get("is_reversed", False)),
				As_Int_List(pattern["arrival_times"]),
				As_Int_List(pattern["departure_times"])
			),
		)

		_Load_Info_Messages(cur, "pattern_id", pattern_id, pattern)

def _Load_Timetables(cur: PGCursor, data: dict) -> None:
	line_id = data["id"]
	Replace_Child_Rows(cur, "timetables", "line_id", line_id)
	timetables = data.get("timetables", [])

	if not isinstance(timetables, list):
		return

	for timetable in timetables:
		timetable_id = timetable["id"]

		cur.execute(
			"""
			INSERT INTO timetables (
				id,
				line_id,
				label,
				stop_pattern,
				calendar_patterns,
				arrival_times,
				departure_times
			)
			VALUES (%s, %s, %s, %s, %s, %s, %s)
			ON CONFLICT (id) DO UPDATE SET
				line_id = EXCLUDED.line_id,
				label = EXCLUDED.label,
				stop_pattern = EXCLUDED.stop_pattern,
				calendar_patterns = EXCLUDED.calendar_patterns,
				arrival_times = EXCLUDED.arrival_times,
				departure_times = EXCLUDED.departure_times
			""",
			(
				timetable_id,
				line_id,
				timetable["label"],
				timetable["stop_pattern"],
				As_Text_List(timetable["calendar_patterns"]),
				As_Int_List(timetable["arrival_times"]),
				As_Int_List(timetable["departure_times"])
			),
		)

		_Load_Info_Messages(cur, "timetable_id", timetable_id, timetable)


def _Load_Info_Messages(cur: PGCursor, parent_column: str, parent_id: str, data: dict) -> None:
	# Remove existing children
	Replace_Child_Rows(cur, "info_messages", parent_column, parent_id)

	info_messages = data.get("info_messages", [])
	if not isinstance(info_messages, list):
		return

	for message in info_messages:
		message_index = message.get("index")
		level = int(message.get("level", 0))
		text = str(message.get("message", ""))
		info_id = message["id"]
		

		# Build query dynamically for the parent column
		query = f"""
			INSERT INTO info_messages (
				{parent_column},
				message_index,
				level,
				message,
				info_message_id
			)
			VALUES (%s, %s, %s, %s, %s)
		"""

		cur.execute(
			query,
			(
				parent_id,
				message_index,
				level,
				text,
				info_id
			),
		)
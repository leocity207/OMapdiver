from __future__ import annotations

from pathlib import Path
from typing import Mapping

from psycopg2.extensions import cursor as PGCursor

from json_loader.common import Load_Index_List, Read_Json, Replace_Child_Rows, Extract_Parent_ID


def Load_Lines(cur: PGCursor, data_root: Path) -> None:
    index_file = data_root / "lines.json"
    folder = data_root / "lines"
    ids = Load_Index_List(index_file, "lines")

    for position, line_id in enumerate(ids):
        data = Read_Json(folder / f"{line_id}.json")
        _Load_One_Line(cur, data, line_position=position)


def _Load_One_Line(cur: PGCursor, data: dict, line_position: int) -> None:
    line_id = data["id"]

    _Upsert_Line(cur, data)
    _Load_Line_Colors(cur, data)
    _Load_Line_Stations(cur, data)
    _Load_Line_Info_Messages(cur, data)
    _Load_Patterns(cur, data, line_position)
    _Load_Timetables(cur, data, line_position)


def _Upsert_Line(cur: PGCursor, data: dict) -> None:
    cur.execute(
        """
        INSERT INTO lines (id, label, url, icon)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            label = EXCLUDED.label,
            url = EXCLUDED.url,
            icon = EXCLUDED.icon
        """,
        (
            data["id"],
            data["label"],
            data.get("url", ""),
            data.get("icon", ""),
        ),
    )


def _Load_Line_Colors(cur: PGCursor, data: dict) -> None:
    line_id = data["id"]
    Replace_Child_Rows(cur, "line_colors", "line_id", line_id)

    colors = data.get("color", {})
    if isinstance(colors, Mapping):
        for color_key, color_value in colors.items():
            cur.execute(
                """
                INSERT INTO line_colors (line_id, color_key, color_value)
                VALUES (%s, %s, %s)
                """,
                (line_id, str(color_key), str(color_value)),
            )


def _Load_Line_Stations(cur: PGCursor, data: dict) -> None:
    line_id = data["id"]
    Replace_Child_Rows(cur, "line_stations", "line_id", line_id)

    stations = data.get("stations", [])
    if isinstance(stations, list):
        for position, station_id in enumerate(stations):
            cur.execute(
                """
                INSERT INTO line_stations (line_id, station_id, position)
                VALUES (%s, %s, %s)
                """,
                (line_id, str(station_id), position),
            )


def _Load_Line_Info_Messages(cur: PGCursor, data: dict) -> None:
    line_id = data["id"]
    Replace_Child_Rows(cur, "line_info_messages", "line_id", line_id)

    info_messages = data.get("info_messages", [])
    if isinstance(info_messages, list):
        for position, message in enumerate(info_messages):
            if isinstance(message, dict):
                message_index = message.get("index")
                level = int(message.get("level", 0))
                text = str(message.get("message", ""))
            else:
                message_index = None
                level = 0
                text = str(message)

            cur.execute(
                """
                INSERT INTO line_info_messages (line_id, position, message_index, level, message)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (line_id, position, message_index, level, text),
            )


def _Load_Patterns(cur: PGCursor, data: dict, line_position: int) -> None:
    line_id = data["id"]
    patterns = data.get("patterns", [])

    if not isinstance(patterns, list):
        return

    for pattern_position, pattern in enumerate(patterns):
        pattern_id = pattern["id"]

        cur.execute(
            """
            INSERT INTO patterns (
                id,
                line_id,
                label,
                interval_minutes,
                departure_minute,
                first_departure,
                last_departure,
                stop_pattern_id,
                is_reversed,
                parent_pattern_id,
                position
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                line_id = EXCLUDED.line_id,
                label = EXCLUDED.label,
                interval_minutes = EXCLUDED.interval_minutes,
                departure_minute = EXCLUDED.departure_minute,
                first_departure = EXCLUDED.first_departure,
                last_departure = EXCLUDED.last_departure,
                stop_pattern_id = EXCLUDED.stop_pattern_id,
                is_reversed = EXCLUDED.is_reversed,
                parent_pattern_id = EXCLUDED.parent_pattern_id,
                position = EXCLUDED.position
            """,
            (
                pattern_id,
                line_id,
                pattern["label"],
                int(pattern["interval_minutes"]),
                int(pattern["departure_minute"]),
                pattern.get("first_departure", ""),
                pattern.get("last_departure", ""),
                pattern["stop_pattern"],
                bool(pattern.get("is_reversed", False)),
                Extract_Parent_ID(pattern.get("parent")),
                pattern_position,
            ),
        )

        _load_pattern_info_messages(cur, pattern_id, pattern)
        _load_pattern_times(cur, pattern_id, pattern)


def _load_pattern_info_messages(cur: PGCursor, pattern_id: str, pattern: dict) -> None:
    Replace_Child_Rows(cur, "pattern_info_messages", "pattern_id", pattern_id)

    info_messages = pattern.get("info_messages", [])
    if isinstance(info_messages, list):
        for position, message in enumerate(info_messages):
            if isinstance(message, dict):
                message_index = message.get("index")
                level = int(message.get("level", 0))
                text = str(message.get("message", ""))
            else:
                message_index = None
                level = 0
                text = str(message)

            cur.execute(
                """
                INSERT INTO pattern_info_messages (pattern_id, position, message_index, level, message)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (pattern_id, position, message_index, level, text),
            )


def _load_pattern_times(cur: PGCursor, pattern_id: str, pattern: dict) -> None:
    Replace_Child_Rows(cur, "pattern_times", "pattern_id", pattern_id)

    arrivals = pattern.get("arrival_minutes", [])
    departures = pattern.get("departure_minutes", [])
    max_len = max(len(arrivals), len(departures))

    for position in range(max_len):
        arrival = arrivals[position] if position < len(arrivals) else None
        departure = departures[position] if position < len(departures) else None

        cur.execute(
            """
            INSERT INTO pattern_times (pattern_id, position, arrival_minute, departure_minute)
            VALUES (%s, %s, %s, %s)
            """,
            (
                pattern_id,
                position,
                None if arrival is None else int(arrival),
                None if departure is None else int(departure),
            ),
        )


def _Load_Timetables(cur: PGCursor, data: dict, line_position: int) -> None:
    line_id = data["id"]
    timetables = data.get("timetables", [])

    if not isinstance(timetables, list):
        return

    for timetable_position, timetable in enumerate(timetables):
        timetable_id = timetable["id"]

        cur.execute(
            """
            INSERT INTO timetables (
                id,
                line_id,
                label,
                stop_pattern_id,
                calendar_pattern_id,
                position
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                line_id = EXCLUDED.line_id,
                label = EXCLUDED.label,
                stop_pattern_id = EXCLUDED.stop_pattern_id,
                calendar_pattern_id = EXCLUDED.calendar_pattern_id,
                position = EXCLUDED.position
            """,
            (
                timetable_id,
                line_id,
                timetable["label"],
                timetable["stop_pattern"],
                timetable["calendar_pattern"],
                timetable_position,
            ),
        )

        _load_timetable_info_messages(cur, timetable_id, timetable)
        _load_timetable_times(cur, timetable_id, timetable)


def _load_timetable_info_messages(cur: PGCursor, timetable_id: str, timetable: dict) -> None:
    Replace_Child_Rows(cur, "timetable_info_messages", "timetable_id", timetable_id)

    info_messages = timetable.get("info_messages", [])
    if isinstance(info_messages, list):
        for position, message in enumerate(info_messages):
            if isinstance(message, dict):
                message_index = message.get("index")
                level = int(message.get("level", 0))
                text = str(message.get("message", ""))
            else:
                message_index = None
                level = 0
                text = str(message)

            cur.execute(
                """
                INSERT INTO timetable_info_messages (timetable_id, position, message_index, level, message)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (timetable_id, position, message_index, level, text),
            )


def _load_timetable_times(cur: PGCursor, timetable_id: str, timetable: dict) -> None:
    Replace_Child_Rows(cur, "timetable_times", "timetable_id", timetable_id)

    arrivals = timetable.get("arrival_minutes", [])
    departures = timetable.get("departure_minutes", [])
    max_len = max(len(arrivals), len(departures))

    for position in range(max_len):
        arrival = arrivals[position] if position < len(arrivals) else None
        departure = departures[position] if position < len(departures) else None

        cur.execute(
            """
            INSERT INTO timetable_times (timetable_id, position, arrival_minute, departure_minute)
            VALUES (%s, %s, %s, %s)
            """,
            (
                timetable_id,
                position,
                None if arrival is None else int(arrival),
                None if departure is None else int(departure),
            ),
        )
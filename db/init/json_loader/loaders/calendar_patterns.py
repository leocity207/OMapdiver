from pathlib import Path
from psycopg2.extensions import cursor as PGCursor
from json_loader.common import Load_Index_List, Read_Json


def Load_Calendar_Patterns(cur: PGCursor, data_root: Path) -> None:
    index_file = data_root / "calendar_patterns.json"
    folder = data_root / "calendar_patterns"

    ids = Load_Index_List(index_file, "calendar_patterns")

    for item_id in ids:
        data = Read_Json(folder / f"{item_id}.json")

        cur.execute(
            """
            INSERT INTO calendar_patterns (id, label, is_exceptional, info, icon)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                label = EXCLUDED.label,
                is_exceptional = EXCLUDED.is_exceptional,
                info = EXCLUDED.info,
                icon = EXCLUDED.icon
            """,
            (
                data["id"],
                data["label"],
                bool(data.get("is_exceptional", False)),
                data.get("info"),
                data.get("icon"),
            ),
        )
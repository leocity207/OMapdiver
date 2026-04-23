from __future__ import annotations
from pathlib import Path
from psycopg2.extensions import cursor as PGCursor

from common import Load_Index_List, Read_Json, As_Text_List


def Load_Stop_Patterns(cur: PGCursor, data_root: Path) -> None:
	index_file = data_root / "stop_patterns.json"
	folder = data_root / "stop_patterns"
	ids = Load_Index_List(index_file, "stop_patterns")

	for item_id in ids:
		data = Read_Json(folder / f"{item_id}.json")

		cur.execute(
			"""
			INSERT INTO stop_patterns (
				id,
				label,
				level,
				color,
				icon,
				variant
			)
			VALUES (%s, %s, %s, %s, %s, %s)
			ON CONFLICT (id) DO UPDATE SET
				label = EXCLUDED.label,
				level = EXCLUDED.level,
				color = EXCLUDED.color,
				icon = EXCLUDED.icon,
				variant = EXCLUDED.variant
			""",
			(
				data["id"],
				data["label"],
				int(data["level"]),
				data["color"],
				data["icon"],
				As_Text_List(data["variant"])
			),
		)
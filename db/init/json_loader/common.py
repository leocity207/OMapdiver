from __future__ import annotations
import json
from pathlib import Path
from typing import Any, Mapping
from psycopg2.extensions import cursor as PGCursor


def Read_Json(path: Path) -> Any:
	with path.open("r", encoding="utf-8") as f:
		return json.load(f)


def Load_Index_List(index_file: Path, key: str) -> list[str]:
	data = Read_Json(index_file)
	values = data.get(key, [])

	if not isinstance(values, list):
		raise ValueError(f"Expected a list at key '{key}' in {index_file}")

	return [str(item) for item in values]


def Replace_Child_Rows(cur: PGCursor, table: str, fk_column: str, parent_id: str) -> None:
	cur.execute(f"DELETE FROM {table} WHERE {fk_column} = %s", (parent_id,))


def As_Bool_Or_None(value: Any) -> bool | None:
	if value is None:
		return None
	return bool(value)


def As_Int_Or_None(value: Any) -> int | None:
	if value is None:
		return None
	return int(value)


def Extract_Parent_ID(value: Any) -> str | None:
	"""
	Best-effort helper for 'parent' fields.

	Your current JSON does not fully define what parent contains, so this helper
	tries a few common shapes and returns a string ID if it finds one.
	"""
	if value is None:
		return None

	if isinstance(value, str):
		return value

	if isinstance(value, Mapping):
		for key in ("id", "station", "station_id", "pattern", "pattern_id", "parent_id"):
			candidate = value.get(key)
			if candidate is not None:
				return str(candidate)

	return None
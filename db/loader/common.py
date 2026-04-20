from __future__ import annotations
import json
from pathlib import Path
from typing import Any, Mapping

from psycopg2.extras import Json
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


def As_Text_List(value: Any) -> list[str] | None:
	if value is None:
		return None
	if not isinstance(value, list):
		raise ValueError("Expected a list of text values")
	return [str(item) for item in value]


def As_Int_List(value: Any) -> list[int | None] | None:
	if value is None:
		return None
	if not isinstance(value, list):
		raise ValueError("Expected a list of integer values")
	return [None if item is None else int(item) for item in value]


def As_JsonB(value: Any) -> Json:
	return Json(value)
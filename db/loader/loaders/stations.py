from __future__ import annotations
from pathlib import Path
from psycopg2.extensions import cursor as PGCursor

from common import (
	As_Bool_Or_None,
	As_Int_Or_None,
	Load_Index_List,
	Read_Json,
	Replace_Child_Rows,
	As_Text_List,
	As_JsonB
)


def Load_Stations(cur: PGCursor, data_root: Path) -> None:
	index_file = data_root / "stations.json"
	folder = data_root / "stations"
	ids = Load_Index_List(index_file, "stations")

	for item_id in ids:
		data = Read_Json(folder / f"{item_id}.json")
		
		cur.execute(
			"""
			INSERT INTO stations (
				id,
				label,
				url,
				have_disabled_equipment,
				have_bike_parking,
				have_car_parking,
				have_car_sharing,
				opening_time,
				closing_time,
				lines,
				directions
			)
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
			ON CONFLICT (id) DO UPDATE SET
				label = EXCLUDED.label,
				url = EXCLUDED.url,
				have_disabled_equipment = EXCLUDED.have_disabled_equipment,
				have_bike_parking = EXCLUDED.have_bike_parking,
				have_car_parking = EXCLUDED.have_car_parking,
				have_car_sharing = EXCLUDED.have_car_sharing,
				opening_time = EXCLUDED.opening_time,
				closing_time = EXCLUDED.closing_time,
				lines = EXCLUDED.lines,
				directions = EXCLUDED.directions
			""",
			(
				data["id"],
				data["label"],
				data.get("url", ""),
				As_Bool_Or_None(data.get("have_disabled_equipment")),
				As_Bool_Or_None(data.get("have_bike_parking")),
				As_Bool_Or_None(data.get("have_car_parking")),
				As_Bool_Or_None(data.get("have_car_sharing")),
				As_Int_Or_None(data.get("opening_time")),
				As_Int_Or_None(data.get("closing_time")),
				As_Text_List(data.get("lines")),
				As_JsonB(data.get("directions"))
			),
		)
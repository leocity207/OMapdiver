from __future__ import annotations
from pathlib import Path
from psycopg2.extensions import cursor as PGCursor

from json_loader.common import (
    As_Bool_Or_None,
    As_Int_Or_None,
    Extract_Parent_ID,
    Load_Index_List,
    Read_Json,
    Replace_Child_Rows,
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
                opening_hour,
                closing_hour,
                parent_station_id
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                label = EXCLUDED.label,
                url = EXCLUDED.url,
                have_disabled_equipment = EXCLUDED.have_disabled_equipment,
                have_bike_parking = EXCLUDED.have_bike_parking,
                have_car_parking = EXCLUDED.have_car_parking,
                have_car_sharing = EXCLUDED.have_car_sharing,
                opening_hour = EXCLUDED.opening_hour,
                closing_hour = EXCLUDED.closing_hour,
                parent_station_id = EXCLUDED.parent_station_id
            """,
            (
                data["id"],
                data["label"],
                data.get("url", ""),
                As_Bool_Or_None(data.get("have_disabled_equipment")),
                As_Bool_Or_None(data.get("have_bike_parking")),
                As_Bool_Or_None(data.get("have_car_parking")),
                As_Bool_Or_None(data.get("have_car_sharing")),
                As_Int_Or_None(data.get("opening_hour")),
                As_Int_Or_None(data.get("closing_hour")),
                Extract_Parent_ID(data.get("parent")),
            ),
        )

        Replace_Child_Rows(cur, "station_directions", "station_id", data["id"])

        directions = data.get("directions", {})
        if isinstance(directions, dict):
            for direction_key, direction_value in directions.items():
                cur.execute(
                    """
                    INSERT INTO station_directions (station_id, direction_key, direction_value)
                    VALUES (%s, %s, %s)
                    """,
                    (data["id"], str(direction_key), str(direction_value)),
                )
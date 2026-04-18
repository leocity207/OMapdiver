from pathlib import Path
from psycopg2.extensions import cursor as PGCursor
from json_loader.common import Load_Index_List, Read_Json


def Load_Territories(cur: PGCursor, data_root: Path) -> None:
    index_file = data_root / "territories.json"
    folder = data_root / "territories"

    ids = Load_Index_List(index_file, "territories")

    for item_id in ids:
        data = Read_Json(folder / f"{item_id}.json")

        cur.execute(
            """
            INSERT INTO territories (id, label)
            VALUES (%s, %s)
            ON CONFLICT (id) DO UPDATE SET
                label = EXCLUDED.label
            """,
            (data["id"], data["label"]),
        )
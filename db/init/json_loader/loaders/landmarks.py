from pathlib import Path
from psycopg2.extensions import cursor as PGCursor
from json_loader.common import Load_Index_List, Read_Json


def Load_Landmarks(cur: PGCursor, data_root: Path) -> None:
    index_file = data_root / "landmarks.json"
    folder = data_root / "landmarks"

    ids = Load_Index_List(index_file, "landmarks")

    for item_id in ids:
        data = Read_Json(folder / f"{item_id}.json")

        cur.execute(
            """
            INSERT INTO landmarks (id, label)
            VALUES (%s, %s)
            ON CONFLICT (id) DO UPDATE SET
                label = EXCLUDED.label
            """,
            (data["id"], data["label"]),
        )
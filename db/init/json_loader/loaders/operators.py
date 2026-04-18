from pathlib import Path
from psycopg2.extensions import cursor as PGCursor
from json_loader.common import Load_Index_List, Read_Json


def Load_Operators(cur: PGCursor, data_root: Path) -> None:
    index_file = data_root / "operators.json"
    folder = data_root / "operators"

    ids = Load_Index_List(index_file, "operators")

    for item_id in ids:
        data = Read_Json(folder / f"{item_id}.json")

        cur.execute(
            """
            INSERT INTO operators (id, label)
            VALUES (%s, %s)
            ON CONFLICT (id) DO UPDATE SET
                label = EXCLUDED.label
            """,
            (data["id"], data["label"]),
        )
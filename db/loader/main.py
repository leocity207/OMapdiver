from __future__ import annotations

import argparse
from pathlib import Path
from psycopg2 import connect

from loaders import (
	Load_Calendar_Patterns,
	Load_Landmarks,
	Load_Lines,
	Load_Operators,
	Load_Organisers,
	Load_Stations,
	Load_Stop_Patterns,
	Load_Territories,
)


def parse_args() -> argparse.Namespace:
	parser = argparse.ArgumentParser(description="Load transport JSON data into PostgreSQL.")
	parser.add_argument("--data-root", type=Path, required=True, help="Path to resources/resources-config/data")
	parser.add_argument("--host",     default="localhost")
	parser.add_argument("--port",     default=5432, type=int)
	parser.add_argument("--dbname",   default="appdb")
	parser.add_argument("--user",     default="appuser")
	parser.add_argument("--password", default="app_password")
	return parser.parse_args()


def main() -> None:
	args = parse_args()
	conn = connect(
		host=args.host,
		port=args.port,
		dbname=args.dbname,
		user=args.user,
		password=args.password,
	)

	try:
		with conn:
			with conn.cursor() as cur:
				# Load simple reference data first.
				Load_Calendar_Patterns(cur, args.data_root)
				Load_Landmarks(cur, args.data_root)
				Load_Operators(cur, args.data_root)
				Load_Organisers(cur, args.data_root)
				Load_Territories(cur, args.data_root)
				Load_Stop_Patterns(cur, args.data_root)
				Load_Stations(cur, args.data_root)
				Load_Lines(cur, args.data_root)

		print("Import completed successfully.")
	finally:
		conn.close()


if __name__ == "__main__":
	main()
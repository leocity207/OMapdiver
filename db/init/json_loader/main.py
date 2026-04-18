from __future__ import annotations

import argparse
from pathlib import Path
from psycopg2 import connect

from json_loader.loaders import (
	load_calendar_patterns,
	load_landmarks,
	load_lines,
	load_operators,
	load_organisers,
	load_stations,
	load_stop_patterns,
	load_territories,
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
				load_calendar_patterns(cur, args.data_root)
				load_landmarks(cur, args.data_root)
				load_operators(cur, args.data_root)
				load_organisers(cur, args.data_root)
				load_territories(cur, args.data_root)
				load_stop_patterns(cur, args.data_root)
				load_stations(cur, args.data_root)
				load_lines(cur, args.data_root)

		print("Import completed successfully.")
	finally:
		conn.close()


if __name__ == "__main__":
	main()
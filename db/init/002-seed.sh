#!/bin/bash
set -e

echo "-----------------------------------"
echo "Installing Python + dependencies..."
echo "-----------------------------------"

apk add --no-cache python3 py3-pip

pip3 install psycopg2-binary

echo "--------------------"
echo "Loading JSON data..."
echo "--------------------"

python3 /docker-entrypoint-initdb.d/load_json_to_postgres.py \
  --host localhost \
  --port 5432 \
  --dbname "$POSTGRES_DB" \
  --user "$POSTGRES_USER" \
  --password "$POSTGRES_PASSWORD" \
  --data-root /app/data

echo "-----------"
echo "Data loaded"
echo "-----------"
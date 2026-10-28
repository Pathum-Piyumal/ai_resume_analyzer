"""Inspect, back up, and copy the application tables between PostgreSQL databases.

Supply MIGRATION_SOURCE_URL and MIGRATION_TARGET_URL in the environment or in
.env.migration.local. No credentials or account details are printed.
Stop application writes during the copy and cutover. The target must be empty.
"""
import argparse
from datetime import datetime
import json
import os
from pathlib import Path
import sys

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, select, func, text
from sqlalchemy.engine import make_url
from sqlmodel import SQLModel
from app.models import models  # register tables

TABLES = SQLModel.metadata.sorted_tables


def connection_url(value):
    if value.startswith("postgres://"):
        value = value.replace("postgres://", "postgresql://", 1)
    return make_url(value)


def counts(connection):
    existing = set(inspect(connection).get_table_names())
    return {t.name: connection.scalar(select(func.count()).select_from(t))
            for t in TABLES if t.name in existing}


def run(command):
    load_dotenv(Path(__file__).with_name(".env.migration.local"))
    source_url = connection_url(os.environ["MIGRATION_SOURCE_URL"])
    target_url = connection_url(os.environ["MIGRATION_TARGET_URL"])
    source = create_engine(source_url, connect_args={"connect_timeout": 20}, hide_parameters=True)
    target = create_engine(target_url, connect_args={"connect_timeout": 20}, hide_parameters=True)
    if command == "inspect":
        for name, engine in (("source", source), ("target", target)):
            with engine.connect() as connection:
                print(name, counts(connection))
        return

    # Use a dedicated database; never overwrite an existing Neon database.
    target_database = "resumeiq_live"
    if source_url.host == target_url.host and source_url.database == target_database:
        raise RuntimeError("Source and target cannot be the same database")
    with target.connect().execution_options(isolation_level="AUTOCOMMIT") as connection:
        exists = connection.scalar(text("SELECT 1 FROM pg_database WHERE datname=:name"), {"name": target_database})
        if not exists:
            connection.execute(text('CREATE DATABASE "resumeiq_live"'))
    target.dispose()
    target_url = target_url.set(database=target_database)
    target = create_engine(target_url, connect_args={"connect_timeout": 20}, hide_parameters=True)
    SQLModel.metadata.create_all(target)

    with source.connect().execution_options(isolation_level="REPEATABLE READ") as src, target.begin() as dst:
        if any(counts(dst).values()):
            raise RuntimeError("Target is not empty; migration stopped without modifying rows")
        data = {table.name: [dict(row) for row in src.execute(select(table)).mappings()] for table in TABLES}
        backup_dir = Path(__file__).with_name("backups")
        backup_dir.mkdir(exist_ok=True)
        backup = backup_dir / f"render-{datetime.now():%Y%m%d-%H%M%S}.json"
        backup.write_text(json.dumps(data, default=str), encoding="utf-8")
        print(f"Backup saved: {backup.name}")
        for table in TABLES:
            if data[table.name]:
                dst.execute(table.insert(), data[table.name])
            sequence = dst.scalar(text("SELECT pg_get_serial_sequence(:name, 'id')"), {"name": f'"{table.name}"'})
            if sequence:
                maximum = dst.scalar(select(func.max(table.c.id)))
                dst.execute(text("SELECT setval(CAST(:sequence AS regclass), :value, :called)"),
                            {"sequence": sequence, "value": maximum or 1, "called": maximum is not None})
        expected = {name: len(rows) for name, rows in data.items()}
        if counts(dst) != expected:
            raise RuntimeError("Row count verification failed; target transaction rolled back")
        for table in TABLES:
            copied = [dict(row) for row in dst.execute(select(table)).mappings()]
            if sorted(copied, key=lambda row: row['id']) != sorted(data[table.name], key=lambda row: row['id']):
                raise RuntimeError(f"Content verification failed for {table.name}")
        print("Verified all row contents:", expected)
    print("Migration complete. Target database: resumeiq_live")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["inspect", "migrate"])
    arguments = parser.parse_args()
    try:
        run(arguments.command)
    except Exception as error:
        # Drivers may put credentials and account data in exception messages.
        print(f"Database operation failed ({type(error).__name__}). No credentials printed.", file=sys.stderr)
        sys.exit(1)

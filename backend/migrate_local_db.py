"""Add missing profile fields to the local SQLite database without losing data."""
from datetime import datetime
from pathlib import Path
import sqlite3


def migrate():
    database = Path(__file__).with_name("resume_analyzer.db")
    if not database.exists():
        raise FileNotFoundError(database)
    columns = {
        "first_name": "TEXT NOT NULL DEFAULT 'Job'",
        "last_name": "TEXT NOT NULL DEFAULT 'Seeker'",
        "job_title": "TEXT NOT NULL DEFAULT 'Software Engineer'",
        "avatar": "TEXT",
    }
    with sqlite3.connect(database) as connection:
        existing = {row[1] for row in connection.execute("PRAGMA table_info(usersetting)")}
        if not existing:
            raise RuntimeError("The usersetting table does not exist")
        missing = columns.keys() - existing
        if not missing:
            print("Local database is already up to date")
            return
        backup = database.with_name(f"{database.name}.{datetime.now():%Y%m%d%H%M%S}.bak")
        with sqlite3.connect(backup) as destination:
            connection.backup(destination)
        print(f"Backup: {backup.name}")
        for name, definition in columns.items():
            if name in missing:
                connection.execute(f'ALTER TABLE usersetting ADD COLUMN "{name}" {definition}')
                print(f"Added usersetting.{name}")


if __name__ == "__main__":
    migrate()

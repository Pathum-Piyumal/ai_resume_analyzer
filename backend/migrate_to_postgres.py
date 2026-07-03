import os
from sqlmodel import Session, SQLModel, create_engine, select
from sqlalchemy.orm import make_transient
from app.models.models import User, UserSetting, ResumeScan, SavedJob, PasswordResetToken

# Local SQLite Engine (Source)
sqlite_engine = create_engine("sqlite:///resume_analyzer.db")

# Render PostgreSQL Engine (Target)
postgres_url = "postgresql://resume_db_xev4_user:OleJVEojFU9LN0dMf8QsjKdqFFMBsAVm@dpg-d937284vikkc73e6b3o0-a.oregon-postgres.render.com/resume_db_xev4"
postgres_engine = create_engine(postgres_url)

def migrate():
    print("Connecting to databases...")
    print("Creating tables on PostgreSQL if they do not exist...")
    SQLModel.metadata.create_all(postgres_engine)
    
    # 1. Migrate Users
    with Session(sqlite_engine) as src_session, Session(postgres_engine) as dst_session:
        print("Fetching users from SQLite...")
        users = src_session.exec(select(User)).all()
        print(f"Found {len(users)} users. Copying...")
        for u in users:
            make_transient(u)
            dst_session.add(u)
        dst_session.commit()
        print("Users migration complete.")

    # 2. Migrate UserSettings
    with Session(sqlite_engine) as src_session, Session(postgres_engine) as dst_session:
        print("Fetching settings from SQLite...")
        settings = src_session.exec(select(UserSetting)).all()
        print(f"Found {len(settings)} settings rows. Copying...")
        for s in settings:
            make_transient(s)
            dst_session.add(s)
        dst_session.commit()
        print("User settings migration complete.")

    # 3. Migrate Scans
    with Session(sqlite_engine) as src_session, Session(postgres_engine) as dst_session:
        print("Fetching scans history from SQLite...")
        scans = src_session.exec(select(ResumeScan)).all()
        print(f"Found {len(scans)} scans. Copying...")
        for sc in scans:
            make_transient(sc)
            dst_session.add(sc)
        dst_session.commit()
        print("Scans migration complete.")

    # 4. Migrate SavedJobs
    with Session(sqlite_engine) as src_session, Session(postgres_engine) as dst_session:
        print("Fetching saved jobs from SQLite...")
        jobs = src_session.exec(select(SavedJob)).all()
        print(f"Found {len(jobs)} saved jobs. Copying...")
        for j in jobs:
            make_transient(j)
            dst_session.add(j)
        dst_session.commit()
        print("Saved jobs migration complete.")

    print("\n==================================================")
    print("🎉 SUCCESS! SQLite database fully migrated to Render PostgreSQL.")
    print("==================================================")

if __name__ == "__main__":
    migrate()

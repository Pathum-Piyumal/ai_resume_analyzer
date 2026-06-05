from sqlmodel import Session
from app.db import engine
from app.models.models import User, UserSetting, SavedJob, ResumeScan

try:
    with Session(engine) as session:
        # Delete all records from all tables
        session.query(UserSetting).delete()
        session.query(SavedJob).delete()
        session.query(ResumeScan).delete()
        session.query(User).delete()
        session.commit()
        print("Database cleared successfully!")
except Exception as e:
    print("Failed to clear database:", e)

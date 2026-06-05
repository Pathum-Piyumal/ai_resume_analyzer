from sqlmodel import SQLModel
from app.db import engine
# Import all models to ensure they register on SQLModel.metadata
from app.models.models import User, UserSetting, SavedJob, ResumeScan, PasswordResetToken

try:
    print("Dropping all existing database tables...")
    SQLModel.metadata.drop_all(engine)
    print("Recreating all database tables with updated schemas...")
    SQLModel.metadata.create_all(engine)
    print("Database reset completed successfully!")
except Exception as e:
    print("Failed to reset database tables:", e)

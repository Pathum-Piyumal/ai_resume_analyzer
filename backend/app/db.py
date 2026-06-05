import os
from sqlmodel import SQLModel, create_engine, Session

# Set up SQLite database filepath
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./resume_analyzer.db")

# connect_args={"check_same_thread": False} is required only for SQLite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

def init_db():
    """Create all tables in the database if they do not exist."""
    from app.models.models import User, UserSetting, SavedJob, ResumeScan
    SQLModel.metadata.create_all(engine)

def get_session():
    """FastAPI Dependency to get a database session."""
    with Session(engine) as session:
        yield session

from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class BulletPointImprovement(BaseModel):
    before: str
    after: str

class CourseLink(BaseModel):
    platform: str
    skill: str
    title: str
    url: str

class JobLink(BaseModel):
    platform: str
    skill: str
    title: str
    url: str

class AnalysisResult(BaseModel):
    match_score: float
    resume_skills: List[str]
    jd_skills: List[str]
    missing_skills: List[str]
    formatting_issues: List[str]
    bullet_points_improvements: List[BulletPointImprovement]
    career_suggestions: List[str]
    courses: List[CourseLink]
    jobs: List[JobLink]
    resume_text_preview: str
    job_title: Optional[str] = None

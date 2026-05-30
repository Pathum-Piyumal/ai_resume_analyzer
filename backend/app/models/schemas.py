from pydantic import BaseModel
from typing import List

# BaseModel comes from Pydantic — it auto-validates data types

class AnalysisResult(BaseModel):
    """
    This is the exact shape of data our API will return.
    Pydantic will raise an error if any field is missing or wrong type.
    """
    match_score: float          # e.g., 72.5 (percentage)
    resume_skills: List[str]    # e.g., ["python", "react", "sql"]
    jd_skills: List[str]        # skills found in job description
    missing_skills: List[str]   # skills in JD but NOT in resume
    resume_text_preview: str    # first 300 chars of extracted text (for debugging)
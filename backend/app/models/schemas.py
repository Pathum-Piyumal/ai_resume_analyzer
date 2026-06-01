from pydantic import BaseModel
from typing import List

# BaseModel comes from Pydantic — it auto-validates data types

class AnalysisResult(BaseModel):
    """
    This is the exact shape of data our API will return.
    Pydantic will raise an error if any field is missing or wrong type.
    """
    match_score: float          
    resume_skills: List[str]    
    jd_skills: List[str]        
    missing_skills: List[str]   
    resume_text_preview: str    
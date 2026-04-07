from pydantic import BaseModel
from typing import List

# BaseModel comes from Pydantic — it auto-validates data types

class AnalysisResult(BaseModel):
    
    match_score: float         
    jd_skills: List[str]       
    missing_skills: List[str]  
    resume_text_preview: str   
import spacy

nlp = spacy.load("en_core_web_sm")

# Basic tech skill keywords — expand this list as needed
SKILLS_DB = [
    "python", "java", "javascript", "react", "fastapi", "django",
    "sql", "mongodb", "docker", "git", "machine learning", "nlp",
    "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn",
    "aws", "azure", "linux", "rest api", "html", "css",
]

def extract_skills(text: str) -> list:
    text_lower = text.lower()
    found = [skill for skill in SKILLS_DB if skill in text_lower]
    return list(set(found))
import re

SKILLS_DB = [
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "golang", "rust", "swift", "kotlin",
    # Web Frameworks
    "react", "angular", "vue", "django", "flask", "fastapi", "express", "spring boot",
    # Databases
    "mysql", "postgresql", "mongodb", "sqlite", "redis", "elasticsearch",
    # ML / AI
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy",
    # DevOps / Cloud
    "docker", "kubernetes", "aws", "azure", "google cloud", "linux", "git", "ci/cd",
    # Other Tech
    "rest api", "graphql", "html", "css", "tailwind", "sql", "excel", "power bi",
]

def preprocess_text(text: str) -> str:

    text = text.lower()

    text = text.replace('\n', ' ').replace('\t', ' ')

    # Keep alphanumeric, spaces, +, #, /, -, and .
    text = re.sub(r'[^\w\s\+#/\-\.]', ' ', text)

    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

def extract_skills(text: str) -> list:

    cleaned_text = preprocess_text(text)
    found_skills = set()
    
    for skill in SKILLS_DB:
        # Avoid word boundary issues for skills ending/starting in non-word chars (like C++, C#)
        start_boundary = r'\b' if skill[0].isalnum() or skill[0] == '_' else r'(?:^|(?<=\W))'
        end_boundary = r'\b' if skill[-1].isalnum() or skill[-1] == '_' else r'(?:^|(?=\W))'
        pattern = start_boundary + re.escape(skill) + end_boundary
        
        if re.search(pattern, cleaned_text):
            found_skills.add(skill)
    
    return sorted(list(found_skills))
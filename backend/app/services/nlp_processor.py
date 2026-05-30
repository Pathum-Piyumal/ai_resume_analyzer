import re

# This is your "skills database" — a flat list of known tech skills.
# In a real production app, this could be loaded from a database or file.
# We use lowercase because we'll compare against lowercased text.
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
    """
    Clean up text before analysis.
    
    Why? Raw resume text has bullets, special chars, extra spaces.
    Cleaning makes keyword matching more accurate.
    """
    # Convert everything to lowercase for consistent comparison
    text = text.lower()
    
    # Replace newlines and tabs with spaces
    text = text.replace('\n', ' ').replace('\t', ' ')
    
    # Remove special characters but keep letters, numbers, spaces, + (for C++)
    text = re.sub(r'[^\w\s\+#]', ' ', text)
    
    # Collapse multiple spaces into one
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

def extract_skills(text: str) -> list:
    """
    Find which skills from our database appear in the given text.
    
    Returns a sorted list of found skills.
    Uses a set() internally to avoid duplicates.
    """
    cleaned_text = preprocess_text(text)
    found_skills = set()
    
    for skill in SKILLS_DB:
        # Use word boundary matching so "sql" doesn't match inside "mysql"
        # \b = word boundary in regex
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, cleaned_text):
            found_skills.add(skill)
    
    return sorted(list(found_skills))
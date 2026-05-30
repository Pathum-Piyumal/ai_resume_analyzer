# test_matcher.py — DELETE after testing
import sys
sys.path.append('.')

from app.services.matcher import calculate_match

resume = """
Experienced Python developer with FastAPI and React skills.
Worked with PostgreSQL and Docker. Git version control.
Machine learning with scikit-learn and pandas.
"""

# Test 1: Highly matching JD
matching_jd = """
We need a Python developer with FastAPI experience.
React frontend skills required. PostgreSQL database knowledge.
Docker and Git experience preferred.
"""

score1, missing1 = calculate_match(resume, matching_jd, 
    ["python", "fastapi", "react", "postgresql", "docker"], 
    ["python", "fastapi", "react", "postgresql", "docker"])
print(f"Matching JD score: {score1}%")     # Should be HIGH (70-90%)
print(f"Missing skills: {missing1}")       # Should be empty []

# Test 2: Poorly matching JD
different_jd = """
We need a Java Spring Boot developer with Kubernetes expertise.
Experience in Swift for iOS development required.
Azure cloud certification preferred.
"""
score2, missing2 = calculate_match(resume, different_jd,
    ["python", "fastapi", "react"],
    ["java", "spring boot", "kubernetes", "swift", "azure"])
print(f"\nDifferent JD score: {score2}%")  # Should be LOW (5-20%)
print(f"Missing skills: {missing2}")       # Should show java, kubernetes, etc.
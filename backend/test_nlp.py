# test_nlp.py — DELETE after testing
import sys
sys.path.append('.')  # lets Python find your app/ folder

from app.services.nlp_processor import extract_skills, preprocess_text

# Test 1: Preprocessing
raw_text = "  Experienced in Python, React.js & Machine Learning!!\n  "
clean = preprocess_text(raw_text)
print("Cleaned text:", repr(clean))
# Expected: "experienced in python  react js  machine learning"

# Test 2: Skill extraction
sample_resume = """
    John Doe — Software Engineer
    Skills: Python, FastAPI, React, PostgreSQL, Docker
    Experience with Machine Learning and scikit-learn.
    Worked on AWS infrastructure and CI/CD pipelines.
"""
skills = extract_skills(sample_resume)
print("\nExtracted skills:", skills)
# Expected: ['aws', 'ci/cd', 'docker', 'fastapi', 'machine learning',
#            'postgresql', 'python', 'react', 'scikit-learn']

# Test 3: Skills NOT in text
sample_jd = "We need someone with Python, Kubernetes, and GraphQL experience."
jd_skills = extract_skills(sample_jd)
print("\nJob description skills:", jd_skills)

missing = list(set(jd_skills) - set(skills))
print("Missing from resume:", missing)
# Expected: ['graphql', 'kubernetes']
import urllib.parse
from typing import List, Dict, Any

# Map common skills to polished search names
SKILL_DISPLAY_MAP = {
    "python": "Python Programming",
    "java": "Java Software Development",
    "javascript": "Modern JavaScript",
    "typescript": "TypeScript Core Concepts",
    "react": "React Frontend Development",
    "angular": "Angular Framework Development",
    "vue": "Vue.js Single Page Applications",
    "django": "Django Backend Development",
    "flask": "Flask Web Development",
    "fastapi": "Fastapi REST APIs",
    "docker": "Docker Containerization",
    "kubernetes": "Kubernetes orchestration",
    "aws": "AWS Cloud Architecture",
    "google cloud": "Google Cloud Platform",
    "azure": "Microsoft Azure Infrastructure",
    "machine learning": "Machine Learning Fundamentals",
    "deep learning": "Deep Learning Masterclass",
    "nlp": "Natural Language Processing",
    "sql": "SQL Database Design",
    "mongodb": "MongoDB Developer Course",
    "postgresql": "PostgreSQL Database Management",
    "graphql": "GraphQL APIs",
    "git": "Git & Github Version Control",
    "ci/cd": "CI/CD Pipelines & DevOps"
}

def generate_integration_links(missing_skills: List[str]) -> Dict[str, Any]:
    """
    Generates dynamic links for course and job search platforms 
    based on the user's missing skills.
    """
    courses = []
    jobs = []
    
    # Generate Course search query URLs for the top missing skills (cap at 3 to keep UI clean)
    for skill in missing_skills[:3]:
        cleaned_skill = skill.lower().strip()
        display_name = SKILL_DISPLAY_MAP.get(cleaned_skill, f"{skill.capitalize()} Masterclass")
        encoded_query = urllib.parse.quote(display_name)
        
        # Coursera Search Link
        courses.append({
            "platform": "Coursera",
            "skill": skill,
            "title": f"Search '{display_name}' on Coursera",
            "url": f"https://www.coursera.org/search?query={encoded_query}"
        })
        
        # Udemy Search Link
        courses.append({
            "platform": "Udemy",
            "skill": skill,
            "title": f"Search '{display_name}' on Udemy",
            "url": f"https://www.udemy.com/courses/search/?q={encoded_query}"
        })
        
    # Generate Job search query URLs on LinkedIn
    for skill in missing_skills[:2]:
        encoded_job_query = urllib.parse.quote(f"{skill} Developer")
        jobs.append({
            "platform": "LinkedIn",
            "skill": skill,
            "title": f"View {skill.capitalize()} Jobs on LinkedIn",
            "url": f"https://www.linkedin.com/jobs/search/?keywords={encoded_job_query}"
        })
        
    return {
        "courses": courses,
        "jobs": jobs
    }

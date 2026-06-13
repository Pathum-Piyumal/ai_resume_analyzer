import os
import json
import logging
import google.generativeai as genai
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
    # Using the standard gemini-1.5-flash model
    ai_model = genai.GenerativeModel("gemini-1.5-flash")
else:
    ai_model = None
    logger.warning("GEMINI_API_KEY is not set. AI Resume analysis will fall back to rule-based matcher.")

def get_fallback_analysis(resume_text: str, job_description: str, resume_skills: List[str], jd_skills: List[str]) -> Dict[str, Any]:
    """Generates a rule-based matching output if the AI API is unavailable."""
    matched_skills = sorted(list(set(resume_skills) & set(jd_skills)))
    missing_skills = sorted(list(set(jd_skills) - set(resume_skills)))
    
    # Calculate simple match score
    if len(jd_skills) > 0:
        base_score = (len(matched_skills) / len(jd_skills)) * 80
    else:
        base_score = 50
    # Add a bit of length-based scoring
    length_bonus = min(len(resume_text) / 200, 20)
    match_score = round(min(base_score + length_bonus, 100), 2)
    
    # Static fallback improvements
    improvements = []
    if "docker" in missing_skills:
        improvements.append({
            "before": "Set up server environments for deployments.",
            "after": "Architected Docker containerization pipeline, reducing server deployment setup time by 40%."
        })
    if "react" in missing_skills or "typescript" in missing_skills:
        improvements.append({
            "before": "Worked on the frontend UI using React.",
            "after": "Refactored key frontend dashboards using React and TypeScript, boosting client-side rendering speed by 25%."
        })
    if not improvements:
        improvements.append({
            "before": "Responsible for maintaining backend systems.",
            "after": "Optimized database query performance and backend endpoint response times, increasing system efficiency by 15%."
        })
        
    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "formatting_issues": [
            "Ensure sections (Experience, Education, Skills) are clearly separated by bold headers.",
            "Avoid placing important skill keywords inside tables, as some legacy ATS parsers ignore them."
        ],
        "bullet_points_improvements": improvements,
        "career_suggestions": [
            f"Obtain a certification or complete a project involving: {', '.join(missing_skills[:2])}" if missing_skills else "Align your resume summary with the target job's specific domain requirements."
        ]
    }

async def analyze_resume_with_ai(resume_text: str, job_description: str, resume_skills: List[str], jd_skills: List[str]) -> Dict[str, Any]:
    """Sends the resume and job description to Google Gemini and retrieves a structured analysis."""
    if not ai_model:
        return get_fallback_analysis(resume_text, job_description, resume_skills, jd_skills)
        
    prompt = f"""
You are an expert ATS (Applicant Tracking System) parser and senior recruiter.
Analyze the following resume text against the target job description.

--- RESUME TEXT ---
{resume_text}

--- JOB DESCRIPTION ---
{job_description}

Provide a detailed analysis strictly adhering to the JSON schema below. 
Calculate an accurate ATS match score (0-100) based on skills fit, experience level, formatting conventions, and achievement strength.
Provide 2-3 specific bullet point rewrites (before and after) based on the resume text to show quantifiable metrics and strong action verbs.
Highlight any formatting issues that could trip up an ATS.

JSON Schema Output format:
{{
  "match_score": 75.5,
  "matched_skills": ["react", "typescript", "git"],
  "missing_skills": ["docker", "kubernetes", "aws"],
  "formatting_issues": ["The document uses double-column layout which can confuse older ATS scanners."],
  "bullet_points_improvements": [
    {{
      "before": "Developed new features for the web app.",
      "after": "Engineered 5+ user-facing features in React, increasing user engagement by 18%."
    }}
  ],
  "career_suggestions": [
    "Focus on containerization technologies like Docker and Kubernetes.",
    "Obtain AWS Cloud Practitioner certification to bolster cloud credential strength."
  ]
}}
"""
    try:
        # Force JSON response output
        generation_config = {"response_mime_type": "application/json"}
        response = ai_model.generate_content(
            prompt,
            generation_config=generation_config
        )
        data = json.loads(response.text)
        return data
    except Exception as e:
        logger.error(f"Gemini API call failed: {e}. Falling back to rule-based matching.")
        return get_fallback_analysis(resume_text, job_description, resume_skills, jd_skills)

def get_fallback_career_path() -> Dict[str, Any]:
    """Generates a default career path roadmap if the AI API is offline."""
    return {
        "career_steps": [
            {
                "id": 1,
                "role": "Junior Developer",
                "status": "completed",
                "salary": "$60k - $80k",
                "duration": "1-2 years",
                "skills": ["React", "JavaScript", "HTML/CSS"]
            },
            {
                "id": 2,
                "role": "Frontend Developer",
                "status": "current",
                "salary": "$90k - $120k",
                "duration": "2-4 years",
                "skills": ["TypeScript", "State Management", "Performance Optimization"]
            },
            {
                "id": 3,
                "role": "Senior Frontend Engineer",
                "status": "next",
                "salary": "$130k - $170k",
                "duration": "4-7 years",
                "skills": ["System Design", "CI/CD", "Mentorship", "Architecture"],
                "match": 75
            },
            {
                "id": 4,
                "role": "Engineering Manager",
                "status": "future",
                "salary": "$160k - $220k",
                "duration": "7+ years",
                "skills": ["Leadership", "Agile", "Team Building", "Strategic Planning"],
                "match": 30
            }
        ],
        "recommended_courses": [
            {
                "title": "Pragmatic System Design & Software Architecture",
                "platform": "Udemy Professional",
                "level": "Intermediate",
                "rating": "4.9",
                "duration": "18 hours • 45 Lectures",
                "description": "Learn how to build highly scalable frontend architectures, handle global scaling, configure custom CDNs, implement advanced caching patterns, and optimize core web vitals."
            },
            {
                "title": "Large-Scale Frontend UI Engineering",
                "platform": "Frontend Masters",
                "level": "Advanced",
                "rating": "4.8",
                "duration": "9 hours • 22 Lectures",
                "description": "Deep dive into monorepos, module federation, micro-frontends, state design patterns (Zustand, Redux, XState), custom tooling/bundling setups, and design system compilation."
            },
            {
                "title": "System Design Patterns & API Architectures",
                "platform": "Coursera (University)",
                "level": "Intermediate",
                "rating": "4.7",
                "duration": "4 weeks (3 hrs/week)",
                "description": "Explore microservice layouts, GraphQL gateway aggregation, WebSockets/SSE streaming integrations, rate limiting, and defensive architectural layouts."
            }
        ],
        "guided_projects": [
            {
                "title": "Automate Frontend Deployments with GitHub Actions",
                "estTime": "2.5 hours",
                "difficulty": "Intermediate",
                "description": "Establish a complete CI/CD workflow that lints codebase formatting, runs Jest test suites, builds production assets, and deploys to a static staging URL automatically.",
                "steps": [
                    "Create GitHub Repository Secrets mapping AWS/Vercel keys.",
                    "Author workflow YAML file with multi-job pipeline matrix.",
                    "Enable caching strategies to accelerate node dependency builds.",
                    "Establish automatic Slack/Discord build-failure warnings."
                ]
            },
            {
                "title": "Dockerizing a React SPA with Multi-Stage Nginx",
                "estTime": "3.5 hours",
                "difficulty": "Intermediate",
                "description": "Configure multi-stage Docker builds to reduce image sizes, bundle custom Nginx servers, and configure routing proxies to achieve secure sub-second content delivery.",
                "steps": [
                    "Write Dockerfile utilizing Alpine Node environments.",
                    "Build and compress React code assets for production deployment.",
                    "Configure custom Nginx route files to redirect requests back to index.html.",
                    "Establish local docker-compose environments with proxy servers."
                ]
            },
            {
                "title": "CI Regression Testing with Jest & Cypress",
                "estTime": "4 hours",
                "difficulty": "Advanced",
                "description": "Implement regression checking workflows. Setup headless Chrome instances inside GitHub Actions runners to assert component layout parameters and user interactions.",
                "steps": [
                    "Implement headless Chrome setup inside CI runners.",
                    "Author end-to-end user signup and payment flow mock scripts.",
                    "Establish automated accessibility check alerts."
                ]
            }
        ]
    }

async def generate_career_path_with_ai(
    resume_text: str,
    job_description: str,
    matched_skills: List[str],
    missing_skills: List[str]
) -> Dict[str, Any]:
    """Sends user profile context to Google Gemini to generate a tailored career path roadmap."""
    if not ai_model:
        return get_fallback_career_path()
        
    prompt = f"""
You are an expert career counselor, tech recruiter, and mentor.
Analyze the user's current profile based on their resume, matching status, and target job description:

--- MATCHED SKILLS ---
{', '.join(matched_skills)}

--- MISSING SKILLS ---
{', '.join(missing_skills)}

--- TARGET JOB DESCRIPTION ---
{job_description}

Provide a structured, personalized career path roadmap strictly adhering to the JSON schema below.
The roadmap must show:
1. A sequence of 4 career steps (roles) leading up to the target role and beyond (Junior, Mid/Current, Next Target, Future Management/Architecture).
2. 3 highly specific recommended courses on standard platforms (Udemy, Coursera, Frontend Masters, etc.) targeting the missing skills.
3. 3 hands-on guided coding projects focusing on CI/CD, DevOps, or system design, with step-by-step instructions.

JSON Schema Output format:
{{
  "career_steps": [
    {{
      "id": 1,
      "role": "Junior Developer",
      "status": "completed",
      "salary": "$60k - $80k",
      "duration": "1-2 years",
      "skills": ["React", "JavaScript", "HTML/CSS"]
    }},
    {{
      "id": 2,
      "role": "Frontend Developer",
      "status": "current",
      "salary": "$90k - $120k",
      "duration": "2-4 years",
      "skills": ["TypeScript", "State Management", "Performance Optimization"]
    }},
    {{
      "id": 3,
      "role": "Senior Frontend Engineer",
      "status": "next",
      "salary": "$130k - $170k",
      "duration": "4-7 years",
      "skills": ["System Design", "CI/CD", "Mentorship", "Architecture"],
      "match": 75
    }},
    {{
      "id": 4,
      "role": "Engineering Manager",
      "status": "future",
      "salary": "$160k - $220k",
      "duration": "7+ years",
      "skills": ["Leadership", "Agile", "Team Building", "Strategic Planning"],
      "match": 30
    }}
  ],
  "recommended_courses": [
    {{
      "title": "Pragmatic System Design & Software Architecture",
      "platform": "Udemy Professional",
      "level": "Intermediate",
      "rating": "4.9",
      "duration": "18 hours • 45 Lectures",
      "description": "Learn how to build highly scalable frontend architectures, handle global scaling, configure custom CDNs, implement advanced caching patterns, and optimize core web vitals."
    }},
    {{
      "title": "Large-Scale Frontend UI Engineering",
      "platform": "Frontend Masters",
      "level": "Advanced",
      "rating": "4.8",
      "duration": "9 hours • 22 Lectures",
      "description": "Deep dive into monorepos, module federation, micro-frontends, state design patterns (Zustand, Redux, XState), custom tooling/bundling setups, and design system compilation."
    }},
    {{
      "title": "System Design Patterns & API Architectures",
      "platform": "Coursera (University)",
      "level": "Intermediate",
      "rating": "4.7",
      "duration": "4 weeks (3 hrs/week)",
      "description": "Explore microservice layouts, GraphQL gateway aggregation, WebSockets/SSE streaming integrations, rate limiting, and defensive architectural layouts."
    }}
  ],
  "guided_projects": [
    {{
      "title": "Automate Frontend Deployments with GitHub Actions",
      "estTime": "2.5 hours",
      "difficulty": "Intermediate",
      "description": "Establish a complete CI/CD workflow that lints codebase formatting, runs Jest test suites, builds production assets, and deploys to a static staging URL automatically.",
      "steps": [
        "Create GitHub Repository Secrets mapping AWS/Vercel keys.",
        "Author workflow YAML file with multi-job pipeline matrix.",
        "Enable caching strategies to accelerate node dependency builds.",
        "Establish automatic Slack/Discord build-failure warnings."
      ]
    }},
    {{
      "title": "Dockerizing a React SPA with Multi-Stage Nginx",
      "estTime": "3.5 hours",
      "difficulty": "Intermediate",
      "description": "Configure multi-stage Docker builds to reduce image sizes, bundle custom Nginx servers, and configure routing proxies to achieve secure sub-second content delivery.",
      "steps": [
        "Write Dockerfile utilizing Alpine Node environments.",
        "Build and compress React code assets for production deployment.",
        "Configure custom Nginx route files to redirect requests back to index.html.",
        "Establish local docker-compose environments with proxy servers."
      ]
    }},
    {{
      "title": "CI Regression Testing with Jest & Cypress",
      "estTime": "4 hours",
      "difficulty": "Advanced",
      "description": "Implement regression checking workflows. Setup headless Chrome instances inside GitHub Actions runners to assert component layout parameters and user interactions.",
      "steps": [
        "Implement headless Chrome setup inside CI runners.",
        "Author end-to-end user signup and payment flow mock scripts.",
        "Establish automated accessibility check alerts."
      ]
    }}
  ]
}}
"""
    try:
        generation_config = {"response_mime_type": "application/json"}
        response = ai_model.generate_content(
            prompt,
            generation_config=generation_config
        )
        data = json.loads(response.text)
        return data
    except Exception as e:
        logger.error(f"Gemini Career Path call failed: {e}. Falling back to default roadmap.")
        return get_fallback_career_path()

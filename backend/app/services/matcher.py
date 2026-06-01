from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.services.nlp_processor import preprocess_text

def calculate_match(
    resume_text: str,
    jd_text: str,
    resume_skills: list,
    jd_skills: list
) -> tuple:
  
    clean_resume = preprocess_text(resume_text)
    clean_jd = preprocess_text(jd_text)
    
    vectorizer = TfidfVectorizer(
        stop_words='english',   
        max_features=500        
    )
    
    tfidf_matrix = vectorizer.fit_transform([clean_resume, clean_jd])
    
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    
    match_percentage = round(float(similarity) * 100, 2)
    
    missing_skills = sorted(list(set(jd_skills) - set(resume_skills)))
    
    return match_percentage, missing_skills
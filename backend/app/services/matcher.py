from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_match(resume_text: str, jd_text: str, resume_skills: list, jd_skills: list):
    # TF-IDF Cosine Similarity
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
    score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    match_percentage = round(score * 100, 2)
    
    # Missing skills
    missing = list(set(jd_skills) - set(resume_skills))
    
    return match_percentage, missing
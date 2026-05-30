from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.services.nlp_processor import preprocess_text

def calculate_match(
    resume_text: str,
    jd_text: str,
    resume_skills: list,
    jd_skills: list
) -> tuple:
    """
    Calculates how well the resume matches the job description.
    
    Returns:
        - match_percentage: float between 0-100
        - missing_skills: list of skills in JD but not in resume
    """
    
    # --- Step 1: Preprocess both texts ---
    clean_resume = preprocess_text(resume_text)
    clean_jd = preprocess_text(jd_text)
    
    # --- Step 2: TF-IDF Vectorization ---
    # TfidfVectorizer converts text into a matrix of numbers.
    # Each unique word becomes a "dimension" in the vector space.
    vectorizer = TfidfVectorizer(
        stop_words='english',   # ignore "the", "is", "and" etc.
        max_features=500        # only use top 500 most important words
    )
    
    # fit_transform learns the vocabulary from BOTH documents,
    # then converts them into vectors
    tfidf_matrix = vectorizer.fit_transform([clean_resume, clean_jd])
    
    # tfidf_matrix[0] = resume vector
    # tfidf_matrix[1] = job description vector
    
    # --- Step 3: Cosine Similarity ---
    # Returns a 1x1 matrix like [[0.72]]
    # We extract the single value with [0][0]
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    
    # Convert from 0-1 scale to 0-100 percentage
    match_percentage = round(float(similarity) * 100, 2)
    
    # --- Step 4: Find Missing Skills ---
    # Set difference: JD skills that are NOT in resume skills
    missing_skills = sorted(list(set(jd_skills) - set(resume_skills)))
    
    return match_percentage, missing_skills
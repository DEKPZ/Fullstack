# backend/scanner.py

import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the spaCy model.
# You may need to download it first by running: python -m spacy download en_core_web_sm
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model 'en_core_web_sm' as it was not found...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def preprocess_text(text: str) -> str:
    """
    Preprocesses text by lemmatizing and removing stopwords and punctuation.
    """
    if not text:
        return ""
    doc = nlp(text.lower())
    # Keep tokens that are not stopwords, punctuation, or just whitespace
    processed_tokens = [
        token.lemma_ for token in doc if not token.is_stop and not token.is_punct and not token.is_space
    ]
    return " ".join(processed_tokens)

def calculate_match_score(student_text: str, internship_text: str) -> int:
    """
    Calculates a match score percentage between a student's profile and an
    internship's requirements using TF-IDF and cosine similarity.

    Args:
        student_text: A string containing the student's relevant information (e.g., skills, experience).
        internship_text: A string containing the internship's requirements (e.g., skills_required, description).

    Returns:
        An integer representing the match percentage (0-100).
    """
    processed_student_text = preprocess_text(student_text)
    processed_internship_text = preprocess_text(internship_text)

    if not processed_student_text or not processed_internship_text:
        return 0

    corpus = [processed_student_text, processed_internship_text]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    score = similarity_matrix[0][0]
    match_percentage = round(score * 100)

    return match_percentage


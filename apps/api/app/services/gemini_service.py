import google.generativeai as genai
from typing import Optional
from core.config import get_settings

settings = get_settings()

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def generate_recommendation_text(self, movies: list, user_preference: str) -> Optional[str]:
        """Generate recommendation text using Gemini AI"""
        if not self.model:
            return "Gemini API not configured"
        
        try:
            movie_titles = ", ".join([movie.get("title", "Unknown") for movie in movies])
            prompt = f"""
            Based on the user preference '{user_preference}' and these recommended movies: {movie_titles},
            please provide a brief recommendation explanation in a friendly tone.
            Keep it concise (2-3 sentences).
            """
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating recommendation text: {e}")
            return None
    
    def analyze_user_preference(self, preference_text: str) -> Optional[str]:
        """Analyze and expand on user's movie preference"""
        if not self.model:
            return "Gemini API not configured"
        
        try:
            prompt = f"""
            The user provided this movie preference: '{preference_text}'
            Please provide 2-3 movie genre or theme suggestions that match this preference.
            Format as a simple list.
            """
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error analyzing preference: {e}")
            return None

def get_gemini_service() -> GeminiService:
    return GeminiService()

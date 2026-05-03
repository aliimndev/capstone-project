#!/usr/bin/env python
"""Entry point for TMDB API FastAPI application."""
import sys
import os

# Add apps/api to Python path to resolve imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'apps', 'api'))

if __name__ == "__main__":
    try:
        # Import FastAPI app from modules
        from app.main import app  # type: ignore
    except ImportError:
        # Fallback: try direct import if package structure differs
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'apps', 'api', 'app'))
        from main import app  # type: ignore
    
    import uvicorn
    
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

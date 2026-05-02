from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import get_settings
from app.api.v1.endpoints import recommend

# Load settings
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    description="Backend for Movie Recommender",
    version=settings.API_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Konfigurasi CORS agar frontend Next.js bisa memanggil API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(recommend.router)

@app.get("/")
def read_root():
    return {
        "message": "RekoFilm API",
        "status": "running",
        "version": settings.API_VERSION,
        "docs": "/api/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is running"}

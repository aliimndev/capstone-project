from contextlib import asynccontextmanager
import logging
import sys
import threading

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import get_settings
from app.api.v1.endpoints import recommend
from app.services.recommender_service import get_recommender_service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

logging.getLogger("app.api.v1.endpoints.recommend").setLevel(logging.DEBUG)
logging.getLogger("app.services.recommender_service").setLevel(logging.DEBUG)

logger = logging.getLogger(__name__)

# Load settings
settings = get_settings()


def _load_model_background() -> None:
    """Load the recommender model in a background thread.

    This prevents the (potentially slow) model download / deserialization
    from blocking FastAPI startup, which is critical on Hugging Face Spaces
    where the platform expects the HTTP server to respond quickly.
    """
    service = get_recommender_service()
    try:
        service.load()
        logger.info("Background model loader: recommender service ready")
    except FileNotFoundError as exc:
        logger.warning("Background model loader: model not found — %s", exc)
    except Exception as exc:
        logger.exception("Background model loader: failed — %s", exc)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("FastAPI startup: launching background model loader")
    loader_thread = threading.Thread(
        target=_load_model_background, daemon=True, name="model-loader"
    )
    loader_thread.start()
    yield
    logger.info("FastAPI shutdown")


# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    description="Backend for Movie Recommender",
    version=settings.API_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# Konfigurasi CORS agar frontend Next.js bisa memanggil API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(recommend.router)


@app.get("/")
def read_root():
    return {
        "message": "wemovies.ai",
        "status": "running",
        "version": settings.API_VERSION,
        "docs": "/api/docs",
    }


@app.get("/health")
def health_check():
    service = get_recommender_service()
    return {
        "status": "healthy",
        "message": "API is running",
        "model_loaded": service.is_loaded,
        "model_status": "ready" if service.is_loaded else "loading",
    }

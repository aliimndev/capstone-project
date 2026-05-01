from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="RekoFilm API",
    description="Backend for Movie Recommender",
    version="1.0.0",
)

# Konfigurasi CORS agar frontend Next.js bisa memanggil API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Atur sesuai URL Frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello Pruy", "status": "running"}

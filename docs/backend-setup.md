# RekoFilm API - Backend Configuration

## Setup Selesai ✅

Backend FastAPI Anda telah dikonfigurasi untuk Vercel Deployment dan pengembangan lokal.

### 📁 File yang Telah Dibuat/Diperbarui:

1. **`apps/api/requirements.txt`** - Dependencies Python yang diperlukan
2. **`apps/api/.env`** - Environment variables untuk pengembangan lokal
3. **`apps/api/core/config.py`** - Konfigurasi aplikasi (baru)
4. **`apps/api/app/services/tmdb_service.py`** - TMDB API service (diperbarui)
5. **`apps/api/app/services/gemini_service.py`** - Gemini AI service (diperbarui)
6. **`apps/api/app/schemas/recommend.py`** - Data schemas untuk rekomendasi (diperbarui)
7. **`apps/api/app/api/v1/endpoints/recommend.py`** - Recommendation endpoints (diperbarui)
8. **`apps/api/app/main.py`** - FastAPI application setup (diperbarui)
9. **`vercel.json`** - Konfigurasi deployment Vercel (diperbarui)

### 🔧 Konfigurasi Lokal untuk Development

#### 1. Install Dependencies
```bash
cd apps/api
pip install -r requirements.txt
```

#### 2. TMDB API Key
File `.env` di `apps/api/` sudah dikonfigurasi dengan:
- **TMDB_API_KEY**: `5286b25ac216423c256473c1f0c9775c` (dari web `.env.local`)
- **GEMINI_API_KEY**: Ganti dengan API key Anda jika ingin menggunakan fitur AI

#### 3. Jalankan API Lokal
```bash
cd apps/api
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API akan berjalan di: `http://localhost:8000`
- Dokumentasi Swagger: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

### 📡 API Endpoints

#### 1. Search Movies
```
GET /api/v1/recommendations/search?q=Avatar
```

#### 2. Get Trending Movies
```
GET /api/v1/recommendations/trending?time_window=week
```

#### 3. Get Recommendations
```
POST /api/v1/recommendations/
```
Body:
```json
{
  "query": "action movies",
  "user_preference": "I like action and adventure films"
}
```

#### 4. Health Check
```
GET /health
```

### ☁️ Deployment ke Vercel

#### 1. Pastikan semua file sudah ter-commit
```bash
git add .
git commit -m "Setup backend API with FastAPI and TMDB integration"
```

#### 2. Push ke repository
```bash
git push
```

#### 3. Set Environment Variables di Vercel Dashboard

Buka dashboard Vercel proyek Anda dan tambahkan Environment Variables:

- **TMDB_API_KEY**: `5286b25ac216423c256473c1f0c9775c`
- **GEMINI_API_KEY**: (opsional, jika ada)

Atur untuk semua environments: Production, Preview, Development

#### 4. Vercel akan otomatis mendeploy

Setelah commit dan push ke repository yang terhubung Vercel, deployment akan dimulai secara otomatis.

### ✅ Verifikasi Deployment

Setelah deployment berhasil, test API Anda di:
- `https://your-vercel-domain.vercel.app/api/docs` - Swagger UI
- `https://your-vercel-domain.vercel.app/health` - Health check

### 🔗 Koneksi Frontend ke Backend

Frontend Next.js sudah siap untuk memanggil backend. Pastikan URL API di frontend mengarah ke:
- Local: `http://localhost:8000`
- Production: `https://your-vercel-domain.vercel.app` atau domain custom Anda

### 📝 Notes

- CORS sudah dikonfigurasi untuk `http://localhost:3000` dan `http://localhost:3001`
- `.env` files tidak akan ter-commit (ada di `.gitignore`)
- Backend berjalan sebagai Serverless Functions di Vercel
- API menggunakan FastAPI dengan Uvicorn server

### 🚀 Next Steps

1. Commit semua perubahan ke Git
2. Push ke repository GitHub/GitLab
3. Vercel akan otomatis mendeploy
4. Test API endpoints di Swagger UI (`/api/docs`)
5. Hubungkan frontend dengan backend API URLs yang tepat

Selamat! Backend Anda siap dijalankan! 🎉

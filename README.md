# WeMovies AI

Aplikasi rekomendasi film berbasis **hybrid machine learning** (Collaborative Filtering + Content-Based Filtering). Pengguna memilih dan memberi reaksi pada 3 film, lalu sistem menghasilkan 10 rekomendasi film yang relevan.

## Fitur Utama

- Pencarian dan browsing film via TMDB
- Rating 3 film dengan 4 tingkat reaksi: `loved it`, `like it`, `just normal`, `dislike`
- Rekomendasi personal dari model ML hybrid (`recommender_artifacts.pkl`)
- Fallback otomatis ke film trending jika film pilihan belum ada di katalog MovieLens
- Enrichment metadata film (poster, overview, rating) dari TMDB

## Arsitektur

```text
capstone-project/
├── apps/
│   ├── web/                 # Frontend — Next.js 16 + React 19 + Tailwind CSS
│   │   ├── app/             # App Router (pages & API routes)
│   │   ├── components/      # UI components
│   │   └── features/        # Feature modules (recommendation API client)
│   │
│   ├── api/                 # Backend — FastAPI + scikit-learn
│   │   ├── app/
│   │   │   ├── main.py      # FastAPI entry point
│   │   │   ├── api/v1/      # REST endpoints
│   │   │   ├── services/    # Business logic (recommender, TMDB)
│   │   │   └── schemas/     # Pydantic request/response models
│   │   ├── core/            # Settings & configuration
│   │   ├── model/           # ML artifact (not committed — download separately)
│   │   ├── scripts/         # Model verification utilities
│   │   └── tests/           # Automated tests
│   │
│   └── proxy/               # Optional Cloudflare Worker (TMDB proxy)
│       └── worker.ts
│
├── infra/
│   └── docker-compose.yml   # Local development with Docker
│
├── .github/workflows/       # CI/CD pipelines
├── package.json             # Monorepo root scripts
└── vercel.json              # Vercel deployment config (frontend)
```

### Alur Data

```text
Browser (Next.js)
    │
    ├── GET  /api/v1/recommendations/trending  ──► FastAPI ──► TMDB API
    ├── GET  /api/v1/recommendations/search    ──► FastAPI ──► TMDB API
    └── POST /api/v1/recommendations/          ──► FastAPI ──► RecommenderService
                                                              └──► TMDB API (enrichment)
```

Model ML dimuat sekali saat startup API dari `apps/api/model/recommender_artifacts.pkl`.

## Prasyarat

| Tool | Versi minimum |
|------|---------------|
| Node.js | 20+ |
| npm | 10+ |
| Python | 3.11+ |
| Git | any recent |

Anda juga membutuhkan:
- **TMDB API key** — daftar gratis di [themoviedb.org](https://www.themoviedb.org/settings/api)
- **Model artifact** (~216 MB) — diunduh dari Hugging Face (lihat langkah di bawah)

## Instalasi & Penyiapan

### 1. Clone repository

```bash
git clone <url-repository-anda>
cd capstone-project
```

### 2. Setup Backend (FastAPI)

```bash
cd apps/api

# Buat virtual environment
python3 -m venv .venv
source .venv/bin/activate        # Linux/macOS
# .venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Salin dan isi environment variables
cp .env.example .env
# Edit .env — masukkan TMDB_API_KEY Anda
```

### 3. Download Model ML

Model **tidak** disertakan di repository (ukuran ~216 MB). Unduh dari Hugging Face:

```bash
# Dari root project (pastikan venv API aktif)
npm run verify:model
```

Script ini akan:
1. Mengunduh `recommender_artifacts.pkl` dari Hugging Face
2. Memverifikasi integritas file (SHA256)
3. Menjalankan tes inference dan HTTP e2e

Alternatif manual:

```bash
mkdir -p apps/api/model
curl -L -o apps/api/model/recommender_artifacts.pkl \
  "https://huggingface.co/aliimndev/recommender_artifacts.pkl/resolve/main/recommender_artifacts.pkl"
```

### 4. Setup Frontend (Next.js)

```bash
# Dari root project
npm install

# Salin dan isi environment variables
cp apps/web/.env.local.example apps/web/.env.local
# Edit .env.local — masukkan TMDB_API_KEY dan NEXT_PUBLIC_API_URL
```

## Menjalankan Aplikasi

### Mode Development (lokal)

Jalankan backend dan frontend di terminal terpisah:

```bash
# Terminal 1 — API (port 8000)
npm run dev:api

# Terminal 2 — Web (port 3000)
npm run dev
```

Buka browser: **http://localhost:3000**

### Verifikasi Backend

```bash
# Health check
curl http://localhost:8000/health

# Swagger docs
# http://localhost:8000/api/docs
```

### Menjalankan Tes

```bash
npm run test:api
```

Tes mencakup:
- Model ter-load (`model_loaded: true`)
- Inference 10 rekomendasi dari 3 film rated
- Fallback ke top trending untuk film di luar katalog MovieLens

### Docker (opsional)

```bash
# Build image API saja
npm run docker:build
npm run docker:run

# Atau jalankan API + Web via docker-compose
npm run docker:up
```

> Pastikan file model sudah ada di `apps/api/model/` sebelum build Docker.

## Petunjuk Penggunaan

1. Buka halaman **Recommend** (`/recommend`)
2. Cari film via search bar 
3. Klik film → pilih reaksi (`loved it`, `like it`, `just normal`, `dislike`)
4. Ulangi hingga **3 film** ter-rate
5. Sistem otomatis menampilkan **10 rekomendasi** film

### API Endpoint Utama

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/health` | Status API & model |
| `POST` | `/api/v1/recommendations/` | Rekomendasi dari 3 film rated |
| `GET` | `/api/v1/recommendations/trending` | Film trending (TMDB) |
| `GET` | `/api/v1/recommendations/search?q=...` | Pencarian film (TMDB) |

### Contoh Request Rekomendasi

```json
POST /api/v1/recommendations/
Content-Type: application/json

{
  "rated_movies": [
    { "movie_id": 550, "reaction": "loved it" },
    { "movie_id": 278, "reaction": "like it" },
    { "movie_id": 680, "reaction": "just normal" }
  ]
}
```

- `movie_id` = TMDB movie ID
- Response: 10 film dengan metadata lengkap
- Film input **tidak** muncul di hasil rekomendasi

## Model ML

| Properti | Nilai |
|----------|-------|
| Tipe | Hybrid CF + CB |
| Alpha CF / CB | 0.65 / 0.35 |
| Katalog | ~80.000 film MovieLens |
| Mapping TMDB | ~80.000 ID |
| Latent matrix | (80318, 100) |
| Content features | (80318, 5019) |
| Hosting artifact | [Hugging Face](https://huggingface.co/aliimndev/recommender_artifacts.pkl) |

Bobot reaksi:

| Reaksi | Bobot |
|--------|-------|
| loved it | 2.0 |
| like it | 1.0 |
| just normal | 0.1 |
| dislike | -1.5 |

## Environment Variables

### Backend (`apps/api/.env`)

| Variable | Wajib | Deskripsi |
|----------|-------|-----------|
| `TMDB_API_KEY` | Ya | API key TMDB |
| `API_URL` | Tidak | URL publik backend (default: `http://localhost:8000`) |

### Frontend (`apps/web/.env.local`)

| Variable | Wajib | Deskripsi |
|----------|-------|-----------|
| `NEXT_PUBLIC_API_URL` | Ya | URL backend FastAPI |
| `TMDB_API_KEY` | Ya | API key TMDB (untuk API routes Next.js) |



## Deployment

| Komponen | Platform disarankan |
|----------|---------------------|
| Frontend | [Vercel](https://vercel.com) (sudah dikonfigurasi via `vercel.json`) |
| Backend + Model | [Hugging Face Spaces](https://huggingface.co/spaces) (Docker) |

Set `NEXT_PUBLIC_API_URL` di Vercel ke URL backend yang sudah di-deploy.

## Scripts Tersedia

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Jalankan frontend (port 3000) |
| `npm run dev:api` | Jalankan backend (port 8000) |
| `npm run test:api` | Jalankan pytest |
| `npm run verify:model` | Verifikasi model dari Hugging Face |
| `npm run docker:build` | Build Docker image API |
| `npm run docker:up` | Jalankan via docker-compose |
| `npm run worker:dev` | Dev Cloudflare Worker proxy |

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `model_loaded: false` | Pastikan `recommender_artifacts.pkl` ada di `apps/api/model/` |
| `503 Recommendation model is not available` | Jalankan `npm run verify:model` |
| CORS error di browser | Pastikan backend berjalan dan `NEXT_PUBLIC_API_URL` benar |
| Poster film kosong | Periksa `TMDB_API_KEY` valid dan koneksi internet |
| Cold start lambat (~3–4 detik) | Normal — model 216 MB dimuat saat startup |

## Lisensi & Kontribusi

Proyek capstone — WeMovies AI Team.

Untuk pertanyaan atau issue, buka tab **Issues** di repository GitHub.

# 🚀 DEPLOYMENT GUIDE - Full Stack to Vercel

## Overview
Proyek Anda adalah Full Stack Monorepo (Next.js Frontend + FastAPI Backend) yang siap di-deploy ke **Vercel**.

## ✅ What's Been Setup

### Backend (Python FastAPI)
- ✅ FastAPI application dengan TMDB API integration
- ✅ Environment variables configuration
- ✅ CORS middleware untuk komunikasi dengan frontend
- ✅ Movie recommendation endpoints
- ✅ Trending movies endpoint
- ✅ Search movies endpoint
- ✅ Ready untuk Vercel Serverless Functions

### Frontend (Next.js)
- ✅ Next.js aplikasi dengan TypeScript
- ✅ API integration setup
- ✅ Environment variables configuration

### Infrastructure
- ✅ `vercel.json` - Konfigurasi monorepo deployment
- ✅ `.gitignore` - Mencegah sensitive files ter-commit
- ✅ `requirements.txt` - Python dependencies

---

## 📋 STEP-BY-STEP DEPLOYMENT

### Step 1: Pastikan Semua File Ter-commit

```bash
# Navigate to project root
cd /home/alee/Destop/capstone/capstone-project

# Check git status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Setup complete: FastAPI backend + Next.js frontend for Vercel deployment"

# View changes to be pushed
git log --oneline -5
```

### Step 2: Push ke Repository

```bash
# Push to main/master branch
git push origin main
# atau jika branch namanya berbeda:
git push origin <your-branch-name>
```

### Step 3: Set Environment Variables di Vercel Dashboard

1. **Buka Vercel Dashboard**: https://vercel.com/dashboard
2. **Pilih project** Anda
3. **Masuk ke Settings** → **Environment Variables**
4. **Tambahkan variables berikut**:

#### Production Environment:
| Name | Value |
|------|-------|
| `TMDB_API_KEY` | `5286b25ac216423c256473c1f0c9775c` |
| `NEXT_PUBLIC_API_URL` | `https://your-vercel-domain.vercel.app` |

#### Preview & Development (opsional, tapi disarankan):
| Name | Value |
|------|-------|
| `TMDB_API_KEY` | `5286b25ac216423c256473c1f0c9775c` |
| `NEXT_PUBLIC_API_URL` | `https://your-preview-domain.vercel.app` |

5. **Jangan lupa**: Chekbox semua environment yang relevan (Production, Preview, Development)

### Step 4: Vercel akan Otomatis Deploy

⏳ Setelah push, Vercel akan:
1. Detect perubahan di repository
2. Install dependencies (npm + pip)
3. Build Next.js aplikasi
4. Deploy FastAPI sebagai serverless function
5. Configure routing

**Status deployment**: Lihat di Vercel Dashboard → Deployments

---

## 🧪 Testing Setelah Deployment

### 1. Test Health Check
```bash
curl https://your-vercel-domain.vercel.app/health
# Expected: {"status": "healthy", "message": "API is running"}
```

### 2. Test API Endpoints
```bash
# Search movies
curl "https://your-vercel-domain.vercel.app/api/v1/recommendations/search?q=Avatar"

# Trending movies
curl "https://your-vercel-domain.vercel.app/api/v1/recommendations/trending"

# View API docs
# Buka: https://your-vercel-domain.vercel.app/api/docs
```

### 3. Test Frontend
- Buka: `https://your-vercel-domain.vercel.app`
- Frontend seharusnya bisa memanggil backend API

---

## 🔧 TROUBLESHOOTING

### ❌ Error: "TMDB_API_KEY is not configured"
**Solusi**: 
- Pastikan `TMDB_API_KEY` sudah ditambahkan di Vercel Environment Variables
- Pastikan value-nya benar: `5286b25ac216423c256473c1f0c9775c`
- Trigger redeploy: Vercel Dashboard → Deployments → Click deployment → Redeploy

### ❌ Error: "Cannot find module tmdb_service"
**Solusi**:
- Pastikan semua files sudah ter-commit
- Check: `apps/api/app/services/tmdb_service.py` exists
- Pastikan `__init__.py` ada di semua directories

### ❌ Error: "ModuleNotFoundError: No module named 'requirements'"
**Solusi**:
- Pastikan `apps/api/requirements.txt` ter-format dengan baik
- Run locally: `pip install -r apps/api/requirements.txt` untuk verify

### ❌ API endpoints return 404
**Solusi**:
- Pastikan `vercel.json` routes sudah benar
- Check URL path: `/api/v1/...` bukan `/api/...`
- Pastikan `apps/api/app/main.py` include router dengan benar

---

## 🔌 Local Development

### Jalankan Backend Lokal
```bash
# Terminal 1 - Backend
cd apps/api
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# Backend di: http://localhost:8000
# Swagger UI: http://localhost:8000/api/docs
```

### Jalankan Frontend Lokal
```bash
# Terminal 2 - Frontend
cd apps/web
npm install
npm run dev

# Frontend di: http://localhost:3000
```

### Pastikan Frontend Terhubung ke Backend Lokal
- Edit `apps/web/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📁 Project Structure

```
capstone-project/
├── apps/
│   ├── api/                          # Backend (Python FastAPI)
│   │   ├── app/
│   │   │   ├── main.py              # FastAPI app entry
│   │   │   ├── api/v1/endpoints/    # API endpoints
│   │   │   ├── services/            # Business logic
│   │   │   └── schemas/             # Data models
│   │   ├── core/
│   │   │   └── config.py            # Configuration
│   │   ├── .env                     # Environment variables
│   │   ├── requirements.txt         # Python dependencies
│   │   └── SETUP.md                 # Backend setup guide
│   │
│   └── web/                         # Frontend (Next.js)
│       ├── app/                     # Next.js app directory
│       ├── components/              # React components
│       ├── features/                # Feature modules
│       ├── .env.local               # Local env
│       ├── .env.production.example  # Production env template
│       └── package.json
│
├── packages/
│   └── types/                       # Shared types
├── infra/
│   └── docker-compose.yml           # Docker setup (optional)
├── vercel.json                      # Vercel deployment config
├── .gitignore                       # Git ignore rules
└── README.md
```

---

## 🔐 Environment Variables Checklist

### Di Vercel Dashboard:
- [ ] `TMDB_API_KEY` = `5286b25ac216423c256473c1f0c9775c`
- [ ] `NEXT_PUBLIC_API_URL` = `https://your-vercel-domain.vercel.app`

### Di `.env.local` (Frontend - Local Development):
- [ ] `NEXT_PUBLIC_API_URL` = `http://localhost:8000`
- [ ] `TMDB_API_KEY` = `5286b25ac216423c256473c1f0c9775c`

### Di `.env` (Backend - Local Development):
- [ ] `TMDB_API_KEY` = `5286b25ac216423c256473c1f0c9775c`
- [ ] `GEMINI_API_KEY` = (optional)

---

## 🎯 Next Steps

1. ✅ Commit dan push code ke repository
2. ✅ Set Environment Variables di Vercel
3. ✅ Monitor deployment di Vercel Dashboard
4. ✅ Test endpoints di Swagger UI (`/api/docs`)
5. ✅ Test frontend dan pastikan bisa memanggil API
6. ✅ Setup custom domain (optional)

---

## 📞 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Swagger UI (Prod)**: https://your-vercel-domain.vercel.app/api/docs
- **Deployment Logs**: Vercel Dashboard → Deployments

---

## 📝 Important Notes

- 🔒 **JANGAN** commit `.env` files (di `.gitignore` sudah)
- 🔒 **JANGAN** share `TMDB_API_KEY` secara public
- ✅ **SELALU** set environment variables di Vercel Dashboard untuk production
- ✅ **SELALU** test di local sebelum push ke production
- ✅ Backend otomatis run sebagai Serverless Functions (tidak perlu manual server)

---

## ✨ Selamat! Anda siap untuk deployment!

Jika ada pertanyaan atau error, check:
1. Vercel Dashboard Logs
2. Network tab di browser (DevTools)
3. `/api/docs` untuk test endpoints

Good luck! 🚀

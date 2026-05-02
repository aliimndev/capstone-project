# Render Deployment Guide for FastAPI Backend

## Quick Setup untuk Deploy ke Render

### Step 1: Buat File `render.yaml` di root project
File ini sudah ada di proyek Anda. Render akan otomatis mendeteksi dan deploy.

### Step 2: Deploy ke Render

1. **Buka https://render.com**
2. **Buat akun** (atau login)
3. **Klik "New +"** → **"Web Service"**
4. **Pilih GitHub** → Authorize
5. **Pilih repository**: `aliimndev/capstone-project`
6. **Konfigurasi:**
   - **Name**: `capstone-api` (atau nama lain)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r apps/api/requirements.txt`
   - **Start Command**: `cd apps/api && uvicorn app.main:app --host 0.0.0.0 --port 8000`
   - **Branch**: `develop`

7. **Environment Variables** (Klik "Add Environment Variable"):
   - **TMDB_API_KEY**: `5286b25ac216423c256473c1f0c9775c`
   - **GEMINI_API_KEY**: (opsional)

8. **Klik "Create Web Service"**

### Step 3: Tunggu Deploy Selesai
Render akan:
- Clone repository
- Install dependencies
- Start FastAPI server
- Memberikan URL seperti: `https://capstone-api.onrender.com`

### Step 4: Update Frontend API URL

Setelah backend di-deploy ke Render, update di Vercel:

1. Buka **Vercel Dashboard** → Project Anda
2. **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_API_URL`:
   ```
   https://capstone-api.onrender.com
   ```
4. **Save** → Vercel akan auto-redeploy

### Step 5: Test API

```bash
curl https://capstone-api.onrender.com/health
```

---

## Detail Setup untuk Render

### File yang Render butuh:
- ✅ `apps/api/requirements.txt` - Sudah ada
- ✅ `apps/api/app/main.py` - Sudah ada
- ✅ Semua service files - Sudah ada

### Tips:
- Render memberikan **free tier** dengan uptime 750 jam/bulan
- Service akan auto-sleep jika tidak diakses selama 15 menit
- Untuk production, upgrade ke paid plan
- Backup URL: Jika ingin private deploy, gunakan Railway atau Fly.io

### Alternative Services:
- **Railway.app**: Upload langsung dari GitHub, auto-deploy
- **Fly.io**: Deploy dengan `fly deploy` command
- **Heroku**: (Berbayar, tapi mudah)

---

## Setelah Semua Setup:

```
Frontend (Vercel)
    ↓
https://your-domain.vercel.app
    ↓
Backend (Render)
    ↓
https://capstone-api.onrender.com/api/v1/...
```

---

## Untuk Mulai Deploy ke Render:

1. ✅ Git push sudah selesai
2. ⏳ Buka https://render.com dan follow steps di atas
3. ✅ Dapatkan URL backend
4. ⏳ Update `NEXT_PUBLIC_API_URL` di Vercel
5. ✅ Selesai!

Cost: **FREE** 🎉

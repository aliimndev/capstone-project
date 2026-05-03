# 🚀 CI/CD Setup Guide - GitHub Actions + Cloudflare Workers

## Overview
Automated deployment pipeline untuk TMDB API dengan:
- ✅ Automated testing & linting
- ✅ Docker image build & push
- ✅ Auto-deploy ke Cloudflare Workers
- ✅ Caching & performance optimization

---

## 📋 Prerequisites

1. **GitHub Repository** - Project sudah di-push ke GitHub
2. **Cloudflare Account** - Free tier cukup
3. **Docker Hub Account** - Untuk menyimpan image (optional, bisa pakai GitHub Container Registry)

---

## ⚙️ Step 1: Setup Cloudflare (5 menit)

### 1.1 Buat Cloudflare Account
```bash
# Visit: https://dash.cloudflare.com/sign-up
```

### 1.2 Get API Token
1. Buka Cloudflare Dashboard
2. Klik **Profile** (bottom left) → **API Tokens**
3. Klik **Create Token**
4. Pilih template "Edit Cloudflare Workers"
5. Review permissions, klik **Continue to summary**
6. Klik **Create Token**
7. **Copy token** (jangan share!)

### 1.3 Get Account ID
1. Di Cloudflare Dashboard, buka **Workers**
2. URL akan terlihat seperti: `https://dash.cloudflare.com/xxxxx/workers`
3. `xxxxx` adalah Account ID Anda

### 1.4 Buat Custom Domain (optional tapi recommended)
```bash
# Jika punya domain:
1. Add domain ke Cloudflare
2. Setup nameservers
3. Configure worker route

# Atau pakai subdomain gratis Cloudflare:
# https://<project-name>.<your-domain>.workers.dev
```

---

## 🔐 Step 2: Setup GitHub Secrets (3 menit)

1. **Buka GitHub Repository**
2. **Settings** → **Secrets and variables** → **Actions**
3. **Add Repository Secret** (3 buah):

| Secret Name | Value | Where to find |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Token dari Step 1.2 | Cloudflare Dashboard |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID dari Step 1.3 | Cloudflare Dashboard |
| `TMDB_API_KEY` | API key TMDB Anda | Environment var |

**Visual:**
```
https://github.com/YOUR_USERNAME/capstone/settings/secrets/actions
```

---

## 📦 Step 3: Setup Cloudflare Worker (5 menit)

### 3.1 Install Wrangler CLI
```bash
npm install -g wrangler
```

### 3.2 Login to Cloudflare
```bash
wrangler login
# Browser akan terbuka, approve akses
```

### 3.3 Test Worker Locally
```bash
cd /home/alee/Destop/capstone/capstone-project
wrangler dev apps/api/worker.ts
# Test: curl http://localhost:8787/health
```

### 3.4 Update wrangler.toml dengan domain Anda
```toml
[env.production]
routes = [
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

Atau keep default subdomain:
```
https://tmdb-api-prod.<your-worker>.workers.dev
```

---

## 🔄 Step 4: Trigger CI/CD Pipeline

### Option A: Automatic (recommended)
```bash
cd /home/alee/Destop/capstone/capstone-project

# 1. Make change to API
vim apps/api/app/main.py

# 2. Commit & push
git add apps/api/
git commit -m "feat: update trending endpoint"
git push origin main

# 3. GitHub Actions akan otomatis:
#    - Run tests
#    - Build Docker image
#    - Push ke registry
#    - Deploy ke Cloudflare
```

### Option B: Manual Trigger
```bash
# Di GitHub Actions tab, click "Run workflow"
```

---

## 📊 Step 5: Monitor Deployment

### View GitHub Actions Logs
1. **GitHub** → **Actions**
2. Klik latest workflow run
3. Lihat progress dari test → build → deploy

### Check Cloudflare Deployment
```bash
# Lihat active workers
wrangler deployments list --name tmdb-api-prod

# View logs
wrangler tail --env production

# Visit deployed worker
curl https://tmdb-api-prod.<account>.workers.dev/health
```

### Expected Response
```json
{
  "status": "healthy",
  "timestamp": "2024-05-03T10:30:00Z"
}
```

---

## 🧪 Testing Pipeline

### Test API Locally First
```bash
# 1. Start API
python app.py

# 2. Test endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/recommend
curl http://localhost:8000/api/v1/trending

# 3. Check if OK, push to trigger CI
```

### Test Worker Locally
```bash
wrangler dev apps/api/worker.ts
# Visit http://localhost:8787/health
```

---

## 🔌 Connect Frontend to API

### Update Frontend Environment
```bash
# apps/web/.env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
# atau
NEXT_PUBLIC_API_URL=https://tmdb-api-prod.<account>.workers.dev
```

### Update API Call in Frontend
```typescript
// apps/web/features/recommendation/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getTrendingMovies = async () => {
  const response = await fetch(`${API_URL}/api/v1/trending`);
  return response.json();
};
```

---

## 📈 Performance & Caching

### Worker Caching Strategy
```
- Trending movies: 1 hour cache
- Search results: 30 minutes cache
- Recommendations: 10 minutes cache
- Health check: 1 minute cache
```

### Monitor Cache Hit Rate
```bash
wrangler tail --env production | grep "cache"
```

---

## 🐛 Troubleshooting

### Issue: CI/CD fails on push
**Solution:**
```bash
# Check logs
git push origin main
# GitHub Actions tab → see error

# Common issues:
# 1. Missing secrets → Add to GitHub
# 2. Python syntax error → Run tests locally
# 3. Cloudflare auth → Check wrangler login
```

### Issue: Worker deployment fails
**Solution:**
```bash
# Test locally first
wrangler dev

# Check wrangler.toml config
# Verify CLOUDFLARE_API_TOKEN is valid
```

### Issue: Frontend can't reach API
**Solution:**
```bash
# 1. Check CORS headers
curl -H "Origin: http://localhost:3000" \
  https://api.yourdomain.com/health -v

# 2. Check API URL in .env
cat apps/web/.env.production

# 3. Verify worker is deployed
wrangler deployments list
```

---

## 📚 Useful Commands

```bash
# CI/CD monitoring
git log --oneline -10          # See recent commits

# Cloudflare Worker
wrangler login                 # Authenticate
wrangler deploy apps/api/worker.ts  # Manual deploy
wrangler tail --env production # Real-time logs
wrangler delete --name tmdb-api-prod # Remove worker

# Docker (manual)
docker build -t tmdb-api .    # Build image
docker run -p 8000:8000 tmdb-api  # Run locally

# Testing
python -m pytest apps/api/tests  # Run tests
black apps/api/app             # Format code
flake8 apps/api/app            # Lint
```

---

## ✅ Verification Checklist

- [ ] GitHub secrets added (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, TMDB_API_KEY)
- [ ] wrangler.toml configured with your domain/worker
- [ ] CI/CD workflow triggered (commit to main)
- [ ] GitHub Actions shows ✅ success
- [ ] Worker deployed to Cloudflare
- [ ] Can access `/health` endpoint
- [ ] Frontend can call API from worker

---

## 🎉 Next Steps

1. **Push to main** → CI/CD triggers automatically
2. **Monitor** GitHub Actions progress
3. **Test** API endpoints from Cloudflare Worker
4. **Connect** frontend to production API
5. **Monitor** performance with `wrangler tail`

---

**Need help?**
- Cloudflare Docs: https://developers.cloudflare.com/workers
- GitHub Actions: https://docs.github.com/en/actions
- Wrangler CLI: https://developers.cloudflare.com/workers/cli-wrangler

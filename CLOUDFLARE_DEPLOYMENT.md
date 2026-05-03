# 🚀 STEP-BY-STEP CLOUDFLARE DEPLOYMENT GUIDE

## Prerequisites (5 minutes)

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
# Verify
wrangler --version
```

### 2. Create Cloudflare Account
```
Visit: https://dash.cloudflare.com/sign-up
Create free account (gratis untuk testing)
```

### 3. Get Credentials from Cloudflare

#### A. Get Account ID
1. Buka: https://dash.cloudflare.com
2. Pilih Menu **Workers** (sebelah kiri)
3. Lihat URL: `https://dash.cloudflare.com/xxxxxxxxx/workers`
4. **Copas `xxxxxxxxx`** = Account ID Anda

#### B. Get API Token
1. Di Cloudflare Dashboard → **Profile** (bawah kiri)
2. Pilih **API Tokens**
3. Klik **Create Token**
4. Search template "Edit Cloudflare Workers" → klik **Use template**
5. Review permissions (biasanya sudah oke)
6. Klik **Create Token**
7. **Copas tokennya** (jangan sampai hilang!)

---

## Deployment Steps

### Step 1: Update wrangler.toml dengan domain Anda

```bash
cd /home/alee/Destop/capstone/capstone-project
```

Edit `wrangler.toml`:

**Option A: Pakai subdomain gratis Cloudflare**
```toml
name = "tmdb-api"
main = "apps/api/worker.ts"
compatibility_date = "2024-05-01"
compatibility_flags = ["nodejs_compat"]

[env.production]
name = "tmdb-api-prod"
# Subdomain akan auto-generated
```

**Option B: Pakai custom domain (jika punya)**
```toml
[env.production]
routes = [
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

### Step 2: Login ke Wrangler

```bash
wrangler login
```

Browser akan terbuka → Approve akses → Done!

### Step 3: Test Worker Locally (Recommended)

```bash
# Terminal 1: Start your API
cd /home/alee/Destop/capstone/capstone-project
python app.py

# Terminal 2: Start wrangler dev server
wrangler dev apps/api/worker.ts --local

# Terminal 3: Test endpoint
curl http://localhost:8787/health
```

Expected output:
```json
{
  "status": "healthy",
  "timestamp": "2024-05-03T10:30:00Z"
}
```

### Step 4: Deploy Worker ke Cloudflare

```bash
# First time deployment
wrangler deploy apps/api/worker.ts --env production

# Output akan terlihat seperti:
# ✓ Deployed to ...
# Preview URL: https://tmdb-api-prod.<random>.workers.dev
```

### Step 5: Set Environment Variables

#### Option A: Via CLI
```bash
wrangler secret put TMDB_API_KEY --env production
# Paste your TMDB API key when prompted
```

#### Option B: Via wrangler.toml (NOT recommended untuk secrets)
```toml
[env.production.vars]
ENVIRONMENT = "production"
```

### Step 6: Verify Deployment

```bash
# Check deployed workers
wrangler deployments list --name tmdb-api-prod

# Check worker is running
curl https://tmdb-api-prod.<account>.workers.dev/health

# Watch live logs
wrangler tail --env production
```

---

## 🔗 After Deployment - Update Frontend

Edit `apps/web/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://tmdb-api-prod.<account>.workers.dev
```

Update `apps/web/features/recommendation/api.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getTrendingMovies = async () => {
  const response = await fetch(`${API_URL}/api/v1/trending`);
  return response.json();
};

export const getRecommendations = async (movieId: number) => {
  const response = await fetch(`${API_URL}/api/v1/recommend?movie_id=${movieId}`);
  return response.json();
};
```

---

## 🐛 Troubleshooting

### Error: "Cannot find account ID"
```bash
# Solution: Login dulu
wrangler login

# Then check config
cat wrangler.toml
```

### Error: "Unauthorized - Invalid token"
```bash
# Solution: Token sudah expired atau salah
wrangler logout
wrangler login  # Login ulang
```

### Worker returns 502 error
```bash
# Check logs
wrangler tail --env production

# Common reasons:
# 1. API backend tidak jalan
# 2. CORS issue
# 3. Backend URL salah di .env
```

### Can't connect to backend API
```bash
# Update wrangler.toml dengan backend URL yang tepat
[env.production.vars]
API_BACKEND_URL = "https://your-api-backend.com"

# atau untuk local:
# API_BACKEND_URL = "http://localhost:8000"
```

### Deployment timeout
```bash
# Cloudflare sometimes takes time
# Try again:
wrangler deploy apps/api/worker.ts --env production --verbose
```

---

## 📊 Monitoring Deployment

### Real-time Logs
```bash
wrangler tail --env production
# Lihat semua request masuk ke worker
```

### View Deployments
```bash
wrangler deployments list --name tmdb-api-prod --limit 10
```

### Check Worker Status
```bash
wrangler status --env production
```

---

## 🔐 Security Best Practices

### 1. Secrets Management
```bash
# JANGAN simpan di wrangler.toml atau .env
# Gunakan wrangler secret untuk production secrets

wrangler secret put TMDB_API_KEY --env production
wrangler secret put DATABASE_URL --env production

# Lihat secrets (tidak bisa)
# wrangler secret list # Tidak menampilkan nilai
```

### 2. Environment Separation
```toml
[env.development]
vars = { ENVIRONMENT = "development" }

[env.production]
vars = { ENVIRONMENT = "production" }
```

### 3. Rate Limiting (built-in Cloudflare)
Worker sudah ada CORS protection, tinggal set di Cloudflare Dashboard jika perlu strict limits.

---

## 🚀 Full Deployment Workflow

```
1. LOKAL TEST
   python app.py
   wrangler dev apps/api/worker.ts

2. LOGIN CLOUDFLARE
   wrangler login

3. DEPLOY
   wrangler deploy apps/api/worker.ts --env production

4. SET SECRETS
   wrangler secret put TMDB_API_KEY --env production

5. VERIFY
   curl https://tmdb-api-prod.<account>.workers.dev/health

6. UPDATE FRONTEND .env
   NEXT_PUBLIC_API_URL=https://tmdb-api-prod.<account>.workers.dev

7. MONITOR
   wrangler tail --env production
```

---

## 💡 Pro Tips

### Faster Iterative Development
```bash
# Dev loop
1. Make changes locally
2. wrangler dev (test at localhost:8787)
3. wrangler deploy (push to production)
4. wrangler tail (monitor logs)
```

### Custom Domain Setup (Advanced)
```bash
# If you have domain pointing to Cloudflare:
1. wrangler route create https://api.yourdomain.com/* --zone-id <zone-id> --pattern <pattern>

# Find zone ID:
# Cloudflare Dashboard → Select domain → Copy Zone ID
```

### Rollback to Previous Deployment
```bash
wrangler deployments list --name tmdb-api-prod
wrangler deployments rollback --name tmdb-api-prod
```

---

## 📚 Command Reference

```bash
# Authentication
wrangler login              # Login to Cloudflare
wrangler logout             # Logout

# Deployment
wrangler deploy             # Deploy to production
wrangler deploy --env staging  # Deploy to staging env
wrangler publish            # Alternative deploy command

# Development
wrangler dev                # Start local dev server
wrangler dev --local        # Local mode (no Cloudflare)
wrangler dev --ip 0.0.0.0   # Accessible from network

# Logs & Monitoring
wrangler tail               # Stream live logs
wrangler tail --env production  # Specific env logs

# Configuration
wrangler secret put KEY     # Add secret
wrangler secret delete KEY  # Remove secret
wrangler info               # Show worker info

# Cleanup (if needed)
wrangler delete --name tmdb-api-prod  # Delete worker
```

---

## ✅ Deployment Checklist

- [ ] Cloudflare account created
- [ ] API Token copied
- [ ] Account ID copied
- [ ] Wrangler installed (`npm install -g wrangler`)
- [ ] Logged in to Wrangler (`wrangler login`)
- [ ] Tested locally (`wrangler dev`)
- [ ] Deployed (`wrangler deploy`)
- [ ] Secrets set (`wrangler secret put`)
- [ ] Verified with curl
- [ ] Frontend .env updated
- [ ] Monitoring logs configured

---

## 🎉 Success Indicators

After deployment, you should:
1. See worker URL: `https://tmdb-api-prod.<account>.workers.dev`
2. Health check works: `curl https://.../health`
3. API endpoints respond: `curl https://.../api/v1/trending`
4. Logs visible: `wrangler tail`
5. Frontend can call API without CORS errors

---

## 🆘 Quick Support

| Issue | Solution |
|-------|----------|
| "Worker not found" | Run `wrangler deploy` first |
| 502 Bad Gateway | Check backend API is running, check logs |
| CORS error | Worker already handles CORS, check frontend URL |
| Slow response | Check Cloudflare cache TTL, use `wrangler tail` to debug |
| Can't login | Try `wrangler logout` then `wrangler login` |

---

**Ready to deploy? Let's go! 🚀**

Next command: `wrangler login`

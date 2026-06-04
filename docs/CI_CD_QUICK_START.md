# ⚡ Quick Reference - CI/CD Setup

## 📝 3-Minute Summary

You're setting up automated deployment for your TMDB API from GitHub → Cloudflare Workers.

### What happens when you push?
```
git push → GitHub detects → Actions runs → Docker builds → Deploys to Cloudflare
```

---

## 🚀 5 Steps to Get Started

### 1. Setup Cloudflare (5 min)
```
Sign up: https://dash.cloudflare.com/sign-up
Get: Account ID + API Token
```

### 2. Add GitHub Secrets (2 min)
```
https://github.com/YOUR_USERNAME/capstone/settings/secrets/actions

Add 3 secrets:
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID  
- TMDB_API_KEY
```

### 3. Install Local Tools (3 min)
```bash
npm install -g wrangler
wrangler login
pip install -r apps/api/requirements.txt
```

### 4. Test Locally (2 min)
```bash
python app.py
curl http://localhost:8000/health  # Should work
```

### 5. Push & Deploy (1 min)
```bash
git add .
git commit -m "ci: add GitHub Actions CI/CD"
git push origin main
# Watch at: https://github.com/YOUR_USERNAME/capstone/actions
```

---

## 📚 Documentation Map

| File | Purpose | When to read |
|------|---------|--------------|
| **CI_CD_SETUP.md** | Complete setup guide | First time setup |
| **DEVELOPMENT.md** | Local dev & testing | Before each push |
| **CI_CD_ARCHITECTURE.md** | How it all works | Understand the system |
| **.github/workflows/** | The actual pipeline | Debugging issues |

---

## 🎯 Before Every Push

```bash
# 1. Format code
black apps/api/app

# 2. Lint check
npm run lint:api

# 3. Test API locally
python app.py
# In another terminal:
curl http://localhost:8000/health

# 4. Push
git push origin main
```

---

## ✅ Verify Deployment

### Check GitHub Actions
```
https://github.com/YOUR_USERNAME/capstone/actions
Look for: ✅ All jobs passed
```

### Check Worker Deployed
```bash
wrangler deployments list --name tmdb-api-prod
curl https://tmdb-api-prod.<account>.workers.dev/health
```

---

## 🔑 Key Files Created

```
.github/workflows/
  └─ api-ci-cd.yml          # GitHub Actions configuration
  
Dockerfile                  # Docker image builder
wrangler.toml              # Cloudflare Worker config
apps/api/
  ├─ worker.ts             # Cloudflare Worker
  └─ .env.example          # Environment template

Documentation:
  ├─ CI_CD_SETUP.md        # Setup guide
  ├─ DEVELOPMENT.md        # Dev guide
  └─ CI_CD_ARCHITECTURE.md # Architecture
```

---

## 📊 Pipeline Jobs

1. **TEST** (Python linter & tests)
2. **BUILD** (Docker image creation)
3. **DEPLOY** (Cloudflare Workers)

**Total time: 3-5 minutes**

---

## 🌐 Result

After first successful deploy:
- **API URL**: `https://tmdb-api-prod.<account>.workers.dev`
- **Served from**: Cloudflare's global network
- **Updates**: Automatic on every `git push main`

---

## 💬 Quick Commands

```bash
# Development
npm run worker:dev         # Test worker locally
python app.py              # Run API locally
npm run lint:api           # Check code

# Deployment
npm run worker:deploy      # Manual deploy
git push origin main       # Trigger full CI/CD

# Monitoring
wrangler tail              # Watch logs
```

---

## 🆘 Need Help?

1. **Setup issues?** → Read `CI_CD_SETUP.md`
2. **Local testing?** → Read `DEVELOPMENT.md`
3. **Pipeline failed?** → Check GitHub Actions logs
4. **How it works?** → Read `CI_CD_ARCHITECTURE.md`

---

## ✨ Next Steps

- [ ] Create Cloudflare account
- [ ] Add GitHub secrets
- [ ] Install wrangler
- [ ] Test locally
- [ ] Push to main
- [ ] Watch pipeline run
- [ ] Verify deployment
- [ ] Update frontend API URL

**Time estimate: 20-30 minutes total setup**

---

**You got this! 🚀 Push to main and let the automation do the rest.**

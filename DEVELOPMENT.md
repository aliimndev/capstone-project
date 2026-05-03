# 🔧 Local Development & Testing Guide

## Quick Start

### 1️⃣ Setup Local Environment

```bash
cd /home/alee/Destop/capstone/capstone-project

# Install Node dependencies (for worker dev)
npm install

# Create Python virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r apps/api/requirements.txt
pip install pytest black flake8  # dev dependencies
```

### 2️⃣ Run API Locally

```bash
# Terminal 1: Start API server
python app.py
# Output: INFO:     Uvicorn running on http://0.0.0.0:8000

# Terminal 2: Test endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/trending
```

### 3️⃣ Test & Lint Before Pushing

```bash
# Linting
npm run lint:api

# Format code
black apps/api/app

# Run tests (if you have them)
npm run test:api
```

---

## 🐳 Docker Development

### Build & Run Locally

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# Test container
curl http://localhost:8000/health
```

### Check Docker Image Size

```bash
docker images tmdb-api
# Should be ~150-200MB (slim base image)
```

---

## ☁️ Cloudflare Worker Development

### Setup

```bash
# Login to Cloudflare (one-time)
wrangler login

# Install dependencies for worker dev
npm install wrangler --save-dev
```

### Run Locally

```bash
# Terminal 1: Start worker
npm run worker:dev
# Output: ⛅ wrangler (version X.X.X) is installed globally.
#         Ready on http://localhost:8787

# Terminal 2: Test worker
curl http://localhost:8787/health
curl http://localhost:8787/api/v1/trending
```

### Deploy to Cloudflare

```bash
npm run worker:deploy
```

---

## 📋 Pre-Push Checklist

Before pushing to `main` branch:

```bash
# 1. Run linter
npm run lint:api          # Should pass with no errors

# 2. Format code
black apps/api/app        # Auto-formats if needed

# 3. Test API
npm run test:api          # All tests pass

# 4. Test Docker build
npm run docker:build      # Should build without errors

# 5. Test worker locally
npm run worker:dev
# In another terminal: curl http://localhost:8787/health

# 6. Check changes
git status
git diff apps/api/

# 7. Commit with clear message
git add apps/api/
git commit -m "feat: add new endpoint | fix: bug in trending | refactor: improve performance"
git push origin main
```

---

## 🚀 GitHub Actions Pipeline Flow

Once you push to `main`:

```
1. PUSH TO MAIN
    ↓
2. GITHUB ACTIONS TRIGGER
    ├── Test Job (Python 3.11)
    │   ├── Linting with flake8
    │   ├── Format check with black
    │   └── Run pytest
    │
    ├── Build Job (if tests pass)
    │   ├── Build Docker image
    │   ├── Login to GitHub Container Registry
    │   └── Push image
    │
    └── Deploy Job (only on main branch)
        ├── Install wrangler
        ├── Deploy to Cloudflare Workers
        └── Set environment variables
        ↓
    ✅ API available at https://tmdb-api-prod.{account}.workers.dev
```

---

## 🔍 Debugging

### API not starting locally?

```bash
# Check Python version
python --version  # Should be 3.11+

# Check dependencies
pip list | grep fastapi
pip list | grep uvicorn

# Run with debug
python app.py  # Watch for error messages

# Check port 8000 is not in use
lsof -i :8000
```

### Docker build fails?

```bash
# see detailed build output
docker build -t tmdb-api:latest . --verbose

# Check file paths
ls -la apps/api/requirements.txt
ls -la apps/api/app/main.py
```

### Worker dev fails?

```bash
# Check wrangler is installed
wrangler --version

# Check config file
cat wrangler.toml

# Test just the worker file
wrangler publish apps/api/worker.ts --dry-run
```

### GitHub Actions stuck?

```bash
# View logs
# https://github.com/username/capstone/actions

# Check secrets are set
# https://github.com/username/capstone/settings/secrets/actions

# Manually trigger
# Actions tab → workflow → Run workflow
```

---

## 📊 Performance Tips

### API Performance
- Add caching headers to responses
- Use pagination for large datasets
- Minimize TMDB API calls

### Worker Performance
- Worker caches responses (see CI_CD_SETUP.md)
- Edge locations reduce latency
- Monitor with `wrangler tail`

---

## 🎯 Common Commands Quick Reference

```bash
# Development
npm run dev              # Start frontend dev server
npm run worker:dev      # Start worker locally

# Testing
npm run lint:api        # Check code style
npm run test:api        # Run tests
black apps/api/app      # Auto-format code

# Docker
npm run docker:build    # Build image
npm run docker:run      # Run container

# Deployment
npm run worker:deploy   # Deploy to Cloudflare
git push origin main    # Trigger full CI/CD

# Monitoring
wrangler tail           # Watch worker logs
```

---

## ✅ Troubleshooting Flowchart

```
Problem: API won't start locally
→ Check: python --version (3.11+)
→ Check: pip list | grep fastapi
→ Check: lsof -i :8000 (port free?)
→ Solution: pip install -r apps/api/requirements.txt && python app.py

Problem: Tests fail
→ Check: npm run lint:api
→ Check: black apps/api/app (format)
→ Check: pytest apps/api/tests
→ Solution: Fix issues, re-run

Problem: Docker build fails
→ Check: ls apps/api/requirements.txt
→ Check: docker build -t test . --verbose
→ Solution: Check Dockerfile paths

Problem: GitHub Actions fails
→ Check: GitHub Actions logs
→ Check: secrets configured
→ Solution: Review error, fix, push again

Problem: Worker deployment fails
→ Check: wrangler login
→ Check: CLOUDFLARE_API_TOKEN secret
→ Check: wrangler deploy --dry-run
→ Solution: Fix auth, re-deploy
```

---

## 📝 Commit Message Examples

```bash
git commit -m "feat: add recommendation filtering by genre"
git commit -m "fix: CORS headers in worker"
git commit -m "refactor: improve TMDB API error handling"
git commit -m "docs: update CI/CD guide"
git commit -m "chore: update dependencies"
```

---

**Ready to push? Use the checklist above! 🚀**

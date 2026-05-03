#!/bin/bash
# Setup Guide for CI/CD - Interactive Helper

echo "🚀 CAPSTONE CI/CD SETUP HELPER"
echo "================================"
echo ""
echo "This script will guide you through the setup process."
echo ""

# Step 1: Check prerequisites
echo "📋 STEP 1: Checking Prerequisites"
echo "-----------------------------------"

if ! command -v git &> /dev/null; then
    echo "❌ Git not installed"
else
    echo "✅ Git installed: $(git --version)"
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not installed"
else
    echo "✅ Python3 installed: $(python3 --version)"
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not installed"
else
    echo "✅ npm installed: $(npm --version)"
fi

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not installed (optional, but recommended)"
else
    echo "✅ Docker installed: $(docker --version)"
fi

echo ""
echo "📌 NEXT STEPS:"
echo "-----------------------------------"
echo ""
echo "1️⃣  CLOUDFLARE SETUP"
echo "   • Go to: https://dash.cloudflare.com/sign-up"
echo "   • Create free account"
echo "   • Copy your Account ID"
echo "   • Create API Token (Workers edit permission)"
echo ""

echo "2️⃣  GITHUB SECRETS"
echo "   • Go to: https://github.com/YOUR_USERNAME/capstone"
echo "   • Settings → Secrets and variables → Actions"
echo "   • Add 3 secrets:"
echo "     - CLOUDFLARE_API_TOKEN"
echo "     - CLOUDFLARE_ACCOUNT_ID"
echo "     - TMDB_API_KEY"
echo ""

echo "3️⃣  LOCAL SETUP"
echo "   • Run: npm install -g wrangler"
echo "   • Run: wrangler login"
echo "   • Run: python -m venv venv"
echo "   • Run: source venv/bin/activate"
echo "   • Run: pip install -r apps/api/requirements.txt"
echo ""

echo "4️⃣  TEST LOCALLY"
echo "   • Run: python app.py"
echo "   • Test: curl http://localhost:8000/health"
echo ""

echo "5️⃣  PUSH TO GITHUB"
echo "   • Run: git add ."
echo "   • Run: git commit -m 'ci: add GitHub Actions CI/CD'"
echo "   • Run: git push origin main"
echo ""

echo "6️⃣  MONITOR DEPLOYMENT"
echo "   • Watch: https://github.com/YOUR_USERNAME/capstone/actions"
echo ""

echo "📚 Documentation files created:"
echo "   • CI_CD_SETUP.md - Detailed setup guide"
echo "   • DEVELOPMENT.md - Local development guide"
echo "   • Dockerfile - Container configuration"
echo "   • .github/workflows/api-ci-cd.yml - CI/CD pipeline"
echo "   • apps/api/worker.ts - Cloudflare Worker"
echo ""

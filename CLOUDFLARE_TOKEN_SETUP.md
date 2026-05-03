# 🔑 Cloudflare API Token Setup Guide

## ❌ Current Issue
API Token `cfut_hgX7yWuF2Wmmo02hi7nvsUODGcWNIXGqST78DI6111bf2e42` is **INVALID** and needs to be recreated.

## ✅ Required Permissions

For Cloudflare Workers deployment, the API token needs these permissions:

### Account Permissions:
- **Cloudflare Workers:Edit** - Required to deploy and manage workers
- **Account Settings:Read** - Required to verify account access

### Zone Permissions (if using custom domain):
- **Zone:Read** - Required to manage DNS settings
- **Zone Settings:Edit** - Required for custom domain configuration

## 🔧 Creating New API Token

### Step 1: Go to Cloudflare Dashboard
1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click your profile → **My Profile**
3. Click **API Tokens** tab

### Step 2: Create Custom Token
1. Click **Create Token**
2. Choose **Custom token** template
3. Configure permissions:

#### Account Permissions:
- **Cloudflare Workers**: `Edit`
- **Account Settings**: `Read`

#### Zone Resources (optional):
- **Zone**: `Read` 
- **Zone Settings**: `Edit`
- **Zone Resources**: `All zones` or specific domain

### Step 3: Set Token Conditions
- **TTL**: Keep default (or set to custom expiry)
- **IP Address Filtering**: Leave empty (unless needed)

### Step 4: Create and Copy
1. Click **Continue to summary**
2. Review permissions
3. Click **Create Token**
4. **IMPORTANT:** Copy the new token immediately!

## 🔄 Update GitHub Secrets

Once you have the new token:

### Method 1: Via GitHub UI
1. Go to repository: https://github.com/aliimndev/capstone-project
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `CLOUDFLARE_API_TOKEN`
5. Value: [PASTE NEW TOKEN HERE]
6. Click **Add secret**

### Method 2: Via CLI (if you have gh CLI)
```bash
gh secret set CLOUDFLARE_API_TOKEN --body "YOUR_NEW_TOKEN_HERE"
```

## 🧪 Verify Token Works

After updating the secret:

```bash
# Test token locally
curl "https://api.cloudflare.com/client/v4/user/tokens/verify" \
-H "Authorization: Bearer YOUR_NEW_TOKEN"

# Should return: {"success":true,"result":{"id":"...","status":"active"}}
```

## 🚀 Trigger New Deployment

After updating the token:

1. Go to: https://github.com/aliimndev/capstone-project/actions
2. Click **Deploy to Cloudflare Workers** workflow
3. Click **Run workflow**
4. Select **main** branch
5. Click **Run workflow**

## 📋 Expected Result

After successful deployment:
- API will be live at: `https://tmdb-api-prod.devaliimn.workers.dev`
- Health check: `https://tmdb-api-prod.devaliimn.workers.dev/health`
- TMDB endpoint: `https://tmdb-api-prod.devaliimn.workers.dev/api/v1/recommendations/trending`

## 🚨 Troubleshooting

### If deployment still fails:
1. **Check token permissions** - Ensure all required permissions are granted
2. **Check account ID** - Verify `201fe0617db9cf5383f0008862507bf5` is correct
3. **Check worker name** - Verify `tmdb-api-prod` matches `wrangler.toml`

### Common errors:
- `Invalid access token` → Token expired or wrong permissions
- `Authentication error` → Missing required permissions
- `Worker not found` → Wrong account ID or worker name

---

**🎯 Action Required: Create new API token and update GitHub secrets!**

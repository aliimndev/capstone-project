# 🚨 Deployment Fix - Cloudflare API Token Issue

## Masalah
Deployment ke Cloudflare Workers gagal dengan error:
```
✘ [ERROR] In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN environment variable for wrangler to work.
```

## ✅ Solusi

### 1. **Setup GitHub Secrets (Wajib!)**

Di repository GitHub kamu, buka `Settings > Secrets and variables > Actions` dan tambahkan:

#### a. Cloudflare API Token
- **Name:** `CLOUDFLARE_API_TOKEN`
- **Value:** Token dari Cloudflare

**Cara membuat token:**
1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Klik profile > **My Profile > API Tokens**
3. Klik **Create Token**
4. Pilih template **Custom token**
5. Berikan permissions:
   - **Account:** `Cloudflare Workers:Edit`
   - **Zone:** `Zone:Read` (jika menggunakan custom domain)
   - **Zone Resources:** `Include All zones` atau spesifik domain kamu
6. Klik **Continue to summary** > **Create Token**

#### b. TMDB API Key
- **Name:** `TMDB_API_KEY`
- **Value:** API key dari TMDB

### 2. **Update Vercel Environment Variables**

Jika kamu deploy ke Vercel, tambahkan environment variables:

1. Buka project Vercel kamu
2. Go to **Settings > Environment Variables**
3. Tambahkan:
   - `CLOUDFLARE_API_TOKEN` (token dari Cloudflare)
   - `TMDB_API_KEY` (API key dari TMDB)

### 3. **Manual Deployment ( jika tidak pakai CI/CD )**

```bash
# Set environment variables
export CLOUDFLARE_API_TOKEN="your_token_here"
export TMDB_API_KEY="your_tmdb_key_here"

# Deploy
npm run worker:deploy
```

## 🔄 Deployment Workflow

GitHub Actions workflow sudah dibuat di `.github/workflows/deploy.yml` yang akan:

1. ✅ Otomatis setup environment
2. ✅ Install dependencies
3. ✅ Set TMDB API key sebagai secret
4. ✅ Deploy ke production

## 🧪 Testing Setelah Fix

Setelah deployment berhasil:

```bash
# Health check
curl https://tmdb-api-prod.devaliimn.workers.dev/health

# Test trending movies
curl https://tmdb-api-prod.devaliimn.workers.dev/api/v1/recommendations/trending
```

## 📝 Checklist Sebelum Deploy

- [ ] GitHub secrets sudah di-set (`CLOUDFLARE_API_TOKEN`, `TMDB_API_KEY`)
- [ ] Repository sudah push ke main branch
- [ ] Workflow GitHub Actions sudah aktif
- [ ] Custom domain (jika ada) sudah dikonfigurasi di `wrangler.toml`

## 🔧 Troubleshooting

### Token tidak valid
- Pastikan token memiliki permission yang cukup
- Cek expiry date token
- Regenerate token jika perlu

### Environment variables tidak terbaca
- Pastikan nama secrets tepat (case-sensitive)
- Cek workflow logs untuk memastikan variables ter-load

### Worker gagal deploy
- Cek syntax di `apps/api/worker.ts`
- Pastikan semua dependencies terinstall
- Validasi `wrangler.toml` configuration

---

**Setelah setup ini, deployment kamu seharusnya berhasil! 🚀**

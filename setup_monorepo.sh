#!/bin/bash
set -e

echo "Memulai setup struktur monorepo untuk movie-recommender-app..."

# Pindah ke root project
cd /home/alee/Destop/capstone/movie-recommender-app

# 1 & 2. Inisialisasi git (hapus .git lama jika ada untuk mulai segar, opsional)
rm -rf .git
git init

# 3. Buat .gitignore
cat << 'EOF' > .gitignore
# Node
node_modules/
.next/
dist/
build/

# Python
__pycache__/
*.py[cod]
*$py.class
venv/
.env

# OS
.DS_Store
EOF

# 4. Buat README.md
echo "# RekoFilm" > README.md

# 5. Buat folder infra/ dan docker-compose.yml
mkdir -p infra
touch infra/docker-compose.yml

# 6. Buat packages/types/recommendation.ts
mkdir -p packages/types
touch packages/types/recommendation.ts

# 7. Setup Frontend (apps/web/)
mkdir -p apps/web
cd apps/web

# Jalankan instalasi Next.js (secara otomatis menjawab 'yes' pada konfigurasi default terkait jika ada prompt)
echo "Menginstal Next.js di apps/web..."
npx create-next-app@latest . --typescript --tailwind --app --import-alias "@/*" --use-npm --no-git -y

# Hapus page.tsx dari Next.js dan ganti dengan placeholder
echo "// Halaman utama RekoFilm" > app/page.tsx

# Buat folder & file tambahan di Frontend
mkdir -p app/recommend
touch app/recommend/page.tsx

mkdir -p components

mkdir -p features/recommendation
echo "// hooks.ts" > features/recommendation/hooks.ts
echo "// api.ts" > features/recommendation/api.ts
echo "// types.ts" > features/recommendation/types.ts

mkdir -p lib public styles
touch .env.local

cd ../../

# 8. Setup Backend (apps/api/)
mkdir -p apps/api
cd apps/api

echo "Mengatur virtual environment Python di apps/api..."
python3 -m venv venv

# Buat struktur folder Backend
mkdir -p app/core app/api/v1/endpoints app/services app/schemas app/utils

# Buat file-file Python dengan placeholder
echo "# main.py - Entry point FastAPI" > app/main.py
echo "# config.py - Configuration" > app/core/config.py
echo "# recommend.py - Recommend endpoint" > app/api/v1/endpoints/recommend.py
echo "# gemini_service.py" > app/services/gemini_service.py
echo "# tmdb_service.py" > app/services/tmdb_service.py
echo "# recommend.py - Schemas" > app/schemas/recommend.py

# Buat requirements.txt dan .env kosong
touch requirements.txt
touch .env

cd ../../

# Hapus folder lama (frontend dan backend) karena sudah dipindah ke apps/
echo "Menghapus folder setup lama agar bersih..."
rm -rf frontend backend
rm -rf setup.sh

echo "======================================"
echo "Selesai! Struktur Monorepo berhasil dibuat."
echo "Untuk Backend, silakan jalankan: source apps/api/venv/bin/activate"

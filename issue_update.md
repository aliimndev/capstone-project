Pembaruan struktur direktori saat ini telah bermigrasi menjadi arsitektur **Monorepo** untuk memisahkan bagian backend (FastAPI) dan frontend (Next.js) dengan lebih baik dan terstruktur rapi.

Rincian pembaruan struktur:
- `apps/web/`: Memuat instalasi terbaru dari framework Next.js, app router, dan standar frontend.
- `apps/api/`: Memuat rancangan awal FastAPI terpisah menggunakan standar (endpoints, services, schemas).
- `packages/`: Disiapkan untuk *shared types* antar aplikasi.
- `infra/`: Disiapkan untuk menampung konfigurasi devops (misal: docker-compose).

Langkah selanjutnya adalah memastikan integrasi di setiap *workspace* masing-masing (seperti sinkronisasi API path dan setup routing).

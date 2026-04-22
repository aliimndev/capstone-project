# RekoFilm

## Struktur Proyek

```text
movie-recommender-app/
│
├── apps/
│   ├── web/                     # 🌐 Next.js (Frontend)
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   └── recommend/
│   │   │       └── page.tsx
│   │   ├── components/
│   │   ├── features/
│   │   │   └── recommendation/
│   │   │       ├── hooks.ts
│   │   │       ├── api.ts      # call ke FastAPI
│   │   │       └── types.ts
│   │   ├── lib/
│   │   ├── public/
│   │   ├── styles/
│   │   ├── .env.local
│   │   └── package.json
│   │
│   └── api/                    # ⚙️ FastAPI (Backend AI)
│       ├── app/
│       │   ├── main.py
│       │   ├── core/           # config, settings
│       │   │   └── config.py
│       │   │
│       │   ├── api/            # routes
│       │   │   └── v1/
│       │   │       └── endpoints/
│       │   │           └── recommend.py
│       │   │
│       │   ├── services/       # external logic
│       │   │   ├── gemini_service.py
│       │   │   └── tmdb_service.py
│       │   │
│       │   ├── schemas/        # pydantic models
│       │   │   └── recommend.py
│       │   │
│       │   └── utils/
│       │
│       ├── requirements.txt
│       └── .env
│
├── packages/                   # 🔗 shared (optional tapi keren)
│   └── types/
│       └── recommendation.ts
│
├── infra/                      # 🐳 devops
│   └── docker-compose.yml
│
├── .gitignore
└── README.md
```

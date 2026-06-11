# Build stage
FROM python:3.11-slim as builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Runtime stage
FROM python:3.11-slim

WORKDIR /app

ARG HF_MODEL_URL=https://huggingface.co/aliimndev/recommender_artifacts.pkl/resolve/main/recommender_artifacts.pkl

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.local /root/.local

COPY app ./app
COPY core ./core
RUN mkdir -p model

# Bake model into image when absent (CI / cloud deploy); local builds can COPY model/ instead.
COPY model ./model
RUN test -s model/recommender_artifacts.pkl || \
    curl -fsSL -o model/recommender_artifacts.pkl "${HF_MODEL_URL}"

ENV PATH=/root/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app \
    PORT=8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
    CMD curl -f "http://localhost:${PORT}/health" || exit 1

EXPOSE 8000

CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

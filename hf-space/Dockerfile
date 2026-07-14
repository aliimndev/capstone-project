# check=skip=FromAsCasing
# ── Build stage ──────────────────────────────────────────────────────
FROM python:3.11-slim as builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# ── Runtime stage ────────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Create a non-root user (required by Hugging Face Spaces)
RUN useradd -m -u 1000 appuser

COPY --from=builder /root/.local /home/appuser/.local
COPY app ./app
COPY core ./core

# Create model directory with correct permissions
# Model is downloaded at runtime to keep image size small
RUN mkdir -p model && chown -R appuser:appuser /app

ENV PATH=/home/appuser/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app \
    PORT=7860

USER appuser

EXPOSE 7860

CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]

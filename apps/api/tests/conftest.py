import sys
from pathlib import Path

# Ensure apps/api is on sys.path when running pytest from repo root or apps/api
API_ROOT = Path(__file__).resolve().parents[1]
if str(API_ROOT) not in sys.path:
    sys.path.insert(0, str(API_ROOT))

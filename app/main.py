from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.detector import detect_threats
from app.models import IdentityEvent

app = FastAPI(
    title="Identity Threat Detection & Response",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/v1/events")
def analyze_events(events: list[IdentityEvent]):
    alerts = detect_threats(events)

    return {
        "events_received": len(events),
        "alerts_generated": len(alerts),
        "alerts": alerts,
    }

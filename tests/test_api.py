from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_event_analysis():
    events = [
        {
            "user": "alice",
            "event_type": "login_failed",
            "ip_address": "10.0.0.10",
            "timestamp": "2026-10-08T09:00:00Z",
            "location": "Kochi",
            "success": False,
            "role": "user",
        },
        {
            "user": "alice",
            "event_type": "login_failed",
            "ip_address": "10.0.0.10",
            "timestamp": "2026-10-08T09:01:00Z",
            "location": "Kochi",
            "success": False,
            "role": "user",
        },
        {
            "user": "alice",
            "event_type": "login_failed",
            "ip_address": "10.0.0.10",
            "timestamp": "2026-10-08T09:02:00Z",
            "location": "Kochi",
            "success": False,
            "role": "user",
        },
    ]

    response = client.post("/v1/events", json=events)

    assert response.status_code == 200

    data = response.json()

    assert data["events_received"] == 3
    assert data["alerts_generated"] == 1
    assert data["alerts"][0]["threat_type"] == "brute_force"

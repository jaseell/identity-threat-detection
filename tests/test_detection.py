import json

from app.models import IdentityEvent
from app.detector import detect_threats


def load_events():
    with open("sample_data/identity_events.json") as f:
        data = json.load(f)

    return [IdentityEvent(**item) for item in data]


def test_all_threats_detected():
    events = load_events()
    alerts = detect_threats(events)

    threat_types = {alert["threat_type"] for alert in alerts}

    assert "brute_force" in threat_types
    assert "mfa_fatigue" in threat_types
    assert "impossible_travel" in threat_types
    assert "privilege_escalation" in threat_types


def test_risk_scores_are_valid():
    events = load_events()
    alerts = detect_threats(events)

    for alert in alerts:
        assert 0.0 <= alert["risk_score"] <= 1.0
        assert alert["severity"] in {"LOW", "MEDIUM", "HIGH", "CRITICAL"}
        assert alert["action"] in {"NOTIFY_SOC", "NOTIFY_SOC_AND_BLOCK"}

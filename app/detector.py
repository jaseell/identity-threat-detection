from collections import defaultdict
from datetime import timedelta

from app.models import IdentityEvent
from app.response import get_response_action


def calculate_severity(risk_score: float) -> str:
    if risk_score >= 0.9:
        return "CRITICAL"
    if risk_score >= 0.7:
        return "HIGH"
    if risk_score >= 0.4:
        return "MEDIUM"
    return "LOW"


def detect_threats(events: list[IdentityEvent]) -> list[dict]:
    alerts = []
    user_events = defaultdict(list)

    for event in events:
        user_events[event.user].append(event)

    for user, user_event_list in user_events.items():
        user_event_list.sort(key=lambda e: e.timestamp)

        # 1. Brute Force Detection
        failed_logins = [
            e for e in user_event_list
            if e.event_type == "login_failed"
        ]

        if len(failed_logins) >= 3:
            first = failed_logins[0]
            last = failed_logins[-1]

            if last.timestamp - first.timestamp <= timedelta(minutes=5):
                alerts.append({
                    "user": user,
                    "threat_type": "brute_force",
                    "risk_score": 0.90,
                    "severity": calculate_severity(0.90),
                    "reason": f"{len(failed_logins)} failed login attempts within 5 minutes",
                    "action": get_response_action("CRITICAL"),
                })

        # 2. MFA Fatigue Detection
        mfa_requests = [
            e for e in user_event_list
            if e.event_type == "mfa_request"
        ]

        if len(mfa_requests) >= 3:
            first = mfa_requests[0]
            last = mfa_requests[-1]

            if last.timestamp - first.timestamp <= timedelta(minutes=5):
                alerts.append({
                    "user": user,
                    "threat_type": "mfa_fatigue",
                    "risk_score": 0.85,
                    "severity": calculate_severity(0.85),
                    "reason": f"{len(mfa_requests)} MFA requests within 5 minutes",
                    "action": get_response_action("HIGH"),
                })

        # 3. Impossible Travel Detection
        login_events = [
            e for e in user_event_list
            if e.event_type == "login" and e.success
        ]

        for previous, current in zip(login_events, login_events[1:]):
            if (
                previous.location
                and current.location
                and previous.location != current.location
                and current.timestamp - previous.timestamp <= timedelta(minutes=10)
            ):
                alerts.append({
                    "user": user,
                    "threat_type": "impossible_travel",
                    "risk_score": 0.95,
                    "severity": calculate_severity(0.95),
                    "reason": (
                        f"Successful logins from {previous.location} "
                        f"and {current.location} within 10 minutes"
                    ),
                    "action": get_response_action("CRITICAL"),
                })
                break

        # 4. Privilege Escalation Detection
        for event in user_event_list:
            if event.event_type == "role_changed" and event.role == "admin":
                alerts.append({
                    "user": user,
                    "threat_type": "privilege_escalation",
                    "risk_score": 0.90,
                    "severity": calculate_severity(0.90),
                    "reason": "User role changed to admin",
                    "action": get_response_action("CRITICAL"),
                })
                break

    return alerts

def get_response_action(severity: str) -> str:
    if severity == "CRITICAL":
        return "NOTIFY_SOC_AND_BLOCK"

    if severity == "HIGH":
        return "NOTIFY_SOC"

    if severity == "MEDIUM":
        return "MONITOR"

    return "NO_ACTION"

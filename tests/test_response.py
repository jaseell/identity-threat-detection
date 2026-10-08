from app.response import get_response_action


def test_critical_response():
    assert get_response_action("CRITICAL") == "NOTIFY_SOC_AND_BLOCK"


def test_high_response():
    assert get_response_action("HIGH") == "NOTIFY_SOC"


def test_medium_response():
    assert get_response_action("MEDIUM") == "MONITOR"


def test_low_response():
    assert get_response_action("LOW") == "NO_ACTION"

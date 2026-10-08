from datetime import datetime
from pydantic import BaseModel


class IdentityEvent(BaseModel):
    user: str
    event_type: str
    ip_address: str
    timestamp: datetime
    location: str | None = None
    success: bool = True
    role: str | None = None

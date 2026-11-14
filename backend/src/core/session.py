import base64
import hashlib
import hmac
import json
import time

from fastapi import Header, HTTPException, status

from src.configs.settings import settings


def require_session(
    authorization: str | None = Header(default=None),
) -> dict[str, object]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация",
        )

    token = authorization.removeprefix("Bearer ")
    parts = token.split(".")
    if len(parts) != 2:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительная сессия",
        )

    data, signature = parts
    expected = base64.urlsafe_b64encode(
        hmac.new(
            settings.AUTH_SECRET.encode(),
            data.encode(),
            hashlib.sha256,
        ).digest()
    ).decode().rstrip("=")
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительная сессия",
        )

    try:
        payload = json.loads(
            base64.urlsafe_b64decode(data + "=" * (-len(data) % 4))
        )
    except (ValueError, json.JSONDecodeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительная сессия",
        ) from None

    if (
        not isinstance(payload, dict)
        or not isinstance(payload.get("userId"), int)
        or not isinstance(payload.get("login"), str)
        or not isinstance(payload.get("exp"), int)
        or payload["exp"] <= time.time()
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительная сессия",
        )

    return payload

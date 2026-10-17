"""Dépendances FastAPI — authentification et contrôle d’accès serveur."""

from collections.abc import Callable
from uuid import UUID

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session, joinedload

from app.config import Settings, get_settings
from app.database import get_db
from app.models.user import User
from app.security.tokens import decode_access_token

_bearer = HTTPBearer(auto_error=False)


def _extract_token(
    request: Request,
    settings: Settings,
    credentials: HTTPAuthorizationCredentials | None,
) -> str | None:
    if credentials and credentials.scheme.lower() == "bearer":
        return credentials.credentials
    # Nom du cookie issu de la config (SIGU_ACCESS_COOKIE_NAME), jamais codé en dur.
    return request.cookies.get(settings.access_cookie_name)


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> User:
    token = _extract_token(request, settings, credentials)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentification requise.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = decode_access_token(token, settings)
        subject = payload.get("sub")
        if not subject:
            raise JWTError("missing sub")
        user_id = UUID(subject)
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Jeton invalide ou expiré.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from None

    user = (
        db.query(User)
        .options(joinedload(User.roles))
        .filter(User.id == user_id)
        .first()
    )
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Compte indisponible.",
        )
    return user


def require_roles(*required: str) -> Callable[..., User]:
    """Exige au moins un des rôles listés (contrôle serveur uniquement)."""

    required_set = set(required)

    def _dependency(user: User = Depends(get_current_user)) -> User:
        if not required_set.intersection(user.role_names()):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Droits insuffisants.",
            )
        return user

    return _dependency

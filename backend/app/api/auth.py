from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.config import Settings, get_settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserPublic
from app.security.login_rate_limit import (
    client_ip_from_request,
    get_login_rate_limiter,
)
from app.security.passwords import verify_password
from app.security.tokens import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

_GENERIC_AUTH_FAILURE = "Identifiants incorrects."
_GENERIC_RATE_LIMIT = "Trop de tentatives. Réessayez plus tard."


def _user_public(user: User) -> UserPublic:
    return UserPublic(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        roles=sorted(user.role_names()),
        person_id=user.person_id,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


def _login_rate_keys(email: str, request: Request) -> list[str]:
    keys = [f"email:{email}"]
    client_ip = client_ip_from_request(request)
    if client_ip:
        keys.append(f"ip:{client_ip}")
    return keys


def _raise_if_login_rate_limited(keys: list[str], settings: Settings) -> None:
    limiter = get_login_rate_limiter()
    max_attempts = settings.login_rate_limit_attempts
    window = float(settings.login_rate_limit_window_seconds)
    for key in keys:
        if limiter.is_limited(
            key, max_attempts=max_attempts, window_seconds=window
        ):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=_GENERIC_RATE_LIMIT,
            )


def _register_login_failures(keys: list[str], settings: Settings) -> None:
    limiter = get_login_rate_limiter()
    max_attempts = settings.login_rate_limit_attempts
    window = float(settings.login_rate_limit_window_seconds)
    for key in keys:
        limiter.register_failure(
            key, max_attempts=max_attempts, window_seconds=window
        )


def _clear_login_failures(keys: list[str]) -> None:
    limiter = get_login_rate_limiter()
    for key in keys:
        limiter.reset_key(key)


@router.post("/login", response_model=TokenResponse)
def login(
    body: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> TokenResponse:
    email = body.email.lower().strip()
    rate_keys = _login_rate_keys(email, request)
    _raise_if_login_rate_limited(rate_keys, settings)

    user = (
        db.query(User)
        .options(joinedload(User.roles))
        .filter(User.email == email)
        .first()
    )
    # Message générique — ne pas indiquer si l’e-mail existe.
    if user is None or not verify_password(body.password, user.hashed_password):
        _register_login_failures(rate_keys, settings)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=_GENERIC_AUTH_FAILURE,
        )
    if not user.is_active:
        _register_login_failures(rate_keys, settings)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=_GENERIC_AUTH_FAILURE,
        )

    _clear_login_failures(rate_keys)

    roles = sorted(user.role_names())
    token = create_access_token(subject=user.id, roles=roles, settings=settings)

    secure = settings.cookie_secure or settings.is_production
    response.set_cookie(
        key=settings.access_cookie_name,
        value=token,
        httponly=True,
        secure=secure,
        samesite=settings.cookie_samesite,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    return TokenResponse(access_token=token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    settings: Settings = Depends(get_settings),
) -> None:
    response.delete_cookie(
        key=settings.access_cookie_name,
        path="/",
        httponly=True,
        samesite=settings.cookie_samesite,
        secure=settings.cookie_secure or settings.is_production,
    )


@router.get("/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)) -> UserPublic:
    return _user_public(user)

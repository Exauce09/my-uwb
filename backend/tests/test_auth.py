"""Tests d’authentification — SQLite mémoire via conftest uniquement."""

from __future__ import annotations

import os
from datetime import UTC, datetime, timedelta

from jose import jwt

from app.config import get_settings
from app.security.tokens import ALGORITHM


def test_conftest_uses_sqlite_memory_only():
    """Les tests backend ne doivent pas viser une base PostgreSQL réelle."""
    url = os.environ["SIGU_DATABASE_URL"]
    assert url.startswith("sqlite")
    assert ":memory:" in url
    assert get_settings().database_url.startswith("sqlite")
    assert ":memory:" in get_settings().database_url


def test_login_success_sets_httponly_cookie(client, admin_user):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "AdminPass1!"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    cookie_name = get_settings().access_cookie_name
    cookie = response.cookies.get(cookie_name)
    assert cookie
    # httpOnly ne se lit pas via JS ; TestClient expose la valeur mais l’en-tête Set-Cookie doit être httponly
    set_cookie = response.headers.get("set-cookie", "").lower()
    assert "httponly" in set_cookie


def test_login_wrong_password(client, admin_user):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "WrongPass1!"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Identifiants incorrects."


def test_login_unknown_email_same_generic_message(client, admin_user):
    """Email inconnu : même message qu’un mauvais mot de passe (pas d’énumération)."""
    unknown = client.post(
        "/api/v1/auth/login",
        json={"email": "inconnu@example.com", "password": "Whatever1!"},
    )
    wrong_pw = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "WrongPass1!"},
    )
    assert unknown.status_code == 401
    assert wrong_pw.status_code == 401
    assert unknown.json()["detail"] == "Identifiants incorrects."
    assert unknown.json()["detail"] == wrong_pw.json()["detail"]


def test_login_inactive_account_rejected(client, admin_user, db_session):
    admin_user.is_active = False
    db_session.commit()

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "AdminPass1!"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Identifiants incorrects."


def test_me_with_bearer(client, admin_user):
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "AdminPass1!"},
    )
    token = login.json()["access_token"]
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@example.com"
    assert "admin" in data["roles"]
    assert "hashed_password" not in data


def test_me_with_configured_cookie(client, admin_user):
    """GET /me authentifié via le cookie nommé par settings.access_cookie_name."""
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "AdminPass1!"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]
    cookie_name = get_settings().access_cookie_name

    client.cookies.clear()
    response = client.get(
        "/api/v1/auth/me",
        cookies={cookie_name: token},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "admin@example.com"


def test_me_unauthorized(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Authentification requise."


def test_me_inactive_account_with_valid_token(client, admin_user, db_session):
    """Jeton encore valide mais compte désactivé : 401 générique, sans statut explicite « inactif »."""
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "AdminPass1!"},
    )
    token = login.json()["access_token"]
    admin_user.is_active = False
    db_session.commit()

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 401
    detail = response.json()["detail"]
    assert detail == "Compte indisponible."
    assert "inactif" not in detail.lower()
    assert "disabled" not in detail.lower()


def test_auth_error_bodies_do_not_leak_secrets(client, admin_user):
    """Aucune réponse d’erreur auth ne doit contenir secret, mot de passe, jeton ou traceback."""
    settings = get_settings()
    password = "AdminPass1!"
    wrong = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "WrongPass1!"},
    )
    missing = client.get("/api/v1/auth/me")
    garbage = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer not-a-real-jwt"},
    )
    for response in (wrong, missing, garbage):
        body = response.text
        assert password not in body
        assert "WrongPass1!" not in body
        assert settings.secret_key not in body
        assert "traceback" not in body.lower()
        assert "hashed_password" not in body
        assert "SIGU_SECRET" not in body


def test_logout_clears_access_cookie(client, admin_user):
    cookie_name = get_settings().access_cookie_name
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "AdminPass1!"},
    )
    assert login.status_code == 200
    assert login.cookies.get(cookie_name)

    logout = client.post("/api/v1/auth/logout")
    assert logout.status_code == 204
    set_cookie = logout.headers.get("set-cookie", "").lower()
    assert cookie_name.lower() in set_cookie
    # Suppression / expiration du cookie côté client
    assert "max-age=0" in set_cookie or "expires=" in set_cookie


def test_me_rejects_expired_jwt(client, admin_user):
    settings = get_settings()
    expired = jwt.encode(
        {
            "sub": str(admin_user.id),
            "roles": ["admin"],
            "exp": datetime.now(UTC) - timedelta(minutes=5),
            "type": "access",
        },
        settings.secret_key,
        algorithm=ALGORITHM,
    )
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {expired}"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Jeton invalide ou expiré."


def test_me_rejects_non_access_token_type(client, admin_user):
    settings = get_settings()
    wrong_type = jwt.encode(
        {
            "sub": str(admin_user.id),
            "roles": ["admin"],
            "exp": datetime.now(UTC) + timedelta(hours=1),
            "type": "refresh",
        },
        settings.secret_key,
        algorithm=ALGORITHM,
    )
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {wrong_type}"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Jeton invalide ou expiré."


def test_me_uses_configured_cookie_name(client, admin_user, monkeypatch):
    """Le cookie d’auth doit suivre SIGU_ACCESS_COOKIE_NAME, pas un nom figé."""
    custom_name = "sigu_custom_access"
    monkeypatch.setenv("SIGU_ACCESS_COOKIE_NAME", custom_name)
    get_settings.cache_clear()
    try:
        login = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "AdminPass1!"},
        )
        assert login.status_code == 200
        token = login.json()["access_token"]
        set_cookie = login.headers.get("set-cookie", "")
        assert f"{custom_name}=" in set_cookie

        client.cookies.clear()
        ok = client.get(
            "/api/v1/auth/me",
            cookies={custom_name: token},
        )
        assert ok.status_code == 200
        assert ok.json()["email"] == "admin@example.com"

        # Ancien nom par défaut : ignoré si la config a changé
        client.cookies.clear()
        denied = client.get(
            "/api/v1/auth/me",
            cookies={"sigu_access": token},
        )
        assert denied.status_code == 401
    finally:
        get_settings.cache_clear()

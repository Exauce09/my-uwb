"""Limitation des tentatives de login — SQLite mémoire, horloge injectable."""

from __future__ import annotations

import os

import pytest

from app.config import get_settings
from app.security.login_rate_limit import (
    InMemoryLoginRateLimiter,
    get_login_rate_limiter,
)


@pytest.fixture(autouse=True)
def _reset_login_rate_limiter():
    get_login_rate_limiter().clear()
    yield
    get_login_rate_limiter().clear()


@pytest.fixture()
def tight_login_limits(monkeypatch):
    """Seuil bas pour des tests déterministes et rapides."""
    monkeypatch.setenv("SIGU_LOGIN_RATE_LIMIT_ATTEMPTS", "3")
    monkeypatch.setenv("SIGU_LOGIN_RATE_LIMIT_WINDOW_SECONDS", "60")
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


def test_sqlite_memory_only_for_rate_limit_suite():
    assert os.environ["SIGU_DATABASE_URL"].startswith("sqlite")
    assert ":memory:" in os.environ["SIGU_DATABASE_URL"]


def test_login_succeeds_before_threshold(client, admin_user, tight_login_limits):
    for _ in range(2):
        bad = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "WrongPass1!"},
        )
        assert bad.status_code == 401

    ok = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "AdminPass1!"},
    )
    assert ok.status_code == 200
    assert ok.json()["access_token"]


def test_repeated_failures_return_429(client, admin_user, tight_login_limits):
    details = []
    for _ in range(3):
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "WrongPass1!"},
        )
        assert response.status_code == 401
        details.append(response.json()["detail"])

    limited = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "WrongPass1!"},
    )
    assert limited.status_code == 429
    assert limited.json()["detail"] == "Trop de tentatives. Réessayez plus tard."
    assert all(d == "Identifiants incorrects." for d in details)


def test_rate_limit_message_does_not_reveal_email_existence(
    client, admin_user, tight_login_limits
):
    for _ in range(3):
        client.post(
            "/api/v1/auth/login",
            json={"email": "inconnu@example.com", "password": "Whatever1!"},
        )
    unknown_limited = client.post(
        "/api/v1/auth/login",
        json={"email": "inconnu@example.com", "password": "Whatever1!"},
    )
    for _ in range(3):
        client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "WrongPass1!"},
        )
    known_limited = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "WrongPass1!"},
    )
    assert unknown_limited.status_code == 429
    assert known_limited.status_code == 429
    assert unknown_limited.json()["detail"] == known_limited.json()["detail"]
    assert "existe" not in unknown_limited.json()["detail"].lower()
    assert "admin" not in unknown_limited.json()["detail"].lower()


def test_rate_limit_expires_after_window(monkeypatch, tight_login_limits):
    """Unité déterministe : après la fenêtre, la clé n’est plus limitée."""
    clock = {"t": 1_000.0}

    def fake_clock() -> float:
        return clock["t"]

    limiter = InMemoryLoginRateLimiter(clock=fake_clock)
    key = "email:admin@example.com"
    for _ in range(3):
        limiter.register_failure(key, max_attempts=3, window_seconds=60.0)
    assert limiter.is_limited(key, max_attempts=3, window_seconds=60.0)

    clock["t"] += 61.0
    assert not limiter.is_limited(key, max_attempts=3, window_seconds=60.0)


def test_rate_limit_clears_after_successful_login(
    client, admin_user, tight_login_limits
):
    for _ in range(2):
        assert (
            client.post(
                "/api/v1/auth/login",
                json={"email": "admin@example.com", "password": "WrongPass1!"},
            ).status_code
            == 401
        )
    assert (
        client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "AdminPass1!"},
        ).status_code
        == 200
    )
    # Après succès, de nouvelles erreurs sont à nouveau autorisées (compteur remis).
    for _ in range(3):
        assert (
            client.post(
                "/api/v1/auth/login",
                json={"email": "admin@example.com", "password": "WrongPass1!"},
            ).status_code
            == 401
        )
    assert (
        client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "WrongPass1!"},
        ).status_code
        == 429
    )


def test_http_rate_limit_lifts_after_window(
    client, admin_user, monkeypatch, tight_login_limits
):
    clock = {"t": 5_000.0}

    def fake_clock() -> float:
        return clock["t"]

    limiter = get_login_rate_limiter()
    limiter.clear()
    # Remplace l’horloge du singleton utilisé par l’API
    limiter._clock = fake_clock  # noqa: SLF001 — test d’isolation

    for _ in range(3):
        assert (
            client.post(
                "/api/v1/auth/login",
                json={"email": "admin@example.com", "password": "WrongPass1!"},
            ).status_code
            == 401
        )
    assert (
        client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "WrongPass1!"},
        ).status_code
        == 429
    )

    clock["t"] += 61.0
    # Échec encore possible (401), plus de 429 pour cette fenêtre
    again = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "WrongPass1!"},
    )
    assert again.status_code == 401

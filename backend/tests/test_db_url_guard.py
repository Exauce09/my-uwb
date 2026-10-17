"""Tests du garde-fou d’URL — aucune connexion réseau."""

from __future__ import annotations

import os

import pytest

from app.db_url_guard import (
    DatabaseUrlGuardError,
    assert_sigu_test_database_url,
    assert_test_and_migration_urls_aligned,
    normalize_target,
    redact_database_url,
    require_test_db_for_migration_if_configured,
)


def _valid_url(
    *,
    database: str = "sigu_test_i1",
    user: str = "sigu_test_user",
    password: str = "LocalOnlyPass1!",
    host: str = "127.0.0.1",
    port: int = 5433,
) -> str:
    return (
        f"postgresql+psycopg://{user}:{password}@{host}:{port}/{database}"
    )


def test_accepts_valid_sigu_test_url():
    target = assert_sigu_test_database_url(_valid_url())
    assert target.database == "sigu_test_i1"
    assert target.username == "sigu_test_user"
    assert target.drivername == "postgresql+psycopg"


def test_redact_hides_password():
    url = _valid_url(password="SuperSecretPass1!")
    redacted = redact_database_url(url)
    assert "SuperSecretPass1!" not in redacted
    assert "sigu_test_i1" in redacted


def test_rejects_sigu_and_postgres_database_names():
    for name in ("sigu", "postgres"):
        with pytest.raises(DatabaseUrlGuardError):
            assert_sigu_test_database_url(
                _valid_url(database=name, user="sigu_test_user")
            )


def test_rejects_database_without_required_prefix():
    with pytest.raises(DatabaseUrlGuardError, match="préfixe"):
        assert_sigu_test_database_url(
            _valid_url(database="sigu_prod", user="sigu_test_user")
        )


def test_rejects_foreign_project_database_names():
    for name in ("sigu_test_nic_app", "sigu_test_spe-rdc_db"):
        with pytest.raises(DatabaseUrlGuardError, match="hors projet"):
            assert_sigu_test_database_url(
                _valid_url(database=name, user="sigu_test_user")
            )


def test_rejects_empty_or_placeholder_password():
    for pwd in ("", "CHANGE_ME", "changeme", "password"):
        with pytest.raises(DatabaseUrlGuardError, match="Mot de passe"):
            assert_sigu_test_database_url(_valid_url(password=pwd))


def test_rejects_non_postgresql_scheme():
    with pytest.raises(DatabaseUrlGuardError, match="Schéma"):
        assert_sigu_test_database_url(
            "sqlite+pysqlite:///sigu_test_i1.db"
        )


def test_rejects_username_without_prefix():
    with pytest.raises(DatabaseUrlGuardError, match="utilisateur"):
        assert_sigu_test_database_url(
            _valid_url(user="postgres")
        )


def test_alignment_detects_different_targets():
    a = _valid_url(database="sigu_test_i1", port=5433)
    b = _valid_url(database="sigu_test_i1", port=5434)
    with pytest.raises(DatabaseUrlGuardError, match="différentes"):
        assert_test_and_migration_urls_aligned(a, b)


def test_alignment_accepts_same_target_different_password_strings():
    """Même cible logique ; mots de passe non comparés dans le message."""
    a = _valid_url(password="LocalOnlyPass1!")
    b = _valid_url(password="OtherLocalPass2!")
    target = assert_test_and_migration_urls_aligned(a, b)
    assert target is not None
    assert target.database == "sigu_test_i1"
    # Aucune fuite dans la représentation sûre
    assert "LocalOnlyPass1!" not in redact_database_url(a)
    assert "OtherLocalPass2!" not in redact_database_url(b)


def test_alignment_none_when_test_url_absent():
    assert assert_test_and_migration_urls_aligned(None, _valid_url()) is None
    assert assert_test_and_migration_urls_aligned("", _valid_url()) is None


def test_normalize_excludes_password_from_equality():
    a = normalize_target(_valid_url(password="AaaAaaAaa1!"))
    b = normalize_target(_valid_url(password="BbbBbbBbb2!"))
    assert a == b


def test_migration_flag_requires_valid_test_db(monkeypatch):
    monkeypatch.setenv("SIGU_MIGRATION_REQUIRE_TEST_DB", "1")
    monkeypatch.setenv("SIGU_DATABASE_URL", _valid_url())
    monkeypatch.delenv("SIGU_TEST_DATABASE_URL", raising=False)
    require_test_db_for_migration_if_configured()


def test_migration_flag_rejects_non_test_database(monkeypatch):
    monkeypatch.setenv("SIGU_MIGRATION_REQUIRE_TEST_DB", "1")
    monkeypatch.setenv(
        "SIGU_DATABASE_URL",
        "postgresql+psycopg://sigu:LocalOnlyPass1!@127.0.0.1:5432/sigu",
    )
    with pytest.raises(DatabaseUrlGuardError):
        require_test_db_for_migration_if_configured()


def test_migration_flag_off_does_nothing(monkeypatch):
    monkeypatch.delenv("SIGU_MIGRATION_REQUIRE_TEST_DB", raising=False)
    monkeypatch.setenv(
        "SIGU_DATABASE_URL",
        "postgresql+psycopg://sigu:LocalOnlyPass1!@127.0.0.1:5432/sigu",
    )
    require_test_db_for_migration_if_configured()


def test_integration_style_fails_when_defined_url_invalid(monkeypatch):
    """Comportement attendu du smoke PG : URL définie invalide → échec."""
    monkeypatch.setenv(
        "SIGU_TEST_DATABASE_URL",
        "postgresql+psycopg://sigu:LocalOnlyPass1!@127.0.0.1:5432/sigu",
    )
    with pytest.raises(DatabaseUrlGuardError):
        assert_sigu_test_database_url(os.environ["SIGU_TEST_DATABASE_URL"])

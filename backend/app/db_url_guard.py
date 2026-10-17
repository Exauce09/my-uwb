"""
Validation des URL PostgreSQL destinées aux tests / migrations de test SIGU.

Ne journalise jamais le mot de passe ni l’URL complète.
"""

from __future__ import annotations

import os
from dataclasses import dataclass

from sqlalchemy.engine.url import URL, make_url

_ALLOWED_DRIVERS = frozenset(
    {
        "postgresql",
        "postgresql+psycopg",
        "postgresql+psycopg2",
    }
)

_PASSWORD_PLACEHOLDERS = frozenset(
    {
        "",
        "change_me",
        "changeme",
        "change-me",
        "password",
        "secret",
        "pass",
        "pwd",
    }
)

# Fragments indiquant une base clairement hors SIGU test.
_FOREIGN_NAME_MARKERS = frozenset(
    {
        "nic_",
        "nic-",
        "spe-rdc",
        "spe_rdc",
        "spe-rdc-",
        "wordpress",
        "mysql",
    }
)

_TEST_DB_PREFIX = "sigu_test_"
_TEST_USER_PREFIX = "sigu_test_"


class DatabaseUrlGuardError(ValueError):
    """URL ou alignement rejeté — message sans secret."""


@dataclass(frozen=True, slots=True)
class SafeDbTarget:
    """Identité comparable sans mot de passe."""

    drivername: str
    host: str | None
    port: int | None
    database: str | None
    username: str | None


def _safe_parse(url: str) -> URL:
    try:
        return make_url(url)
    except Exception as exc:
        raise DatabaseUrlGuardError(
            "URL de base de données illisible ou mal formée."
        ) from exc


def redact_database_url(url: str) -> str:
    """Représentation sûre pour messages (sans mot de passe)."""
    parsed = _safe_parse(url)
    return parsed.render_as_string(hide_password=True)


def normalize_target(url: str) -> SafeDbTarget:
    parsed = _safe_parse(url)
    return SafeDbTarget(
        drivername=parsed.drivername,
        host=parsed.host,
        port=parsed.port,
        database=parsed.database,
        username=parsed.username,
    )


def _name_looks_foreign(name: str) -> bool:
    lowered = name.lower()
    return any(marker in lowered for marker in _FOREIGN_NAME_MARKERS)


def _password_is_unacceptable(password: str | None) -> bool:
    if password is None:
        return True
    return password.strip().lower() in _PASSWORD_PLACEHOLDERS


def assert_sigu_test_database_url(url: str) -> SafeDbTarget:
    """
    Valide une URL comme base de **test** SIGU.

    Exige database `sigu_test_*` et username `sigu_test_*`.
    """
    if not url or not url.strip():
        raise DatabaseUrlGuardError("URL de test SIGU absente.")

    parsed = _safe_parse(url)
    driver = parsed.drivername

    if driver not in _ALLOWED_DRIVERS:
        raise DatabaseUrlGuardError(
            "Schéma non autorisé pour les tests SIGU "
            "(attendu postgresql+psycopg ou postgresql)."
        )

    database = (parsed.database or "").strip()
    username = (parsed.username or "").strip()

    if not database:
        raise DatabaseUrlGuardError("Nom de base manquant dans l’URL de test SIGU.")

    if database in {"sigu", "postgres"} or database.lower() in {"sigu", "postgres"}:
        raise DatabaseUrlGuardError(
            "Nom de base refusé : utilisez exclusivement le préfixe sigu_test_."
        )

    if not database.startswith(_TEST_DB_PREFIX):
        raise DatabaseUrlGuardError(
            "Nom de base refusé : le préfixe obligatoire est sigu_test_."
        )

    if _name_looks_foreign(database):
        raise DatabaseUrlGuardError(
            "Nom de base refusé : cible identifiée comme hors projet SIGU test."
        )

    if not username:
        raise DatabaseUrlGuardError("Nom d’utilisateur manquant dans l’URL de test SIGU.")

    if not username.startswith(_TEST_USER_PREFIX):
        raise DatabaseUrlGuardError(
            "Nom d’utilisateur refusé : le préfixe obligatoire est sigu_test_."
        )

    if _name_looks_foreign(username):
        raise DatabaseUrlGuardError(
            "Nom d’utilisateur refusé : cible identifiée comme hors projet SIGU test."
        )

    if _password_is_unacceptable(parsed.password):
        raise DatabaseUrlGuardError(
            "Mot de passe de test invalide (vide ou placeholder interdit)."
        )

    return normalize_target(url)


def assert_test_and_migration_urls_aligned(
    test_url: str | None,
    database_url: str | None,
) -> SafeDbTarget | None:
    """
    Si SIGU_TEST_DATABASE_URL est définie : la valider ;
    si SIGU_DATABASE_URL l’est aussi, exiger la même cible (hors mot de passe).
    """
    if not test_url or not test_url.strip():
        return None

    target = assert_sigu_test_database_url(test_url)

    if database_url and database_url.strip():
        other = normalize_target(database_url)
        if other != target:
            raise DatabaseUrlGuardError(
                "SIGU_TEST_DATABASE_URL et SIGU_DATABASE_URL désignent des cibles "
                "différentes (pilote/hôte/port/base/utilisateur). "
                "Alignez-les avant migration ou test d’intégration."
            )
        # Valider aussi que DATABASE respecte les règles test si on aligne pour I1
        assert_sigu_test_database_url(database_url)

    return target


def require_test_db_for_migration_if_configured() -> None:
    """
    Appelé par Alembic : si SIGU_MIGRATION_REQUIRE_TEST_DB=1,
    valide SIGU_DATABASE_URL comme base de test et aligne avec SIGU_TEST_DATABASE_URL.
    """
    flag = os.environ.get("SIGU_MIGRATION_REQUIRE_TEST_DB", "").strip().lower()
    if flag not in {"1", "true", "yes", "on"}:
        return

    database_url = os.environ.get("SIGU_DATABASE_URL")
    test_url = os.environ.get("SIGU_TEST_DATABASE_URL")

    if not database_url or not database_url.strip():
        raise DatabaseUrlGuardError(
            "SIGU_MIGRATION_REQUIRE_TEST_DB=1 exige SIGU_DATABASE_URL."
        )

    assert_sigu_test_database_url(database_url)

    if test_url and test_url.strip():
        assert_test_and_migration_urls_aligned(test_url, database_url)
    else:
        # Pas de TEST URL : la DATABASE seule doit déjà être sigu_test_*
        pass

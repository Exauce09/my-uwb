"""
Support tests d’intégration PostgreSQL SIGU (I1).

Aucune connexion tant que SIGU_TEST_DATABASE_URL n’est pas validée.
N’affiche jamais le mot de passe ni l’URL complète.
"""

from __future__ import annotations

import os

import pytest
from sqlalchemy import create_engine, inspect
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import NullPool

from app.db_url_guard import (
    DatabaseUrlGuardError,
    SafeDbTarget,
    assert_sigu_test_database_url,
    assert_test_and_migration_urls_aligned,
)

_E1_TABLES = frozenset({"users", "roles", "user_roles"})


def get_raw_test_database_url() -> str | None:
    raw = os.environ.get("SIGU_TEST_DATABASE_URL", "").strip()
    return raw or None


def require_sigu_test_pg_url() -> tuple[str, SafeDbTarget]:
    """
    Skip si absente ; fail si invalide.
    Retourne (url, cible sûre).
    """
    raw = get_raw_test_database_url()
    if raw is None:
        pytest.skip(
            "SIGU_TEST_DATABASE_URL absente — concurrence PostgreSQL I1 non exécutée."
        )

    try:
        target = assert_sigu_test_database_url(raw)
        database_url = os.environ.get("SIGU_DATABASE_URL", "").strip()
        # conftest impose souvent SQLite : n’alignement que si DATABASE est déjà PostgreSQL.
        if database_url.startswith("postgresql"):
            assert_test_and_migration_urls_aligned(raw, database_url)
    except DatabaseUrlGuardError as exc:
        pytest.fail(f"SIGU_TEST_DATABASE_URL refusée par le garde-fou : {exc}")

    return raw, target


def format_safe_target(target: SafeDbTarget) -> str:
    return (
        f"driver={target.drivername} host={target.host} port={target.port} "
        f"database={target.database} user={target.username}"
    )


def preflight_report(target: SafeDbTarget) -> None:
    """Informations non sensibles uniquement (stdout pytest)."""
    print(f"[SIGU PG I1] cible validée : {format_safe_target(target)}")


def create_test_engine(url: str) -> Engine:
    return create_engine(url, pool_pre_ping=True, poolclass=NullPool)


def assert_e1_schema_present(engine: Engine) -> None:
    insp = inspect(engine)
    existing = set(insp.get_table_names())
    missing = sorted(_E1_TABLES - existing)
    if missing:
        pytest.fail(
            "Schéma E1 absent sur la base de test "
            f"(tables manquantes : {', '.join(missing)}). "
            "Appliquez Alembic (`alembic upgrade head`) sur cette base "
            "avec SIGU_MIGRATION_REQUIRE_TEST_DB=1 avant la campagne I1. "
            "Aucun create_all n’est effectué par les tests."
        )


def count_active_admins(session: Session) -> int:
    from app.models import Role, RoleName, User

    return (
        session.query(User)
        .join(User.roles)
        .filter(User.is_active.is_(True), Role.name == RoleName.admin.value)
        .distinct()
        .count()
    )


def ensure_role_rows(session: Session) -> None:
    """Insère les rôles E1 manquants (données), sans créer de tables."""
    from app.models import Role, RoleName

    for name in RoleName:
        if session.query(Role).filter(Role.name == name.value).first() is None:
            session.add(Role(name=name.value, description=name.value))
    session.commit()


def delete_users_by_ids(session: Session, user_ids: list) -> None:
    """Nettoie uniquement les utilisateurs créés par le test (CASCADE user_roles)."""
    from app.models import User

    if not user_ids:
        return
    session.query(User).filter(User.id.in_(user_ids)).delete(synchronize_session=False)
    session.commit()

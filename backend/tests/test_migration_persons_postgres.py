"""
Campagne PostgreSQL — migration Module 2 (E1 → E2 persons).

Préparation uniquement : sans `SIGU_TEST_DATABASE_URL`, tous les scénarios PG
sont ignorés. Aucune validation PostgreSQL réelle tant que la campagne n’a pas
été exécutée explicitement sur une base `sigu_test_*` dédiée.

Scénarios (MIG-0…MIG-6) lorsque l’URL est fournie :
- préflight garde-fou + SIGU_MIGRATION_REQUIRE_TEST_DB=1 ;
- upgrade base → E1 → seed compte → upgrade E2 ;
- conservation du compte ; association Person/User ; unicité person_id ;
- ON DELETE SET NULL ; downgrade E2→E1 ; re-upgrade E2.

Attention : la campagne pilote le cycle Alembic sur la base de test
(downgrade `base` inclus) — réservée à une base SIGU de test exclusive.
Aucun `create_all`.
"""

from __future__ import annotations

import os
import uuid
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError

from app.models import User
from tests.sigu_pg_support import (
    create_test_engine,
    format_safe_target,
    preflight_report,
    require_sigu_test_pg_url,
)

_REV_E1 = "20260417_0001"
_REV_E2 = "20260417_0002"
_FK_NAME = "fk_users_person_id_persons"
_UQ_NAME = "uq_users_person_id"
_BACKEND_ROOT = Path(__file__).resolve().parents[1]


def test_mig_offline_constraint_names_match_migration():
    """Hors PG : noms UNIQUE / FK du modèle User = migration 0002."""
    fk_names = {fk.name for fk in User.__table__.foreign_keys}
    assert _FK_NAME in fk_names, fk_names

    constraint_names = {
        c.name for c in User.__table__.constraints if getattr(c, "name", None)
    }
    assert _UQ_NAME in constraint_names, constraint_names


def _alembic_config() -> Config:
    return Config(str(_BACKEND_ROOT / "alembic.ini"))


def _with_migration_env(test_url: str):
    """Aligne DATABASE=TEST et active le garde-fou migration pour Alembic."""
    previous = {
        "SIGU_DATABASE_URL": os.environ.get("SIGU_DATABASE_URL"),
        "SIGU_TEST_DATABASE_URL": os.environ.get("SIGU_TEST_DATABASE_URL"),
        "SIGU_MIGRATION_REQUIRE_TEST_DB": os.environ.get(
            "SIGU_MIGRATION_REQUIRE_TEST_DB"
        ),
    }
    os.environ["SIGU_DATABASE_URL"] = test_url
    os.environ["SIGU_TEST_DATABASE_URL"] = test_url
    os.environ["SIGU_MIGRATION_REQUIRE_TEST_DB"] = "1"
    return previous


def _restore_env(previous: dict[str, str | None]) -> None:
    for key, value in previous.items():
        if value is None:
            os.environ.pop(key, None)
        else:
            os.environ[key] = value


def _table_names(engine) -> set[str]:
    return set(inspect(engine).get_table_names())


def _user_columns(engine) -> set[str]:
    return {c["name"] for c in inspect(engine).get_columns("users")}


def _fk_names_on_users(engine) -> set[str]:
    return {
        fk["name"]
        for fk in inspect(engine).get_foreign_keys("users")
        if fk.get("name")
    }


def test_mig0_to_mig6_persons_migration_campaign():
    """
    Campagne complète MIG-0…MIG-6 sur PostgreSQL de test.

    Skip si URL absente ; fail si URL invalide.
    """
    url, target = require_sigu_test_pg_url()
    preflight_report(target)
    print(
        f"[SIGU PG MIG] campagne persons — cible {format_safe_target(target)} "
        f"(SIGU_MIGRATION_REQUIRE_TEST_DB=1)"
    )

    previous = _with_migration_env(url)
    engine = create_test_engine(url)
    cfg = _alembic_config()
    tag = uuid.uuid4().hex[:12]
    email = f"mig2_{tag}@example.test"
    user_id = uuid.uuid4()
    person_id = uuid.uuid4()
    person_id_b = uuid.uuid4()

    try:
        # --- MIG-0 / reset contrôlé : revenir à base puis E1 ---
        command.downgrade(cfg, "base")
        command.upgrade(cfg, _REV_E1)

        names = _table_names(engine)
        assert "users" in names and "roles" in names and "user_roles" in names
        assert "persons" not in names
        assert "person_id" not in _user_columns(engine)

        # Seed compte E1 (SQL brut : le modèle User connaît déjà person_id).
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO users
                        (id, email, hashed_password, full_name, is_active)
                    VALUES
                        (:id, :email, :hp, :fn, true)
                    """
                ),
                {
                    "id": user_id,
                    "email": email,
                    "hp": "migration-test-hash-not-for-login",
                    "fn": "Mig Admin",
                },
            )

        # --- MIG-1 : upgrade E1 → E2 ---
        command.upgrade(cfg, _REV_E2)
        names = _table_names(engine)
        assert "persons" in names
        assert "person_id" in _user_columns(engine)
        assert _FK_NAME in _fk_names_on_users(engine)

        # --- MIG-2 : conservation du compte ---
        with engine.connect() as conn:
            row = conn.execute(
                text(
                    "SELECT email, full_name, person_id FROM users WHERE id = :id"
                ),
                {"id": user_id},
            ).one()
        assert row.email == email
        assert row.full_name == "Mig Admin"
        assert row.person_id is None

        # --- MIG-3 : association Person / User ---
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO persons (id, last_name, first_name, email)
                    VALUES (:id, :ln, :fn, :em)
                    """
                ),
                {
                    "id": person_id,
                    "ln": "Doe",
                    "fn": "Jane",
                    "em": f"contact_{tag}@example.test",
                },
            )
            conn.execute(
                text("UPDATE users SET person_id = :pid WHERE id = :uid"),
                {"pid": person_id, "uid": user_id},
            )

        with engine.connect() as conn:
            linked = conn.execute(
                text("SELECT person_id FROM users WHERE id = :id"),
                {"id": user_id},
            ).scalar_one()
        assert linked == person_id

        # --- MIG-4 : unicité users.person_id ---
        other_user = uuid.uuid4()
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO users
                        (id, email, hashed_password, full_name, is_active)
                    VALUES
                        (:id, :email, :hp, :fn, true)
                    """
                ),
                {
                    "id": other_user,
                    "email": f"mig2_b_{tag}@example.test",
                    "hp": "migration-test-hash-not-for-login",
                    "fn": "Other",
                },
            )

        with engine.connect() as conn:
            with pytest.raises(IntegrityError):
                with conn.begin():
                    conn.execute(
                        text(
                            "UPDATE users SET person_id = :pid WHERE id = :uid"
                        ),
                        {"pid": person_id, "uid": other_user},
                    )

        # Nouvelle personne + lien OK pour le second user (prépare SET NULL).
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO persons (id, last_name, first_name)
                    VALUES (:id, :ln, :fn)
                    """
                ),
                {"id": person_id_b, "ln": "Roe", "fn": "John"},
            )
            conn.execute(
                text("UPDATE users SET person_id = :pid WHERE id = :uid"),
                {"pid": person_id_b, "uid": other_user},
            )

        # --- MIG-5 : ON DELETE SET NULL ---
        with engine.begin() as conn:
            conn.execute(
                text("DELETE FROM persons WHERE id = :id"),
                {"id": person_id_b},
            )
        with engine.connect() as conn:
            cleared = conn.execute(
                text("SELECT person_id FROM users WHERE id = :id"),
                {"id": other_user},
            ).scalar_one()
        assert cleared is None

        # --- MIG-6a : downgrade E2 → E1 ---
        # Délier avant downgrade pour éviter toute ambiguïté de données résiduelles.
        with engine.begin() as conn:
            conn.execute(text("UPDATE users SET person_id = NULL"))
            conn.execute(text("DELETE FROM persons"))

        command.downgrade(cfg, _REV_E1)
        names = _table_names(engine)
        assert "persons" not in names
        assert "person_id" not in _user_columns(engine)
        with engine.connect() as conn:
            still = conn.execute(
                text("SELECT email FROM users WHERE id = :id"),
                {"id": user_id},
            ).scalar_one()
        assert still == email

        # --- MIG-6b : re-upgrade E2 ---
        command.upgrade(cfg, _REV_E2)
        assert "persons" in _table_names(engine)
        assert "person_id" in _user_columns(engine)
        with engine.connect() as conn:
            again = conn.execute(
                text(
                    "SELECT email, person_id FROM users WHERE id = :id"
                ),
                {"id": user_id},
            ).one()
        assert again.email == email
        assert again.person_id is None

        # Nettoyage des lignes créées par cette campagne uniquement.
        with engine.begin() as conn:
            conn.execute(
                text("DELETE FROM users WHERE id IN (:a, :b)"),
                {"a": user_id, "b": other_user},
            )
    finally:
        engine.dispose()
        _restore_env(previous)

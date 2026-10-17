"""
Campagne PostgreSQL I1 — concurrence réelle via pg_advisory_xact_lock.

Prérequis (hors de cette suite) :
- Base dédiée `sigu_test_*` / user `sigu_test_*` ;
- Schéma E1 déjà appliqué par Alembic (aucun create_all ici) ;
- Variable `SIGU_TEST_DATABASE_URL` uniquement pour la connexion.

Sans URL → skip. URL invalide → fail. Schéma E1 absent → fail.
"""

from __future__ import annotations

import os
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings
from app.database import get_db
from app.main import app
from app.models import Role, RoleName, User
from app.security.admin_guard import admin_mutation_guard
from app.security.login_rate_limit import get_login_rate_limiter
from app.security.passwords import hash_password
from tests.sigu_pg_support import (
    assert_e1_schema_present,
    count_active_admins,
    create_test_engine,
    delete_users_by_ids,
    ensure_role_rows,
    format_safe_target,
    preflight_report,
    require_sigu_test_pg_url,
)

_PASS_A = "Admin1Pass1!"
_PASS_B = "Admin2Pass1!"


def _login(client: TestClient, email: str, password: str) -> str:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def pg_i1_env():
    """
    Connexion exclusive via SIGU_TEST_DATABASE_URL.
    Crée deux admins isolés ; nettoie uniquement ces lignes.
    """
    url, target = require_sigu_test_pg_url()
    preflight_report(target)

    engine = create_test_engine(url)
    assert_e1_schema_present(engine)
    SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

    tag = uuid.uuid4().hex[:12]
    email1 = f"i1pg_{tag}_a@example.test"
    email2 = f"i1pg_{tag}_b@example.test"
    created_ids: list[UUID] = []

    with SessionLocal() as s:
        ensure_role_rows(s)
        admin_role = s.query(Role).filter(Role.name == RoleName.admin.value).one()
        a1 = User(
            email=email1,
            hashed_password=hash_password(_PASS_A),
            full_name="I1 PG Admin A",
            roles=[admin_role],
        )
        a2 = User(
            email=email2,
            hashed_password=hash_password(_PASS_B),
            full_name="I1 PG Admin B",
            roles=[admin_role],
        )
        s.add_all([a1, a2])
        s.commit()
        s.refresh(a1)
        s.refresh(a2)
        id1, id2 = a1.id, a2.id
        created_ids.extend([id1, id2])

    def _override():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    previous_attempts = os.environ.get("SIGU_LOGIN_RATE_LIMIT_ATTEMPTS")
    os.environ["SIGU_LOGIN_RATE_LIMIT_ATTEMPTS"] = "0"
    get_settings.cache_clear()
    get_login_rate_limiter().clear()
    app.dependency_overrides[get_db] = _override

    try:
        yield {
            "SessionLocal": SessionLocal,
            "engine": engine,
            "target": target,
            "id1": id1,
            "id2": id2,
            "email1": email1,
            "email2": email2,
            "created_ids": created_ids,
        }
    finally:
        app.dependency_overrides.pop(get_db, None)
        if previous_attempts is None:
            os.environ.pop("SIGU_LOGIN_RATE_LIMIT_ATTEMPTS", None)
        else:
            os.environ["SIGU_LOGIN_RATE_LIMIT_ATTEMPTS"] = previous_attempts
        get_settings.cache_clear()
        get_login_rate_limiter().clear()
        with SessionLocal() as s:
            delete_users_by_ids(s, created_ids)
        engine.dispose()


def test_pg0_preflight_safe_target(pg_i1_env):
    """PG-0 — préflight : cible sûre (sans secret ni URL complète)."""
    target = pg_i1_env["target"]
    report = format_safe_target(target)
    assert "://" not in report
    assert "password" not in report.lower()
    assert target.database and target.database.startswith("sigu_test_")
    assert target.username and target.username.startswith("sigu_test_")


def test_pg1_advisory_lock_smoke(pg_i1_env):
    """PG-1 — smoke : pg_advisory_xact_lock acquis puis rollback."""
    SessionLocal = pg_i1_env["SessionLocal"]
    with SessionLocal() as db:
        with admin_mutation_guard(db):
            db.execute(select(1))
        db.rollback()


def test_pg2_concurrent_deactivate_and_strip_role(pg_i1_env):
    """
    PG-2 — désactivation de B + retrait du rôle admin de A (même acteur).
    Invariant : ≥ 1 admin actif. Codes 200/409 tous deux légitimes.
    """
    id1: UUID = pg_i1_env["id1"]
    id2: UUID = pg_i1_env["id2"]
    SessionLocal = pg_i1_env["SessionLocal"]
    email1 = pg_i1_env["email1"]

    with TestClient(app) as boot:
        token = _login(boot, email1, _PASS_A)

    barrier = threading.Barrier(2)
    codes: list[int] = []
    lock = threading.Lock()

    def deactivate_other() -> None:
        barrier.wait(timeout=10)
        with TestClient(app) as c:
            response = c.patch(
                f"/api/v1/users/{id2}/status",
                headers=_auth(token),
                json={"is_active": False},
            )
        with lock:
            codes.append(response.status_code)

    def strip_self_admin() -> None:
        barrier.wait(timeout=10)
        with TestClient(app) as c:
            response = c.delete(
                f"/api/v1/users/{id1}/roles/admin",
                headers=_auth(token),
            )
        with lock:
            codes.append(response.status_code)

    with ThreadPoolExecutor(max_workers=2) as pool:
        f1 = pool.submit(deactivate_other)
        f2 = pool.submit(strip_self_admin)
        f1.result(timeout=60)
        f2.result(timeout=60)

    assert all(c in (200, 409) for c in codes), codes
    assert 200 in codes
    assert 409 in codes

    with SessionLocal() as s:
        assert count_active_admins(s) >= 1


def test_pg3_concurrent_cross_strip_admin(pg_i1_env):
    """PG-3 — retraits croisés du rôle admin. Invariant ≥ 1 admin actif."""
    id1: UUID = pg_i1_env["id1"]
    id2: UUID = pg_i1_env["id2"]
    SessionLocal = pg_i1_env["SessionLocal"]

    with TestClient(app) as boot:
        token1 = _login(boot, pg_i1_env["email1"], _PASS_A)
        token2 = _login(boot, pg_i1_env["email2"], _PASS_B)

    barrier = threading.Barrier(2)
    codes: list[int] = []
    lock = threading.Lock()

    def strip(target: UUID, token: str) -> None:
        barrier.wait(timeout=10)
        with TestClient(app) as c:
            response = c.delete(
                f"/api/v1/users/{target}/roles/admin",
                headers=_auth(token),
            )
        with lock:
            codes.append(response.status_code)

    with ThreadPoolExecutor(max_workers=2) as pool:
        f1 = pool.submit(strip, id2, token1)
        f2 = pool.submit(strip, id1, token2)
        f1.result(timeout=60)
        f2.result(timeout=60)

    assert all(c in (200, 401, 409) for c in codes), codes
    with SessionLocal() as s:
        assert count_active_admins(s) >= 1


def test_pg4_concurrent_deactivate_same_second_admin(pg_i1_env):
    """PG-4 — deux désactivations concurrentes du même second admin."""
    id2: UUID = pg_i1_env["id2"]
    SessionLocal = pg_i1_env["SessionLocal"]

    with TestClient(app) as boot:
        token = _login(boot, pg_i1_env["email1"], _PASS_A)

    barrier = threading.Barrier(2)
    codes: list[int] = []
    lock = threading.Lock()

    def deactivate() -> None:
        barrier.wait(timeout=10)
        with TestClient(app) as c:
            response = c.patch(
                f"/api/v1/users/{id2}/status",
                headers=_auth(token),
                json={"is_active": False},
            )
        with lock:
            codes.append(response.status_code)

    with ThreadPoolExecutor(max_workers=2) as pool:
        futures = [pool.submit(deactivate), pool.submit(deactivate)]
        for f in as_completed(futures, timeout=60):
            f.result()

    assert all(c in (200, 409) for c in codes), f"codes inattendus: {codes}"
    with SessionLocal() as s:
        assert count_active_admins(s) >= 1
        other = s.get(User, id2)
        assert other is not None
        assert other.is_active is False


def test_pg5_rollback_on_failed_commit(pg_i1_env, monkeypatch):
    """PG-5 — échec de commit après le garde : aucune mutation persistée."""
    id2: UUID = pg_i1_env["id2"]
    SessionLocal = pg_i1_env["SessionLocal"]

    with TestClient(app) as boot:
        token = _login(boot, pg_i1_env["email1"], _PASS_A)

    def boom(self, *args, **kwargs):
        raise RuntimeError("commit refused")

    monkeypatch.setattr(Session, "commit", boom)

    with pytest.raises(RuntimeError, match="commit refused"):
        with TestClient(app, raise_server_exceptions=True) as c:
            c.patch(
                f"/api/v1/users/{id2}/status",
                headers=_auth(token),
                json={"is_active": False},
            )

    monkeypatch.undo()

    with SessionLocal() as s:
        other = s.get(User, id2)
        assert other is not None
        assert other.is_active is True
        assert count_active_admins(s) >= 2


def test_pg6_last_admin_protection_no_mutation(pg_i1_env):
    """PG-6 — 409 sur le dernier admin actif ; état inchangé."""
    id1: UUID = pg_i1_env["id1"]
    id2: UUID = pg_i1_env["id2"]
    SessionLocal = pg_i1_env["SessionLocal"]

    with TestClient(app) as client:
        token = _login(client, pg_i1_env["email1"], _PASS_A)
        # Ne laisser qu’un admin actif.
        r = client.patch(
            f"/api/v1/users/{id2}/status",
            headers=_auth(token),
            json={"is_active": False},
        )
        assert r.status_code == 200, r.text

    with SessionLocal() as s:
        remaining = count_active_admins(s)
        if remaining != 1:
            pytest.fail(
                f"Base de test non isolée : {remaining} admin(s) actif(s) après "
                "désactivation du second compte I1 (attendu 1). "
                "Retirez les autres administrateurs actifs de la base sigu_test_* "
                "avant la campagne."
            )

    with TestClient(app) as client:
        token = _login(client, pg_i1_env["email1"], _PASS_A)
        status_resp = client.patch(
            f"/api/v1/users/{id1}/status",
            headers=_auth(token),
            json={"is_active": False},
        )
        assert status_resp.status_code == 409

        role_resp = client.delete(
            f"/api/v1/users/{id1}/roles/admin",
            headers=_auth(token),
        )
        assert role_resp.status_code == 409

    with SessionLocal() as s:
        user = s.query(User).filter(User.id == id1).one()
        assert user.is_active is True
        assert RoleName.admin.value in user.role_names()
        assert count_active_admins(s) == 1

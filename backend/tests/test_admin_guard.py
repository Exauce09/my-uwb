"""
Protection concurrente du dernier administrateur.

Sur SQLite, le garde utilise un Lock processus : les tests multi-thread
démontrent la sérialisation intra-processus, pas la concurrence multi-serveurs.
Campagne PostgreSQL réelle : `tests/test_admin_guard_postgres.py` (PG-0…PG-6).
"""

from __future__ import annotations

import os
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import NullPool

from app.database import Base, get_db
from app.main import app
from app.models import Role, RoleName, User
from app.security.passwords import hash_password


def _login(client: TestClient, email: str, password: str) -> str:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _count_active_admins(session: Session) -> int:
    return (
        session.query(User)
        .join(User.roles)
        .filter(User.is_active.is_(True), Role.name == RoleName.admin.value)
        .distinct()
        .count()
    )


@pytest.fixture()
def second_admin(db_session, seed_roles) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.admin.value).one()
    user = User(
        email="admin2@example.com",
        hashed_password=hash_password("Admin2Pass1!"),
        full_name="Admin Two",
        roles=[role],
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def shared_sqlite_env(tmp_path):
    """
    SQLite fichier + NullPool : une session par requête HTTP.
    Nécessaire pour des appels multi-thread sans partager une Session ORM.
    """
    db_path = tmp_path / "admin_guard_i1.sqlite"
    url = f"sqlite+pysqlite:///{db_path.as_posix()}"
    engine = create_engine(
        url,
        connect_args={"check_same_thread": False},
        poolclass=NullPool,
    )
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

    with SessionLocal() as s:
        for name in RoleName:
            if s.query(Role).filter(Role.name == name.value).first() is None:
                s.add(Role(name=name.value, description=name.value))
        s.commit()

    with SessionLocal() as s:
        admin_role = s.query(Role).filter(Role.name == RoleName.admin.value).one()
        a1 = User(
            email="admin1@example.com",
            hashed_password=hash_password("Admin1Pass1!"),
            full_name="Admin One",
            roles=[admin_role],
        )
        a2 = User(
            email="admin2@example.com",
            hashed_password=hash_password("Admin2Pass1!"),
            full_name="Admin Two",
            roles=[admin_role],
        )
        s.add_all([a1, a2])
        s.commit()
        s.refresh(a1)
        s.refresh(a2)
        id1, id2 = a1.id, a2.id

    def _override():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = _override
    # Évite les 429 du limiteur login pendant les batterissements multi-thread.
    os.environ["SIGU_LOGIN_RATE_LIMIT_ATTEMPTS"] = "0"
    from app.config import get_settings
    from app.security.login_rate_limit import get_login_rate_limiter

    get_settings.cache_clear()
    get_login_rate_limiter().clear()

    client = TestClient(app)
    try:
        yield {
            "client": client,
            "SessionLocal": SessionLocal,
            "id1": id1,
            "id2": id2,
        }
    finally:
        app.dependency_overrides.pop(get_db, None)
        os.environ.pop("SIGU_LOGIN_RATE_LIMIT_ATTEMPTS", None)
        get_settings.cache_clear()
        get_login_rate_limiter().clear()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


def test_deactivate_last_active_admin_still_409(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.patch(
        f"/api/v1/users/{admin_user.id}/status",
        headers=_auth(token),
        json={"is_active": False},
    )
    assert response.status_code == 409


def test_remove_last_admin_role_still_409(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.delete(
        f"/api/v1/users/{admin_user.id}/roles/admin",
        headers=_auth(token),
    )
    assert response.status_code == 409


def test_self_deactivate_with_two_admins_still_400(client, admin_user, second_admin):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.patch(
        f"/api/v1/users/{admin_user.id}/status",
        headers=_auth(token),
        json={"is_active": False},
    )
    assert response.status_code == 400


def test_concurrent_deactivate_and_strip_admin_leaves_one(shared_sqlite_env):
    """
    Course typique vers zéro admin (même acteur) :
    - T1 désactive l’autre admin ;
    - T2 retire le rôle admin de l’acteur.
    Sans verrou commun, les deux peuvent réussir → 0 admin actif.
    Avec le Lock processus (SQLite), sérialisation → il reste ≥ 1 admin actif.

    Ce n’est pas une preuve multi-processus / multi-serveur.
    """
    id1: UUID = shared_sqlite_env["id1"]
    id2: UUID = shared_sqlite_env["id2"]
    SessionLocal = shared_sqlite_env["SessionLocal"]

    with TestClient(app) as boot:
        token = _login(boot, "admin1@example.com", "Admin1Pass1!")

    barrier = threading.Barrier(2)
    codes: list[int] = []
    lock = threading.Lock()

    def deactivate_other() -> None:
        barrier.wait(timeout=5)
        with TestClient(app) as c:
            response = c.patch(
                f"/api/v1/users/{id2}/status",
                headers=_auth(token),
                json={"is_active": False},
            )
        with lock:
            codes.append(response.status_code)

    def strip_self_admin() -> None:
        barrier.wait(timeout=5)
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
        f1.result(timeout=30)
        f2.result(timeout=30)

    assert all(c in (200, 409) for c in codes), codes
    assert 200 in codes
    assert 409 in codes
    with SessionLocal() as s:
        assert _count_active_admins(s) >= 1


def test_concurrent_deactivate_same_target_idempotent(shared_sqlite_env):
    """Deux désactivations concurrentes du même second admin : reste ≥ 1 admin."""
    id2: UUID = shared_sqlite_env["id2"]
    SessionLocal = shared_sqlite_env["SessionLocal"]

    with TestClient(app) as boot:
        token = _login(boot, "admin1@example.com", "Admin1Pass1!")

    barrier = threading.Barrier(2)
    codes: list[int] = []
    lock = threading.Lock()

    def deactivate() -> None:
        barrier.wait(timeout=5)
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
        for f in as_completed(futures, timeout=30):
            f.result()

    # Invariant : jamais zéro admin. Les codes 200 (idempotent) sont attendus ;
    # un 409 ici signale une course mal sérialisée sur le compteur.
    assert all(c in (200, 409) for c in codes), f"codes inattendus: {codes}"
    with SessionLocal() as s:
        assert _count_active_admins(s) >= 1
        assert s.get(User, id2) is not None
        assert s.get(User, id2).is_active is False


def test_concurrent_remove_admin_from_each_other_same_pattern(shared_sqlite_env):
    """Retrait concurrent du rôle admin sur l’autre compte (via chaque token)."""
    id1: UUID = shared_sqlite_env["id1"]
    id2: UUID = shared_sqlite_env["id2"]
    SessionLocal = shared_sqlite_env["SessionLocal"]

    with TestClient(app) as boot:
        token1 = _login(boot, "admin1@example.com", "Admin1Pass1!")
        token2 = _login(boot, "admin2@example.com", "Admin2Pass1!")

    barrier = threading.Barrier(2)
    codes: list[int] = []
    lock = threading.Lock()

    def strip(target: UUID, token: str) -> None:
        barrier.wait(timeout=5)
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
        f1.result(timeout=30)
        f2.result(timeout=30)

    assert all(c in (200, 401, 409) for c in codes), codes
    with SessionLocal() as s:
        assert _count_active_admins(s) >= 1


def test_rollback_on_failed_commit_keeps_admin(
    client, admin_user, second_admin, monkeypatch, db_session
):
    token = _login(client, "admin@example.com", "AdminPass1!")

    def boom(self, *args, **kwargs):
        raise RuntimeError("commit refused")

    monkeypatch.setattr(Session, "commit", boom)

    with pytest.raises(RuntimeError, match="commit refused"):
        client.patch(
            f"/api/v1/users/{second_admin.id}/status",
            headers=_auth(token),
            json={"is_active": False},
        )

    monkeypatch.undo()
    db_session.refresh(second_admin)
    assert second_admin.is_active is True


def test_rollback_when_409_does_not_mutate(client, admin_user, db_session):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.patch(
        f"/api/v1/users/{admin_user.id}/status",
        headers=_auth(token),
        json={"is_active": False},
    )
    assert response.status_code == 409
    db_session.refresh(admin_user)
    assert admin_user.is_active is True
    assert RoleName.admin.value in admin_user.role_names()

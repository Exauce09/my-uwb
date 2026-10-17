"""Fixtures de test — SQLite en mémoire (pas de PostgreSQL requis)."""

from __future__ import annotations

import os

# Variables avant import de l’application
os.environ["SIGU_SECRET_KEY"] = "test-secret-key-at-least-32-characters-long"
os.environ["SIGU_DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["SIGU_ENVIRONMENT"] = "development"
os.environ["SIGU_COOKIE_SECURE"] = "false"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import get_settings
from app.database import Base, get_db
from app.main import app
from app.models import Role, RoleName, User
from app.security.login_rate_limit import get_login_rate_limiter
from app.security.passwords import hash_password

get_settings.cache_clear()


@pytest.fixture(autouse=True)
def _clear_login_rate_limiter():
    """Isole les tests : le limiteur login est un singleton en mémoire."""
    get_login_rate_limiter().clear()
    yield
    get_login_rate_limiter().clear()


@pytest.fixture()
def db_session() -> Session:
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session: Session):
    def _override() -> Session:
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture()
def seed_roles(db_session: Session) -> None:
    for name in RoleName:
        db_session.add(Role(name=name.value, description=name.value))
    db_session.commit()


@pytest.fixture()
def admin_user(db_session: Session, seed_roles: None) -> User:
    admin_role = db_session.query(Role).filter(Role.name == RoleName.admin.value).one()
    user = User(
        email="admin@example.com",
        hashed_password=hash_password("AdminPass1!"),
        full_name="Admin Test",
        roles=[admin_role],
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def student_user(db_session: Session, seed_roles: None) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.student.value).one()
    user = User(
        email="student@example.com",
        hashed_password=hash_password("StudentPass1!"),
        full_name="Student Test",
        roles=[role],
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

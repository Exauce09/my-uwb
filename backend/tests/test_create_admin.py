"""Tests du bootstrap admin — SQLite mémoire uniquement, pas de PostgreSQL."""

from __future__ import annotations

import inspect

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.models import Role, RoleName, User
import app.scripts.create_admin as create_admin_mod
from app.scripts.create_admin import (
    SchemaNotReadyError,
    bootstrap_admin,
    ensure_required_schema,
    main,
    run_bootstrap,
)
from app.security.passwords import hash_password


def _memory_engine():
    return create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )


def test_module_never_calls_create_all():
    source = inspect.getsource(create_admin_mod)
    assert "metadata.create_all" not in source
    assert "Base.metadata" not in source
    # Pas d'import du Base SQLAlchemy (évite toute création de schéma ici)
    assert "from app.database import get_engine" in source
    assert "from app.database import Base" not in source


def test_ensure_schema_fails_when_tables_missing():
    engine = _memory_engine()
    with pytest.raises(SchemaNotReadyError) as exc_info:
        ensure_required_schema(engine)
    message = str(exc_info.value)
    assert "Alembic" in message
    assert "users" in message or "tables manquantes" in message


def test_run_bootstrap_fails_clearly_without_schema(capsys):
    engine = _memory_engine()
    code = run_bootstrap(
        engine,
        email="admin@example.com",
        password="AdminPass1!",
    )
    assert code == 1
    err = capsys.readouterr().err
    assert "Erreur" in err
    assert "Alembic" in err
    assert "AdminPass1!" not in err


def test_run_bootstrap_creates_admin_when_schema_ready(capsys):
    engine = _memory_engine()
    Base.metadata.create_all(bind=engine)
    code = run_bootstrap(
        engine,
        email="admin@example.com",
        password="AdminPass1!",
    )
    assert code == 0
    out = capsys.readouterr().out
    assert "Compte administrateur créé." in out
    assert "AdminPass1!" not in out

    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        user = db.query(User).filter(User.email == "admin@example.com").one()
        assert RoleName.admin.value in user.role_names()
    finally:
        db.close()


def test_no_duplicate_admin_account(capsys):
    engine = _memory_engine()
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        role = Role(name=RoleName.admin.value, description="Administrateur")
        db.add(role)
        db.flush()
        db.add(
            User(
                email="admin@example.com",
                hashed_password=hash_password("AdminPass1!"),
                full_name="Existant",
                roles=[role],
            )
        )
        db.commit()
    finally:
        db.close()

    code = run_bootstrap(
        engine,
        email="admin@example.com",
        password="AnotherPass1!",
    )
    assert code == 1
    err = capsys.readouterr().err
    assert "existe déjà" in err
    assert "AnotherPass1!" not in err

    db = Session()
    try:
        assert db.query(User).filter(User.email == "admin@example.com").count() == 1
    finally:
        db.close()


def test_main_missing_env_is_explicit_and_safe(monkeypatch, capsys):
    monkeypatch.delenv("SIGU_BOOTSTRAP_EMAIL", raising=False)
    monkeypatch.delenv("SIGU_BOOTSTRAP_PASSWORD", raising=False)
    code = main()
    assert code == 1
    err = capsys.readouterr().err
    assert "SIGU_BOOTSTRAP_EMAIL" in err
    assert "SIGU_BOOTSTRAP_PASSWORD" in err


def test_main_short_password_is_explicit_and_safe(monkeypatch, capsys):
    monkeypatch.setenv("SIGU_BOOTSTRAP_EMAIL", "admin@example.com")
    monkeypatch.setenv("SIGU_BOOTSTRAP_PASSWORD", "short")
    code = main()
    assert code == 1
    err = capsys.readouterr().err
    assert "trop court" in err
    assert "short" not in err


def test_bootstrap_admin_value_error_on_duplicate():
    engine = _memory_engine()
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        bootstrap_admin(db, email="a@example.com", password="ValidPass1!")
        with pytest.raises(ValueError, match="existe déjà"):
            bootstrap_admin(db, email="a@example.com", password="ValidPass1!")
    finally:
        db.close()


def test_ensure_schema_detects_missing_column():
    engine = _memory_engine()
    with engine.begin() as conn:
        conn.execute(
            text(
                "CREATE TABLE users ("
                "id CHAR(36) PRIMARY KEY, "
                "email VARCHAR(320) NOT NULL"
                ")"
            )
        )
        conn.execute(
            text(
                "CREATE TABLE roles ("
                "id CHAR(36) PRIMARY KEY, "
                "name VARCHAR(32) NOT NULL, "
                "description VARCHAR(255), "
                "created_at TIMESTAMP"
                ")"
            )
        )
        conn.execute(
            text(
                "CREATE TABLE user_roles ("
                "user_id CHAR(36) NOT NULL, "
                "role_id CHAR(36) NOT NULL, "
                "PRIMARY KEY (user_id, role_id)"
                ")"
            )
        )
    with pytest.raises(SchemaNotReadyError) as exc_info:
        ensure_required_schema(engine)
    assert "colonnes manquantes" in str(exc_info.value)
    assert "users" in str(exc_info.value)

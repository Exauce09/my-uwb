"""Tests bootstrap comptes portail — SQLite mémoire, pas de PostgreSQL."""

from __future__ import annotations

import inspect

import pytest
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine

from app.database import Base
from app.models import Role, RoleName, User
import app.scripts.create_portal_user as portal_mod
from app.scripts.create_admin import SchemaNotReadyError, ensure_required_schema
from app.scripts.create_portal_user import (
    bootstrap_portal_user,
    run_bootstrap,
)
from app.security.passwords import hash_password, verify_password


def _memory_engine():
    return create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )


def test_module_never_calls_create_all():
    source = inspect.getsource(portal_mod)
    assert "metadata.create_all" not in source
    assert "Base.metadata" not in source
    assert "from app.database import Base" not in source


def test_run_bootstrap_fails_without_schema(capsys):
    engine = _memory_engine()
    code = run_bootstrap(
        engine,
        email="student@example.com",
        password="StudentPass1!",
        role_name="student",
        full_name="Étudiant",
    )
    assert code == 1
    err = capsys.readouterr().err
    assert "Erreur" in err
    assert "StudentPass1!" not in err


def test_rejects_admin_role(capsys):
    engine = _memory_engine()
    Base.metadata.create_all(bind=engine)
    code = run_bootstrap(
        engine,
        email="x@example.com",
        password="PortalPass1!",
        role_name="admin",
        full_name="Nope",
    )
    assert code == 1
    err = capsys.readouterr().err
    assert "PortalPass1!" not in err
    assert "admin" in err.lower() or "rôle" in err.lower() or "invalide" in err


def test_creates_student_with_hashed_password(capsys):
    engine = _memory_engine()
    Base.metadata.create_all(bind=engine)
    code = run_bootstrap(
        engine,
        email="student@example.com",
        password="StudentPass1!",
        role_name="student",
        full_name="Étudiant Démo",
    )
    assert code == 0
    out = capsys.readouterr().out
    assert "student" in out
    assert "StudentPass1!" not in out

    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        user = db.query(User).filter(User.email == "student@example.com").one()
        assert RoleName.student.value in user.role_names()
        assert RoleName.admin.value not in user.role_names()
        assert user.hashed_password != "StudentPass1!"
        assert verify_password("StudentPass1!", user.hashed_password)
        assert user.person_id is None  # liaison Person = phase suivante
    finally:
        db.close()


def test_creates_teacher(capsys):
    engine = _memory_engine()
    Base.metadata.create_all(bind=engine)
    code = run_bootstrap(
        engine,
        email="teacher@example.com",
        password="TeacherPass1!",
        role_name="teacher",
        full_name="Enseignant Démo",
    )
    assert code == 0
    assert "TeacherPass1!" not in capsys.readouterr().out

    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        user = db.query(User).filter(User.email == "teacher@example.com").one()
        assert user.role_names() == {RoleName.teacher.value}
    finally:
        db.close()


def test_duplicate_email_fails(capsys):
    engine = _memory_engine()
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        role = Role(name=RoleName.student.value, description="Étudiant")
        db.add(role)
        db.flush()
        db.add(
            User(
                email="student@example.com",
                hashed_password=hash_password("StudentPass1!"),
                full_name="Existant",
                roles=[role],
            )
        )
        db.commit()
    finally:
        db.close()

    code = run_bootstrap(
        engine,
        email="student@example.com",
        password="OtherPass1!",
        role_name="student",
        full_name="Autre",
    )
    assert code == 1
    err = capsys.readouterr().err
    assert "existe déjà" in err
    assert "OtherPass1!" not in err


def test_ensure_schema_shared_with_admin():
    engine = _memory_engine()
    with pytest.raises(SchemaNotReadyError):
        ensure_required_schema(engine)


def test_bootstrap_portal_user_rejects_finance_role():
    engine = _memory_engine()
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        with pytest.raises(ValueError, match="invalide"):
            bootstrap_portal_user(
                db,
                email="f@example.com",
                password="FinancePass1!",
                role_name="finance",
                full_name="Finance",
            )
    finally:
        db.close()

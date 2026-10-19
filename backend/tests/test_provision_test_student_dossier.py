"""Provision E3 test — garde-fou URL + idempotence logique (SQLite mémoire)."""

from __future__ import annotations

import os

import pytest
from sqlalchemy.orm import Session

from app.db_url_guard import DatabaseUrlGuardError
from app.models import (
    AcademicUnit,
    AcademicYear,
    Enrollment,
    Person,
    Program,
    ProgramLevel,
    Role,
    RoleName,
    StudentProfile,
    User,
)
from app.scripts import provision_test_student_dossier as prov
from app.security.passwords import hash_password


def test_guard_rejects_non_test_url(monkeypatch):
    monkeypatch.delenv("SIGU_TEST_DATABASE_URL", raising=False)
    monkeypatch.setenv(
        "SIGU_DATABASE_URL",
        "postgresql+psycopg://sigu_app:SecretPass1!@127.0.0.1:5432/sigu_prod",
    )
    with pytest.raises(DatabaseUrlGuardError):
        prov._require_test_engine_url()


def test_guard_rejects_wrong_port(monkeypatch):
    monkeypatch.setenv(
        "SIGU_TEST_DATABASE_URL",
        "postgresql+psycopg://sigu_test_app:SecretPass1!@127.0.0.1:5432/sigu_test_local",
    )
    with pytest.raises(DatabaseUrlGuardError, match="Port refusé"):
        prov._require_test_engine_url()


@pytest.fixture()
def seeded_student(db_session: Session, seed_roles: None) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.student.value).one()
    person = Person(last_name="Test", first_name="E3", email="student@example.com")
    db_session.add(person)
    db_session.flush()
    user = User(
        email="student@example.com",
        hashed_password=hash_password("StudentPass1!"),
        full_name="E3 Test",
        roles=[role],
        person_id=person.id,
    )
    db_session.add(user)
    unit = AcademicUnit(code="INFO_IA", name="Info", kind="faculte")
    db_session.add(unit)
    db_session.flush()
    db_session.add(
        Program(
            academic_unit_id=unit.id,
            code="INFO_IA_CURSUS",
            title="Cursus test",
        )
    )
    db_session.add(AcademicYear(label="2026-2027", is_current=True))
    db_session.add(ProgramLevel(code="L1_LMD", label="L1 LMD", sort_order=1))
    db_session.commit()
    db_session.refresh(user)
    return user


def test_provision_idempotent(db_session: Session, seeded_student: User):
    first = prov.provision(
        db_session,
        email="student@example.com",
        matricule="TEST-E3-001",
        program_code="INFO_IA_CURSUS",
        year_label="2026-2027",
        level_code="L1_LMD",
    )
    assert first["profile_action"] == "created"
    assert first["enrollment_action"] == "created"
    second = prov.provision(
        db_session,
        email="student@example.com",
        matricule="TEST-E3-001",
        program_code="INFO_IA_CURSUS",
        year_label="2026-2027",
        level_code="L1_LMD",
    )
    assert second["profile_action"] == "reused"
    assert second["enrollment_action"] == "reused"
    assert db_session.query(StudentProfile).count() == 1
    assert db_session.query(Enrollment).count() == 1

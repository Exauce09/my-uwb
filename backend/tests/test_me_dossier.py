"""GET /auth/me/dossier — isolation étudiant, pas de person_id client, E3."""

from __future__ import annotations

import pytest
from sqlalchemy.orm import Session

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
from app.security.passwords import hash_password


def _token(client, email: str, password: str) -> str:
    r = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture()
def student_a(db_session: Session, seed_roles: None) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.student.value).one()
    person = Person(last_name="Alpha", first_name="Alice", email="alice@example.com")
    db_session.add(person)
    db_session.flush()
    user = User(
        email="alice@example.com",
        hashed_password=hash_password("AlicePass1!"),
        full_name="Alice Alpha",
        roles=[role],
        person_id=person.id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def student_b(db_session: Session, seed_roles: None) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.student.value).one()
    person = Person(last_name="Beta", first_name="Bob", email="bob@example.com")
    db_session.add(person)
    db_session.flush()
    user = User(
        email="bob@example.com",
        hashed_password=hash_password("BobPass1!!"),
        full_name="Bob Beta",
        roles=[role],
        person_id=person.id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def teacher_only(db_session: Session, seed_roles: None) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.teacher.value).one()
    user = User(
        email="teach@example.com",
        hashed_password=hash_password("TeachPass1!"),
        full_name="Teach",
        roles=[role],
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def academic_catalog(db_session: Session) -> dict:
    unit = AcademicUnit(code="INFO", name="Informatique & IA", kind="faculte")
    db_session.add(unit)
    db_session.flush()
    program = Program(
        academic_unit_id=unit.id,
        code="INFO-CURSUS",
        title="Cursus Informatique & IA",
    )
    year = AcademicYear(label="2026-2027", is_current=True)
    level = ProgramLevel(code="L1_LMD", label="L1 LMD", sort_order=1)
    db_session.add_all([program, year, level])
    db_session.commit()
    db_session.refresh(program)
    db_session.refresh(year)
    db_session.refresh(level)
    return {"unit": unit, "program": program, "year": year, "level": level}


def _attach_enrollment(
    db: Session,
    user: User,
    catalog: dict,
    *,
    student_number: str,
) -> StudentProfile:
    assert user.person_id is not None
    profile = StudentProfile(
        person_id=user.person_id,
        student_number=student_number,
        status="active",
    )
    db.add(profile)
    db.flush()
    enrollment = Enrollment(
        student_profile_id=profile.id,
        program_id=catalog["program"].id,
        academic_year_id=catalog["year"].id,
        program_level_id=catalog["level"].id,
        status="active",
        kind="initial",
    )
    db.add(enrollment)
    db.commit()
    db.refresh(profile)
    return profile


def test_student_reads_own_dossier(client, student_a):
    token = _token(client, "alice@example.com", "AlicePass1!")
    response = client.get(
        "/api/v1/auth/me/dossier",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["person"]["first_name"] == "Alice"
    assert body["person"]["last_name"] == "Alpha"
    assert body["person"]["id"] == str(student_a.person_id)
    assert body["academic"]["status"] == "not_provisioned"
    assert body["academic"]["enrollments"] == []
    assert "AlicePass1!" not in response.text


def test_student_with_enrollment_ready(
    client, db_session, student_a, academic_catalog
):
    _attach_enrollment(
        db_session, student_a, academic_catalog, student_number="UWB-ALICE-001"
    )
    token = _token(client, "alice@example.com", "AlicePass1!")
    response = client.get(
        "/api/v1/auth/me/dossier",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["academic"]["status"] == "ready"
    assert body["academic"]["student_number"] == "UWB-ALICE-001"
    assert len(body["academic"]["enrollments"]) == 1
    row = body["academic"]["enrollments"][0]
    assert row["program_code"] == "INFO-CURSUS"
    assert row["academic_year_label"] == "2026-2027"
    assert row["program_level_label"] == "L1 LMD"
    assert row["academic_unit_name"] == "Informatique & IA"


def test_students_isolated(client, db_session, student_a, student_b, academic_catalog):
    _attach_enrollment(
        db_session, student_a, academic_catalog, student_number="UWB-A-1"
    )
    _attach_enrollment(
        db_session, student_b, academic_catalog, student_number="UWB-B-2"
    )
    token_a = _token(client, "alice@example.com", "AlicePass1!")
    token_b = _token(client, "bob@example.com", "BobPass1!!")
    a = client.get(
        "/api/v1/auth/me/dossier",
        headers={"Authorization": f"Bearer {token_a}"},
    ).json()
    b = client.get(
        "/api/v1/auth/me/dossier",
        headers={"Authorization": f"Bearer {token_b}"},
    ).json()
    assert a["person"]["id"] != b["person"]["id"]
    assert a["academic"]["student_number"] == "UWB-A-1"
    assert b["academic"]["student_number"] == "UWB-B-2"
    # Aucun moyen de passer person_id : query ignorée
    sneaky = client.get(
        f"/api/v1/auth/me/dossier?person_id={student_b.person_id}",
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert sneaky.status_code == 200
    assert sneaky.json()["person"]["id"] == str(student_a.person_id)
    assert sneaky.json()["academic"]["student_number"] == "UWB-A-1"


def test_teacher_forbidden(client, teacher_only):
    token = _token(client, "teach@example.com", "TeachPass1!")
    response = client.get(
        "/api/v1/auth/me/dossier",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


def test_admin_forbidden(client, admin_user):
    token = _token(client, "admin@example.com", "AdminPass1!")
    response = client.get(
        "/api/v1/auth/me/dossier",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


def test_unauthenticated(client):
    response = client.get("/api/v1/auth/me/dossier")
    assert response.status_code == 401


def test_student_without_person_still_gets_academic_placeholder(client, student_user):
    token = _token(client, "student@example.com", "StudentPass1!")
    response = client.get(
        "/api/v1/auth/me/dossier",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["person"] is None
    assert body["academic"]["status"] == "not_provisioned"


def test_profile_without_enrollment_empty(
    client, db_session, student_a
):
    assert student_a.person_id is not None
    db_session.add(
        StudentProfile(
            person_id=student_a.person_id,
            student_number="UWB-EMPTY-1",
            status="active",
        )
    )
    db_session.commit()
    token = _token(client, "alice@example.com", "AlicePass1!")
    body = client.get(
        "/api/v1/auth/me/dossier",
        headers={"Authorization": f"Bearer {token}"},
    ).json()
    assert body["academic"]["status"] == "empty"
    assert body["academic"]["student_number"] == "UWB-EMPTY-1"
    assert body["academic"]["enrollments"] == []

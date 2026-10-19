"""API admin E3 — profils / inscriptions, RBAC, unicité, isolation dossier."""

from __future__ import annotations

import pytest
from sqlalchemy.orm import Session

from app.models import (
    AcademicUnit,
    AcademicYear,
    Person,
    Program,
    ProgramLevel,
    Role,
    RoleName,
    User,
)
from app.security.passwords import hash_password


def _login(client, email: str, password: str) -> str:
    r = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def catalog(db_session: Session) -> dict:
    unit = AcademicUnit(code="INFO_IA", name="Informatique", kind="faculte")
    db_session.add(unit)
    db_session.flush()
    program = Program(
        academic_unit_id=unit.id,
        code="INFO_IA_CURSUS",
        title="Cursus Info",
    )
    year = AcademicYear(label="2026-2027", is_current=True)
    level = ProgramLevel(code="L1_LMD", label="L1 LMD", sort_order=1)
    db_session.add_all([program, year, level])
    db_session.commit()
    db_session.refresh(program)
    db_session.refresh(year)
    db_session.refresh(level)
    return {"program": program, "year": year, "level": level}


@pytest.fixture()
def person_a(db_session: Session) -> Person:
    person = Person(last_name="Alpha", first_name="Alice", email="alice@example.com")
    db_session.add(person)
    db_session.commit()
    db_session.refresh(person)
    return person


@pytest.fixture()
def person_b(db_session: Session) -> Person:
    person = Person(last_name="Beta", first_name="Bob", email="bob@example.com")
    db_session.add(person)
    db_session.commit()
    db_session.refresh(person)
    return person


@pytest.fixture()
def student_user_a(db_session: Session, seed_roles, person_a: Person) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.student.value).one()
    user = User(
        email="alice@example.com",
        hashed_password=hash_password("AlicePass1!"),
        full_name="Alice Alpha",
        roles=[role],
        person_id=person_a.id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def student_user_b(db_session: Session, seed_roles, person_b: Person) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.student.value).one()
    user = User(
        email="bob@example.com",
        hashed_password=hash_password("BobPass1!!"),
        full_name="Bob Beta",
        roles=[role],
        person_id=person_b.id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def teacher_user(db_session: Session, seed_roles) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.teacher.value).one()
    user = User(
        email="teacher@example.com",
        hashed_password=hash_password("TeacherPass1!"),
        full_name="Teach",
        roles=[role],
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def test_admin_create_profile_and_enrollment(
    client, admin_user, catalog, person_a
):
    token = _login(client, "admin@example.com", "AdminPass1!")
    created = client.post(
        "/api/v1/student-profiles",
        headers=_auth(token),
        json={
            "person_id": str(person_a.id),
            "student_number": "ADM-001",
            "status": "active",
        },
    )
    assert created.status_code == 201, created.text
    profile = created.json()
    assert profile["student_number"] == "ADM-001"
    assert profile["person"]["first_name"] == "Alice"
    assert profile["enrollments"] == []

    got = client.get(
        f"/api/v1/student-profiles/{profile['id']}",
        headers=_auth(token),
    )
    assert got.status_code == 200
    assert got.json()["id"] == profile["id"]

    enr = client.post(
        "/api/v1/enrollments",
        headers=_auth(token),
        json={
            "student_profile_id": profile["id"],
            "program_id": str(catalog["program"].id),
            "academic_year_id": str(catalog["year"].id),
            "program_level_id": str(catalog["level"].id),
            "status": "active",
            "kind": "initial",
        },
    )
    assert enr.status_code == 201, enr.text
    body = enr.json()
    assert body["program"]["code"] == "INFO_IA_CURSUS"
    assert body["academic_year"]["label"] == "2026-2027"

    detail = client.get(
        f"/api/v1/enrollments/{body['id']}",
        headers=_auth(token),
    )
    assert detail.status_code == 200
    assert detail.json()["id"] == body["id"]

    listed = client.get("/api/v1/student-profiles?q=ADM-001", headers=_auth(token))
    assert listed.status_code == 200
    assert listed.json()["total"] >= 1
    assert listed.json()["items"][0]["enrollment_count"] == 1


def test_duplicate_matricule(client, admin_user, person_a, person_b):
    token = _login(client, "admin@example.com", "AdminPass1!")
    first = client.post(
        "/api/v1/student-profiles",
        headers=_auth(token),
        json={"person_id": str(person_a.id), "student_number": "DUP-1"},
    )
    assert first.status_code == 201
    second = client.post(
        "/api/v1/student-profiles",
        headers=_auth(token),
        json={"person_id": str(person_b.id), "student_number": "DUP-1"},
    )
    assert second.status_code == 409


def test_duplicate_enrollment(client, admin_user, catalog, person_a):
    token = _login(client, "admin@example.com", "AdminPass1!")
    profile = client.post(
        "/api/v1/student-profiles",
        headers=_auth(token),
        json={"person_id": str(person_a.id), "student_number": "ENR-1"},
    ).json()
    payload = {
        "student_profile_id": profile["id"],
        "program_id": str(catalog["program"].id),
        "academic_year_id": str(catalog["year"].id),
        "status": "active",
    }
    assert (
        client.post("/api/v1/enrollments", headers=_auth(token), json=payload).status_code
        == 201
    )
    dup = client.post("/api/v1/enrollments", headers=_auth(token), json=payload)
    assert dup.status_code == 409


def test_missing_references(client, admin_user, person_a):
    token = _login(client, "admin@example.com", "AdminPass1!")
    missing_person = client.post(
        "/api/v1/student-profiles",
        headers=_auth(token),
        json={
            "person_id": "00000000-0000-0000-0000-000000000099",
            "student_number": "X-1",
        },
    )
    assert missing_person.status_code == 404

    profile = client.post(
        "/api/v1/student-profiles",
        headers=_auth(token),
        json={"person_id": str(person_a.id), "student_number": "X-2"},
    ).json()
    bad_program = client.post(
        "/api/v1/enrollments",
        headers=_auth(token),
        json={
            "student_profile_id": profile["id"],
            "program_id": "00000000-0000-0000-0000-000000000099",
            "academic_year_id": "00000000-0000-0000-0000-000000000098",
        },
    )
    assert bad_program.status_code == 404


def test_rbac_admin_only(client, admin_user, teacher_user, student_user_a, person_a):
    assert client.get("/api/v1/student-profiles").status_code == 401

    student_tok = _login(client, "alice@example.com", "AlicePass1!")
    assert (
        client.get("/api/v1/student-profiles", headers=_auth(student_tok)).status_code
        == 403
    )
    teacher_tok = _login(client, "teacher@example.com", "TeacherPass1!")
    assert (
        client.post(
            "/api/v1/student-profiles",
            headers=_auth(teacher_tok),
            json={"person_id": str(person_a.id), "student_number": "T-1"},
        ).status_code
        == 403
    )

    admin_tok = _login(client, "admin@example.com", "AdminPass1!")
    assert (
        client.get("/api/v1/academic/catalog", headers=_auth(admin_tok)).status_code
        == 200
    )


def test_patch_profile_and_enrollment(client, admin_user, catalog, person_a):
    token = _login(client, "admin@example.com", "AdminPass1!")
    profile = client.post(
        "/api/v1/student-profiles",
        headers=_auth(token),
        json={"person_id": str(person_a.id), "student_number": "PATCH-1"},
    ).json()
    patched = client.patch(
        f"/api/v1/student-profiles/{profile['id']}",
        headers=_auth(token),
        json={"student_number": "PATCH-1B", "status": "suspended"},
    )
    assert patched.status_code == 200, patched.text
    assert patched.json()["student_number"] == "PATCH-1B"
    assert patched.json()["status"] == "suspended"
    assert "password" not in patched.text.lower()
    assert "secret" not in patched.text.lower()

    enr = client.post(
        "/api/v1/enrollments",
        headers=_auth(token),
        json={
            "student_profile_id": profile["id"],
            "program_id": str(catalog["program"].id),
            "academic_year_id": str(catalog["year"].id),
            "status": "active",
        },
    ).json()
    updated = client.patch(
        f"/api/v1/enrollments/{enr['id']}",
        headers=_auth(token),
        json={"status": "withdrawn", "kind": "reenrollment"},
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["status"] == "withdrawn"
    assert updated.json()["kind"] == "reenrollment"

    # Persistance après relecture (équivalent refresh page)
    again = client.get(
        f"/api/v1/student-profiles/{profile['id']}",
        headers=_auth(token),
    )
    assert again.status_code == 200
    assert again.json()["student_number"] == "PATCH-1B"
    assert again.json()["enrollments"][0]["status"] == "withdrawn"


def test_admin_enrollment_visible_on_student_dossier(
    client, admin_user, catalog, person_a, student_user_a
):
    admin_tok = _login(client, "admin@example.com", "AdminPass1!")
    profile = client.post(
        "/api/v1/student-profiles",
        headers=_auth(admin_tok),
        json={"person_id": str(person_a.id), "student_number": "PORTAL-1"},
    ).json()
    client.post(
        "/api/v1/enrollments",
        headers=_auth(admin_tok),
        json={
            "student_profile_id": profile["id"],
            "program_id": str(catalog["program"].id),
            "academic_year_id": str(catalog["year"].id),
            "program_level_id": str(catalog["level"].id),
            "status": "active",
        },
    )
    student_tok = _login(client, "alice@example.com", "AlicePass1!")
    dossier = client.get(
        "/api/v1/auth/me/dossier",
        headers=_auth(student_tok),
    )
    assert dossier.status_code == 200
    body = dossier.json()
    assert body["academic"]["status"] == "ready"
    assert body["academic"]["student_number"] == "PORTAL-1"
    assert len(body["academic"]["enrollments"]) == 1

    # Isolation : Bob ne voit pas Alice
    # (créé sans profil → not_provisioned)
    pass


def test_students_isolated_via_dossier(
    client, admin_user, catalog, person_a, person_b, student_user_a, student_user_b
):
    admin_tok = _login(client, "admin@example.com", "AdminPass1!")
    for person, number in ((person_a, "ISO-A"), (person_b, "ISO-B")):
        profile = client.post(
            "/api/v1/student-profiles",
            headers=_auth(admin_tok),
            json={"person_id": str(person.id), "student_number": number},
        ).json()
        client.post(
            "/api/v1/enrollments",
            headers=_auth(admin_tok),
            json={
                "student_profile_id": profile["id"],
                "program_id": str(catalog["program"].id),
                "academic_year_id": str(catalog["year"].id),
                "status": "active",
            },
        )

    tok_a = _login(client, "alice@example.com", "AlicePass1!")
    tok_b = _login(client, "bob@example.com", "BobPass1!!")
    a = client.get("/api/v1/auth/me/dossier", headers=_auth(tok_a)).json()
    b = client.get("/api/v1/auth/me/dossier", headers=_auth(tok_b)).json()
    assert a["academic"]["student_number"] == "ISO-A"
    assert b["academic"]["student_number"] == "ISO-B"
    sneaky = client.get(
        f"/api/v1/auth/me/dossier?person_id={person_b.id}",
        headers=_auth(tok_a),
    ).json()
    assert sneaky["academic"]["student_number"] == "ISO-A"

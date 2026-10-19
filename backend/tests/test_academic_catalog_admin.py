"""Référentiel académique admin — programmes et années."""

from __future__ import annotations

import pytest
from sqlalchemy.orm import Session

from app.models import AcademicUnit, AcademicYear, Person, Program, Role, RoleName, User
from app.security.passwords import hash_password


def _login(client, email: str, password: str) -> str:
    r = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def unit(db_session: Session) -> AcademicUnit:
    row = AcademicUnit(code="INFO_IA", name="Informatique", kind="faculte")
    db_session.add(row)
    db_session.commit()
    db_session.refresh(row)
    return row


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


@pytest.fixture()
def student_user(db_session: Session, seed_roles) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.student.value).one()
    user = User(
        email="student@example.com",
        hashed_password=hash_password("StudentPass1!"),
        full_name="Stud",
        roles=[role],
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def test_list_search_create_update_program(client, admin_user, unit):
    token = _login(client, "admin@example.com", "AdminPass1!")
    created = client.post(
        "/api/v1/academic/programs",
        headers=_auth(token),
        json={
            "academic_unit_id": str(unit.id),
            "code": "INFO_IA_CURSUS",
            "title": "Cursus Info",
            "cycle": "Licence",
        },
    )
    assert created.status_code == 201, created.text
    body = created.json()
    assert body["code"] == "INFO_IA_CURSUS"
    assert body["academic_unit_code"] == "INFO_IA"

    listed = client.get(
        "/api/v1/academic/programs?q=INFO",
        headers=_auth(token),
    )
    assert listed.status_code == 200
    assert listed.json()["total"] == 1

    got = client.get(
        f"/api/v1/academic/programs/{body['id']}",
        headers=_auth(token),
    )
    assert got.status_code == 200
    assert got.json()["title"] == "Cursus Info"

    patched = client.patch(
        f"/api/v1/academic/programs/{body['id']}",
        headers=_auth(token),
        json={"title": "Cursus Informatique & IA"},
    )
    assert patched.status_code == 200
    assert patched.json()["title"] == "Cursus Informatique & IA"

    dup = client.post(
        "/api/v1/academic/programs",
        headers=_auth(token),
        json={
            "academic_unit_id": str(unit.id),
            "code": "INFO_IA_CURSUS",
            "title": "Autre",
        },
    )
    assert dup.status_code == 409


def test_create_update_academic_year(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    created = client.post(
        "/api/v1/academic/years",
        headers=_auth(token),
        json={"label": "2026-2027", "is_current": True},
    )
    assert created.status_code == 201, created.text
    year_id = created.json()["id"]
    assert created.json()["is_current"] is True

    second = client.post(
        "/api/v1/academic/years",
        headers=_auth(token),
        json={"label": "2027-2028", "is_current": True},
    )
    assert second.status_code == 201
    # Only one current
    listed = client.get("/api/v1/academic/years", headers=_auth(token))
    currents = [y for y in listed.json()["items"] if y["is_current"]]
    assert len(currents) == 1
    assert currents[0]["label"] == "2027-2028"

    bad_dates = client.post(
        "/api/v1/academic/years",
        headers=_auth(token),
        json={
            "label": "BAD",
            "starts_on": "2026-10-01",
            "ends_on": "2026-01-01",
        },
    )
    assert bad_dates.status_code == 422

    dup = client.post(
        "/api/v1/academic/years",
        headers=_auth(token),
        json={"label": "2026-2027"},
    )
    assert dup.status_code == 409

    patched = client.patch(
        f"/api/v1/academic/years/{year_id}",
        headers=_auth(token),
        json={"is_current": True},
    )
    assert patched.status_code == 200
    assert patched.json()["is_current"] is True


def test_catalog_rbac(client, admin_user, teacher_user, student_user, unit):
    assert client.get("/api/v1/academic/programs").status_code == 401
    student_tok = _login(client, "student@example.com", "StudentPass1!")
    assert (
        client.get("/api/v1/academic/programs", headers=_auth(student_tok)).status_code
        == 403
    )
    teacher_tok = _login(client, "teacher@example.com", "TeacherPass1!")
    assert (
        client.post(
            "/api/v1/academic/years",
            headers=_auth(teacher_tok),
            json={"label": "X"},
        ).status_code
        == 403
    )
    admin_tok = _login(client, "admin@example.com", "AdminPass1!")
    assert (
        client.get("/api/v1/academic/units", headers=_auth(admin_tok)).status_code == 200
    )


def test_missing_unit_and_program(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    missing = client.post(
        "/api/v1/academic/programs",
        headers=_auth(token),
        json={
            "academic_unit_id": "00000000-0000-0000-0000-000000000099",
            "code": "X",
            "title": "Y",
        },
    )
    assert missing.status_code == 404
    assert (
        client.get(
            "/api/v1/academic/programs/00000000-0000-0000-0000-000000000099",
            headers=_auth(token),
        ).status_code
        == 404
    )


def test_list_create_update_program_level(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    created = client.post(
        "/api/v1/academic/levels",
        headers=_auth(token),
        json={"code": "L1_LMD", "label": "L1 LMD", "sort_order": 1},
    )
    assert created.status_code == 201, created.text
    body = created.json()
    assert body["code"] == "L1_LMD"
    assert body["sort_order"] == 1

    listed = client.get("/api/v1/academic/levels", headers=_auth(token))
    assert listed.status_code == 200
    assert listed.json()["total"] >= 1
    assert any(x["code"] == "L1_LMD" for x in listed.json()["items"])

    patched = client.patch(
        f"/api/v1/academic/levels/{body['id']}",
        headers=_auth(token),
        json={"label": "L1 LMD (intérimaire)"},
    )
    assert patched.status_code == 200
    assert patched.json()["label"] == "L1 LMD (intérimaire)"

    dup = client.post(
        "/api/v1/academic/levels",
        headers=_auth(token),
        json={"code": "L1_LMD", "label": "Autre", "sort_order": 2},
    )
    assert dup.status_code == 409

    invalid = client.post(
        "/api/v1/academic/levels",
        headers=_auth(token),
        json={"code": "FAKE_LVL", "label": "Inventé", "sort_order": 99},
    )
    assert invalid.status_code == 422

    assert (
        client.get(
            "/api/v1/academic/levels/00000000-0000-0000-0000-000000000099",
            headers=_auth(token),
        ).status_code
        == 404
    )


def test_soft_delete_enrollment_allows_recreate(
    client, admin_user, unit, db_session: Session
):
    token = _login(client, "admin@example.com", "AdminPass1!")
    program = client.post(
        "/api/v1/academic/programs",
        headers=_auth(token),
        json={
            "academic_unit_id": str(unit.id),
            "code": "SOFT_P",
            "title": "Prog soft",
        },
    ).json()
    year = client.post(
        "/api/v1/academic/years",
        headers=_auth(token),
        json={"label": "2026-2027", "is_current": True},
    ).json()
    person = Person(last_name="Soft", first_name="Del", email="soft@example.com")
    db_session.add(person)
    db_session.commit()
    db_session.refresh(person)
    profile = client.post(
        "/api/v1/student-profiles",
        headers=_auth(token),
        json={"person_id": str(person.id), "student_number": "SOFT-1"},
    ).json()
    payload = {
        "student_profile_id": profile["id"],
        "program_id": program["id"],
        "academic_year_id": year["id"],
        "status": "active",
        "kind": "initial",
    }
    enr = client.post("/api/v1/enrollments", headers=_auth(token), json=payload)
    assert enr.status_code == 201
    deleted = client.delete(
        f"/api/v1/enrollments/{enr.json()['id']}",
        headers=_auth(token),
    )
    assert deleted.status_code == 200
    assert deleted.json()["id"] == enr.json()["id"]
    recreated = client.post(
        "/api/v1/enrollments", headers=_auth(token), json=payload
    )
    assert recreated.status_code == 201


def test_two_programs_same_year_allowed(client, admin_user, unit, db_session: Session):
    """D-022 option A : deux programmes la même année = OK."""
    token = _login(client, "admin@example.com", "AdminPass1!")
    p1 = client.post(
        "/api/v1/academic/programs",
        headers=_auth(token),
        json={
            "academic_unit_id": str(unit.id),
            "code": "P_A",
            "title": "Prog A",
        },
    ).json()
    p2 = client.post(
        "/api/v1/academic/programs",
        headers=_auth(token),
        json={
            "academic_unit_id": str(unit.id),
            "code": "P_B",
            "title": "Prog B",
        },
    ).json()
    year = client.post(
        "/api/v1/academic/years",
        headers=_auth(token),
        json={"label": "2026-2027", "is_current": True},
    ).json()
    person = Person(last_name="Dual", first_name="Prog", email="dual@example.com")
    db_session.add(person)
    db_session.commit()
    db_session.refresh(person)
    profile = client.post(
        "/api/v1/student-profiles",
        headers=_auth(token),
        json={"person_id": str(person.id), "student_number": "DUAL-1"},
    ).json()
    for prog in (p1, p2):
        r = client.post(
            "/api/v1/enrollments",
            headers=_auth(token),
            json={
                "student_profile_id": profile["id"],
                "program_id": prog["id"],
                "academic_year_id": year["id"],
                "status": "active",
            },
        )
        assert r.status_code == 201, r.text


def test_level_rbac(client, admin_user, student_user):
    assert client.get("/api/v1/academic/levels").status_code == 401
    student_tok = _login(client, "student@example.com", "StudentPass1!")
    assert (
        client.post(
            "/api/v1/academic/levels",
            headers=_auth(student_tok),
            json={"code": "X", "label": "Y", "sort_order": 1},
        ).status_code
        == 403
    )


def test_enrollment_still_works_after_program_update(
    client, admin_user, unit, db_session: Session, seed_roles
):
    token = _login(client, "admin@example.com", "AdminPass1!")
    program = client.post(
        "/api/v1/academic/programs",
        headers=_auth(token),
        json={
            "academic_unit_id": str(unit.id),
            "code": "KEEP_ME",
            "title": "Programme stable",
        },
    ).json()
    year = client.post(
        "/api/v1/academic/years",
        headers=_auth(token),
        json={"label": "2026-2027", "is_current": True},
    ).json()
    level = client.post(
        "/api/v1/academic/levels",
        headers=_auth(token),
        json={"code": "L1_LMD", "label": "L1 LMD", "sort_order": 1},
    ).json()
    person = Person(last_name="Keep", first_name="Enr", email="keep@example.com")
    db_session.add(person)
    db_session.commit()
    db_session.refresh(person)
    profile = client.post(
        "/api/v1/student-profiles",
        headers=_auth(token),
        json={"person_id": str(person.id), "student_number": "KEEP-1"},
    ).json()
    enr = client.post(
        "/api/v1/enrollments",
        headers=_auth(token),
        json={
            "student_profile_id": profile["id"],
            "program_id": program["id"],
            "academic_year_id": year["id"],
            "program_level_id": level["id"],
            "status": "active",
        },
    )
    assert enr.status_code == 201
    client.patch(
        f"/api/v1/academic/programs/{program['id']}",
        headers=_auth(token),
        json={"title": "Programme renommé"},
    )
    client.patch(
        f"/api/v1/academic/levels/{level['id']}",
        headers=_auth(token),
        json={"label": "L1 LMD mis à jour"},
    )
    detail = client.get(
        f"/api/v1/enrollments/{enr.json()['id']}",
        headers=_auth(token),
    )
    assert detail.status_code == 200
    assert detail.json()["program"]["title"] == "Programme renommé"
    assert detail.json()["program"]["code"] == "KEEP_ME"
    assert detail.json()["program_level"]["label"] == "L1 LMD mis à jour"

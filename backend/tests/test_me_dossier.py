"""GET /auth/me/dossier — isolation étudiant, pas de person_id client."""

from __future__ import annotations

import pytest
from sqlalchemy.orm import Session

from app.models import Person, Role, RoleName, User
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


def test_students_isolated(client, student_a, student_b):
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
    assert a["person"]["email"] == "alice@example.com"
    assert b["person"]["email"] == "bob@example.com"
    # Aucun moyen de passer person_id : query ignorée / absente
    sneaky = client.get(
        f"/api/v1/auth/me/dossier?person_id={student_b.person_id}",
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert sneaky.status_code == 200
    assert sneaky.json()["person"]["id"] == str(student_a.person_id)


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

"""GET /auth/me/person — lecture de sa propre fiche Person uniquement."""

from __future__ import annotations

import pytest
from sqlalchemy.orm import Session

from app.models import Person, Role, RoleName, User
from app.security.passwords import hash_password


@pytest.fixture()
def student_with_person(db_session: Session, seed_roles: None) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.student.value).one()
    person = Person(
        last_name="Demo",
        first_name="Alice",
        email="student@example.com",
    )
    db_session.add(person)
    db_session.flush()
    user = User(
        email="student@example.com",
        hashed_password=hash_password("StudentPass1!"),
        full_name="Alice Demo",
        roles=[role],
        person_id=person.id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def teacher_with_person(db_session: Session, seed_roles: None) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.teacher.value).one()
    person = Person(
        last_name="Prof",
        first_name="Bob",
        email="teacher@example.com",
    )
    db_session.add(person)
    db_session.flush()
    user = User(
        email="teacher@example.com",
        hashed_password=hash_password("TeacherPass1!"),
        full_name="Bob Prof",
        roles=[role],
        person_id=person.id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _token(client, email: str, password: str) -> str:
    r = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    return r.json()["access_token"]


def test_student_reads_own_person(client, student_with_person):
    token = _token(client, "student@example.com", "StudentPass1!")
    response = client.get(
        "/api/v1/auth/me/person",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["first_name"] == "Alice"
    assert body["last_name"] == "Demo"
    assert body["id"] == str(student_with_person.person_id)
    assert "StudentPass1!" not in response.text


def test_teacher_reads_own_person(client, teacher_with_person):
    token = _token(client, "teacher@example.com", "TeacherPass1!")
    response = client.get(
        "/api/v1/auth/me/person",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["first_name"] == "Bob"


def test_me_person_404_without_link(client, student_user):
    token = _token(client, "student@example.com", "StudentPass1!")
    response = client.get(
        "/api/v1/auth/me/person",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404


def test_me_person_requires_auth(client):
    response = client.get("/api/v1/auth/me/person")
    assert response.status_code == 401


def test_student_cannot_read_persons_admin_list(client, student_with_person):
    token = _token(client, "student@example.com", "StudentPass1!")
    response = client.get(
        "/api/v1/persons",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


def test_admin_without_person_gets_404(client, admin_user):
    token = _token(client, "admin@example.com", "AdminPass1!")
    response = client.get(
        "/api/v1/auth/me/person",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404

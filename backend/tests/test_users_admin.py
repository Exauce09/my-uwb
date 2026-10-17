"""Gestion administrative des utilisateurs — SQLite mémoire uniquement."""

from __future__ import annotations

import uuid

import pytest

from app.models import Role, RoleName, User
from app.security.passwords import hash_password


def _login(client, email: str, password: str) -> str:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def teacher_user(db_session, seed_roles) -> User:
    role = db_session.query(Role).filter(Role.name == RoleName.teacher.value).one()
    user = User(
        email="teacher@example.com",
        hashed_password=hash_password("TeacherPass1!"),
        full_name="Teacher Test",
        roles=[role],
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


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


def test_admin_lists_users(client, admin_user, student_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.get("/api/v1/users", headers=_auth(token))
    assert response.status_code == 200
    body = response.json()
    assert body["total"] >= 2
    assert body["page"] == 1
    assert "hashed_password" not in response.text
    emails = {item["email"] for item in body["items"]}
    assert "admin@example.com" in emails
    assert "student@example.com" in emails
    for item in body["items"]:
        assert "hashed_password" not in item
        assert "created_at" in item
        assert "roles" in item


def test_admin_gets_user(client, admin_user, student_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.get(
        f"/api/v1/users/{student_user.id}",
        headers=_auth(token),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "student@example.com"
    assert "hashed_password" not in data


def test_get_user_not_found(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.get(f"/api/v1/users/{uuid.uuid4()}", headers=_auth(token))
    assert response.status_code == 404


def test_student_and_teacher_denied_list(
    client, admin_user, student_user, teacher_user
):
    for email, password in (
        ("student@example.com", "StudentPass1!"),
        ("teacher@example.com", "TeacherPass1!"),
    ):
        token = _login(client, email, password)
        assert client.get("/api/v1/users", headers=_auth(token)).status_code == 403


def test_list_pagination_and_search(client, admin_user, student_user, teacher_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    page1 = client.get(
        "/api/v1/users",
        headers=_auth(token),
        params={"page": 1, "page_size": 2},
    )
    assert page1.status_code == 200
    assert len(page1.json()["items"]) == 2
    assert page1.json()["page_size"] == 2
    assert page1.json()["total"] >= 3

    search = client.get(
        "/api/v1/users",
        headers=_auth(token),
        params={"q": "teacher"},
    )
    assert search.status_code == 200
    assert search.json()["total"] == 1
    assert search.json()["items"][0]["email"] == "teacher@example.com"


def test_activate_deactivate(client, admin_user, student_user, second_admin):
    token = _login(client, "admin@example.com", "AdminPass1!")
    deactivate = client.patch(
        f"/api/v1/users/{student_user.id}/status",
        headers=_auth(token),
        json={"is_active": False},
    )
    assert deactivate.status_code == 200
    assert deactivate.json()["is_active"] is False

    again = client.patch(
        f"/api/v1/users/{student_user.id}/status",
        headers=_auth(token),
        json={"is_active": False},
    )
    assert again.status_code == 200
    assert again.json()["is_active"] is False

    activate = client.patch(
        f"/api/v1/users/{student_user.id}/status",
        headers=_auth(token),
        json={"is_active": True},
    )
    assert activate.status_code == 200
    assert activate.json()["is_active"] is True


def test_cannot_self_deactivate_when_another_admin_exists(
    client, admin_user, second_admin
):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.patch(
        f"/api/v1/users/{admin_user.id}/status",
        headers=_auth(token),
        json={"is_active": False},
    )
    assert response.status_code == 400
    assert "propre compte" in response.json()["detail"]


def test_cannot_deactivate_last_active_admin(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.patch(
        f"/api/v1/users/{admin_user.id}/status",
        headers=_auth(token),
        json={"is_active": False},
    )
    assert response.status_code == 409
    assert "dernier administrateur actif" in response.json()["detail"]


def test_deactivate_other_admin_when_another_remains(
    client, admin_user, second_admin
):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.patch(
        f"/api/v1/users/{second_admin.id}/status",
        headers=_auth(token),
        json={"is_active": False},
    )
    assert response.status_code == 200
    assert response.json()["is_active"] is False


def test_assign_and_remove_roles(client, admin_user, student_user, second_admin):
    token = _login(client, "admin@example.com", "AdminPass1!")
    assigned = client.post(
        f"/api/v1/users/{student_user.id}/roles",
        headers=_auth(token),
        json={"role": "teacher"},
    )
    assert assigned.status_code == 200
    assert set(assigned.json()["roles"]) == {"student", "teacher"}

    dup = client.post(
        f"/api/v1/users/{student_user.id}/roles",
        headers=_auth(token),
        json={"role": "teacher"},
    )
    assert dup.status_code == 200
    assert dup.json()["roles"].count("teacher") == 1

    removed = client.delete(
        f"/api/v1/users/{student_user.id}/roles/teacher",
        headers=_auth(token),
    )
    assert removed.status_code == 200
    assert removed.json()["roles"] == ["student"]


def test_invalid_role_and_missing_user(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    invalid = client.post(
        f"/api/v1/users/{admin_user.id}/roles",
        headers=_auth(token),
        json={"role": "superuser"},
    )
    assert invalid.status_code == 400

    missing = client.post(
        f"/api/v1/users/{uuid.uuid4()}/roles",
        headers=_auth(token),
        json={"role": "teacher"},
    )
    assert missing.status_code == 404

    bad_delete = client.delete(
        f"/api/v1/users/{admin_user.id}/roles/nope",
        headers=_auth(token),
    )
    assert bad_delete.status_code == 400


def test_cannot_remove_last_active_admin_role(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.delete(
        f"/api/v1/users/{admin_user.id}/roles/admin",
        headers=_auth(token),
    )
    assert response.status_code == 409
    assert "dernier administrateur" in response.json()["detail"]


def test_can_remove_admin_role_when_another_active_admin_exists(
    client, admin_user, second_admin
):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.delete(
        f"/api/v1/users/{second_admin.id}/roles/admin",
        headers=_auth(token),
    )
    assert response.status_code == 200
    assert "admin" not in response.json()["roles"]


def test_status_unknown_user(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.patch(
        f"/api/v1/users/{uuid.uuid4()}/status",
        headers=_auth(token),
        json={"is_active": False},
    )
    assert response.status_code == 404

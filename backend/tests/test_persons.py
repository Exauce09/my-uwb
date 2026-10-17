"""API Person + liaison User — SQLite mémoire (ne valide pas PostgreSQL)."""

from __future__ import annotations

import pytest

from app.models import Person, Role, RoleName, User
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


def test_create_and_get_person(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    created = client.post(
        "/api/v1/persons",
        headers=_auth(token),
        json={
            "last_name": "Kabila",
            "first_name": "Marie",
            "email": "marie.contact@example.com",
            "phone": "+243800000001",
            "birth_date": "1998-05-12",
        },
    )
    assert created.status_code == 201, created.text
    body = created.json()
    assert body["last_name"] == "Kabila"
    assert body["first_name"] == "Marie"
    assert body["email"] == "marie.contact@example.com"
    assert body["deleted_at"] is None
    assert "hashed_password" not in created.text

    got = client.get(f"/api/v1/persons/{body['id']}", headers=_auth(token))
    assert got.status_code == 200
    assert got.json()["id"] == body["id"]


def test_create_requires_names(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.post(
        "/api/v1/persons",
        headers=_auth(token),
        json={"last_name": "", "first_name": "A"},
    )
    assert response.status_code == 422


def test_optional_contact_fields(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    response = client.post(
        "/api/v1/persons",
        headers=_auth(token),
        json={"last_name": "Ngoma", "first_name": "Paul"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] is None
    assert data["phone"] is None
    assert data["birth_date"] is None


def test_list_search_pagination(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    for ln, fn in (("Alpha", "Un"), ("Beta", "Deux"), ("Alpha", "Trois")):
        assert (
            client.post(
                "/api/v1/persons",
                headers=_auth(token),
                json={"last_name": ln, "first_name": fn},
            ).status_code
            == 201
        )

    listed = client.get(
        "/api/v1/persons",
        headers=_auth(token),
        params={"q": "alpha", "page": 1, "page_size": 10},
    )
    assert listed.status_code == 200
    body = listed.json()
    assert body["total"] == 2
    assert len(body["items"]) == 2
    assert all("Alpha" == i["last_name"] for i in body["items"])


def test_update_person(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    created = client.post(
        "/api/v1/persons",
        headers=_auth(token),
        json={"last_name": "Old", "first_name": "Name"},
    ).json()
    updated = client.patch(
        f"/api/v1/persons/{created['id']}",
        headers=_auth(token),
        json={"last_name": "New", "phone": "123"},
    )
    assert updated.status_code == 200
    assert updated.json()["last_name"] == "New"
    assert updated.json()["phone"] == "123"
    assert updated.json()["first_name"] == "Name"


def test_soft_delete_hides_from_list_and_get(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    created = client.post(
        "/api/v1/persons",
        headers=_auth(token),
        json={"last_name": "Gone", "first_name": "Soon"},
    ).json()
    deleted = client.delete(
        f"/api/v1/persons/{created['id']}",
        headers=_auth(token),
    )
    assert deleted.status_code == 200
    assert deleted.json()["deleted_at"] is not None

    assert (
        client.get(
            f"/api/v1/persons/{created['id']}",
            headers=_auth(token),
        ).status_code
        == 404
    )
    listed = client.get("/api/v1/persons", headers=_auth(token), params={"q": "Gone"})
    assert listed.status_code == 200
    assert listed.json()["total"] == 0


def test_link_and_unlink_person(client, admin_user, student_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    person = client.post(
        "/api/v1/persons",
        headers=_auth(token),
        json={"last_name": "Student", "first_name": "One"},
    ).json()

    linked = client.put(
        f"/api/v1/users/{student_user.id}/person",
        headers=_auth(token),
        json={"person_id": person["id"]},
    )
    assert linked.status_code == 200
    assert linked.json()["person_id"] == person["id"]

    # Idempotent
    again = client.put(
        f"/api/v1/users/{student_user.id}/person",
        headers=_auth(token),
        json={"person_id": person["id"]},
    )
    assert again.status_code == 200

    unlinked = client.delete(
        f"/api/v1/users/{student_user.id}/person",
        headers=_auth(token),
    )
    assert unlinked.status_code == 200
    assert unlinked.json()["person_id"] is None


def test_cannot_link_soft_deleted_person(client, admin_user, student_user, db_session):
    token = _login(client, "admin@example.com", "AdminPass1!")
    person = Person(last_name="X", first_name="Y")
    db_session.add(person)
    db_session.commit()
    db_session.refresh(person)
    person_id = person.id

    client.delete(f"/api/v1/persons/{person_id}", headers=_auth(token))
    response = client.put(
        f"/api/v1/users/{student_user.id}/person",
        headers=_auth(token),
        json={"person_id": str(person_id)},
    )
    assert response.status_code == 404


def test_cannot_double_link_person_to_two_users(
    client, admin_user, student_user, teacher_user
):
    token = _login(client, "admin@example.com", "AdminPass1!")
    person = client.post(
        "/api/v1/persons",
        headers=_auth(token),
        json={"last_name": "Shared", "first_name": "P"},
    ).json()
    assert (
        client.put(
            f"/api/v1/users/{student_user.id}/person",
            headers=_auth(token),
            json={"person_id": person["id"]},
        ).status_code
        == 200
    )
    conflict = client.put(
        f"/api/v1/users/{teacher_user.id}/person",
        headers=_auth(token),
        json={"person_id": person["id"]},
    )
    assert conflict.status_code == 409


def test_cannot_silently_reassign_user_person(
    client, admin_user, student_user
):
    token = _login(client, "admin@example.com", "AdminPass1!")
    p1 = client.post(
        "/api/v1/persons",
        headers=_auth(token),
        json={"last_name": "A", "first_name": "1"},
    ).json()
    p2 = client.post(
        "/api/v1/persons",
        headers=_auth(token),
        json={"last_name": "B", "first_name": "2"},
    ).json()
    assert (
        client.put(
            f"/api/v1/users/{student_user.id}/person",
            headers=_auth(token),
            json={"person_id": p1["id"]},
        ).status_code
        == 200
    )
    conflict = client.put(
        f"/api/v1/users/{student_user.id}/person",
        headers=_auth(token),
        json={"person_id": p2["id"]},
    )
    assert conflict.status_code == 409


def test_unauthenticated_and_non_admin_denied(
    client, admin_user, student_user, teacher_user
):
    assert client.get("/api/v1/persons").status_code == 401
    for email, password in (
        ("student@example.com", "StudentPass1!"),
        ("teacher@example.com", "TeacherPass1!"),
    ):
        token = _login(client, email, password)
        assert client.get("/api/v1/persons", headers=_auth(token)).status_code == 403


def test_admin_without_person_still_works(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    me = client.get("/api/v1/auth/me", headers=_auth(token))
    assert me.status_code == 200
    assert me.json().get("person_id") in (None, me.json().get("person_id"))
    # Admin bootstrap-compatible : pas de Person obligatoire
    data = me.json()
    assert data["email"] == "admin@example.com"
    assert data.get("person_id") is None

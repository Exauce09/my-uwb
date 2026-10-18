"""
Portail étudiant / enseignant — auth API et RBAC serveur.

Les destinations UI (`next`) sont testées en contrat miroir de
`apps/website/src/auth/portalHome.ts` (pas de runtime React ici).
"""

from __future__ import annotations

import pytest
from sqlalchemy.orm import Session

from app.models import Role, RoleName, User
from app.security.passwords import hash_password, verify_password

# --- Contrat redirection (doit rester aligné sur portalHome.ts) ---

_PORTAL_ALLOWED_NEXT = {
    "/espace-etudiant": "student",
    "/espace-etudiant/dossier": "student",
    "/espace-enseignant": "teacher",
}


def _portal_home_for_roles(roles: list[str]) -> str:
    if "student" in roles:
        return "/espace-etudiant"
    if "teacher" in roles:
        return "/espace-enseignant"
    return "/connexion"


def _parse_safe_portal_next(raw: str | None) -> str | None:
    if raw is None or not isinstance(raw, str):
        return None
    trimmed = raw.strip()
    if not trimmed:
        return None
    if "\\" in trimmed or "\0" in trimmed:
        return None
    lower = trimmed.lower()
    if "%2f" in lower or "%5c" in lower or "%00" in lower:
        return None
    if "://" in trimmed:
        return None
    if not trimmed.startswith("/"):
        return None
    if trimmed.startswith("//"):
        return None
    if len(trimmed) > 1 and "//" in trimmed:
        return None
    path_only = trimmed.split("?", 1)[0].split("#", 1)[0]
    if path_only in _PORTAL_ALLOWED_NEXT:
        return path_only
    return None


def _resolve_safe_portal_destination(
    roles: list[str], next_path: str | None
) -> str:
    fallback = _portal_home_for_roles(roles)
    if fallback == "/connexion":
        return fallback
    safe = _parse_safe_portal_next(next_path)
    if safe is None:
        return fallback
    required = _PORTAL_ALLOWED_NEXT[safe]
    if required not in roles:
        return fallback
    return safe


@pytest.fixture()
def teacher_user(db_session: Session, seed_roles: None) -> User:
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


def _login(client, email: str, password: str) -> str:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200, response.text
    assert "access_token" in response.json()
    assert password not in response.text
    return response.json()["access_token"]


def test_student_login_and_me(client, student_user):
    token = _login(client, "student@example.com", "StudentPass1!")
    me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me.status_code == 200
    body = me.json()
    assert body["email"] == "student@example.com"
    assert body["roles"] == ["student"]


def test_teacher_login_and_me(client, teacher_user):
    token = _login(client, "teacher@example.com", "TeacherPass1!")
    me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me.status_code == 200
    assert me.json()["roles"] == ["teacher"]


def test_admin_login_keeps_admin_access(client, admin_user):
    token = _login(client, "admin@example.com", "AdminPass1!")
    me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me.status_code == 200
    assert me.json()["roles"] == ["admin"]
    persons = client.get(
        "/api/v1/persons",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert persons.status_code == 200


def test_student_forbidden_on_persons(client, student_user):
    token = _login(client, "student@example.com", "StudentPass1!")
    response = client.get(
        "/api/v1/persons",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Droits insuffisants."
    assert "StudentPass1!" not in response.text


def test_teacher_forbidden_on_persons(client, teacher_user):
    token = _login(client, "teacher@example.com", "TeacherPass1!")
    response = client.get(
        "/api/v1/persons",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Droits insuffisants."


def test_logout_clears_session(client, student_user):
    token = _login(client, "student@example.com", "StudentPass1!")
    out = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert out.status_code == 204
    # Cookie de session effacé côté réponse
    # (TestClient peut conserver le Bearer ; sans Bearer → 401)
    me = client.get("/api/v1/auth/me")
    assert me.status_code == 401


@pytest.mark.parametrize(
    ("roles", "next_path", "expected"),
    [
        (["student"], None, "/espace-etudiant"),
        (["teacher"], None, "/espace-enseignant"),
        (["student"], "/espace-etudiant", "/espace-etudiant"),
        (["student"], "/espace-etudiant/dossier", "/espace-etudiant/dossier"),
        (["teacher"], "/espace-enseignant", "/espace-enseignant"),
        (["teacher"], "/espace-etudiant/dossier", "/espace-enseignant"),
        # Cross-role → fallback sûr
        (["student"], "/espace-enseignant", "/espace-etudiant"),
        (["teacher"], "/espace-etudiant", "/espace-enseignant"),
        # Dual role : next autorisé si rôle présent
        (["student", "teacher"], "/espace-enseignant", "/espace-enseignant"),
        (["student", "teacher"], "/espace-etudiant", "/espace-etudiant"),
        # Externes / ambigus
        (["student"], "//evil.example", "/espace-etudiant"),
        (["student"], "https://evil.example", "/espace-etudiant"),
        (["student"], "/\\evil", "/espace-etudiant"),
        (["student"], "/espace-etudiant/../admin", "/espace-etudiant"),
        (["student"], "/admissions", "/espace-etudiant"),
        (["student"], "/connexion", "/espace-etudiant"),
        (["admin"], "/espace-etudiant", "/connexion"),
        (["student"], "/%2f%2fevil.example", "/espace-etudiant"),
    ],
)
def test_portal_redirect_contract(roles, next_path, expected):
    assert _resolve_safe_portal_destination(roles, next_path) == expected


def test_admin_only_has_no_portal_home():
    assert _portal_home_for_roles(["admin"]) == "/connexion"
    assert _resolve_safe_portal_destination(["admin"], "/espace-etudiant") == (
        "/connexion"
    )


def test_password_not_verifiable_as_plaintext_in_db(student_user):
    assert student_user.hashed_password != "StudentPass1!"
    assert verify_password("StudentPass1!", student_user.hashed_password)

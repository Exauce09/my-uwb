def test_student_cannot_create_user(client, student_user):
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "StudentPass1!"},
    )
    token = login.json()["access_token"]
    response = client.post(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "email": "new@example.com",
            "password": "NewUserPass1!",
            "roles": ["student"],
        },
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Droits insuffisants."
    # 403 ≠ 401 : authentifié mais non autorisé
    assert response.status_code != 401
    assert "NewUserPass1!" not in response.text
    assert "traceback" not in response.text.lower()


def test_admin_can_create_user(client, admin_user):
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "AdminPass1!"},
    )
    token = login.json()["access_token"]
    response = client.post(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "email": "teacher@example.com",
            "password": "TeacherPass1!",
            "full_name": "Enseignant",
            "roles": ["teacher"],
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "teacher@example.com"
    assert data["roles"] == ["teacher"]

def test_health_ok(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "sigu-backend"
    assert "version" in data
    # Aucun secret dans la réponse
    assert "secret" not in str(data).lower()
    assert "database" not in data
    assert "password" not in str(data).lower()

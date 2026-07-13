def test_get_dashboard_stats(client, admin_token):
    response = client.get(
        "/api/v1/dashboard/stats",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "stats" in data
    assert "transaction_overview" in data
    assert "risk_distribution" in data

def test_get_dashboard_stats_unauthorized(client):
    response = client.get("/api/v1/dashboard/stats")
    assert response.status_code == 401

# apps/backend/tests/test_auth.py

import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app

@pytest.mark.asyncio
async def test_register_user():
    test_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "securepassword"
    }

    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/auth/register", json=test_data)

    assert response.status_code in [200, 400]

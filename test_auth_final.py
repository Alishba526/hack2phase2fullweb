import requests
import json
import time

BASE_URL = "http://127.0.0.1:8001"

def test_auth_flow():
    print("Testing authentication flow with Neon PostgreSQL database...")

    # Test registration
    print("\n1. Testing user registration...")
    register_data = {
        "email": "testuser@example.com",
        "password": "SecurePass123!",
        "first_name": "Test",
        "last_name": "User"
    }

    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print(f"Registration response: {response.status_code}")
    if response.status_code == 200:
        print("[SUCCESS] Registration successful")
        user_data = response.json()
        print(f"Created user: {user_data['email']}")
    elif response.status_code == 409:
        print("[WARNING] User already exists, continuing with login test")
    else:
        print(f"[ERROR] Registration failed: {response.text}")
        return False

    # Test login
    print("\n2. Testing user login...")
    login_data = {
        "email": "testuser@example.com",
        "password": "SecurePass123!"
    }

    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Login response: {response.status_code}")
    if response.status_code == 200:
        print("[SUCCESS] Login successful")
        auth_data = response.json()
        access_token = auth_data['access_token']
        refresh_token = auth_data['refresh_token']
        print(f"Received access token: {access_token[:20]}...")
        print(f"Received refresh token: {refresh_token[:20]}...")
    else:
        print(f"[ERROR] Login failed: {response.text}")
        return False

    # Test accessing protected endpoint (get current user)
    print("\n3. Testing protected endpoint access...")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"Protected endpoint response: {response.status_code}")
    if response.status_code == 200:
        print("[SUCCESS] Protected endpoint access successful")
        user_info = response.json()
        print(f"Current user: {user_info['email']}")
    else:
        print(f"[ERROR] Protected endpoint access failed: {response.text}")
        return False

    # Test token refresh
    print("\n4. Testing token refresh...")
    refresh_data = {
        "refresh_token": refresh_token
    }

    response = requests.post(f"{BASE_URL}/auth/refresh", json=refresh_data)
    print(f"Token refresh response: {response.status_code}")
    if response.status_code == 200:
        print("[SUCCESS] Token refresh successful")
        refresh_response = response.json()
        new_access_token = refresh_response['access_token']
        print(f"New access token: {new_access_token[:20]}...")
    else:
        print(f"[ERROR] Token refresh failed: {response.text}")
        return False

    # Test logout
    print("\n5. Testing logout...")
    headers = {
        "Authorization": f"Bearer {access_token}",  # Use original token for logout
        "Content-Type": "application/json"
    }

    response = requests.post(f"{BASE_URL}/auth/logout", headers=headers)
    print(f"Logout response: {response.status_code}")
    if response.status_code == 200:
        print("[SUCCESS] Logout successful")
    else:
        print(f"[ERROR] Logout failed: {response.text}")
        return False

    print("\n[SUCCESS] All authentication tests passed!")
    return True

if __name__ == "__main__":
    try:
        success = test_auth_flow()
        if success:
            print("\n[INFO] Authentication system is working correctly with Neon PostgreSQL!")
        else:
            print("\n[ERROR] Some tests failed")
    except Exception as e:
        print(f"\n[ERROR] Error during testing: {e}")
        import traceback
        traceback.print_exc()
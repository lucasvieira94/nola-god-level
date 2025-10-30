#!/usr/bin/env python3
"""Script to test the production API endpoints"""

import requests
import json
import sys

BASE_URL = "https://nola-backend-ya2y.onrender.com"

def test_endpoint(name, method, url, data=None, headers=None, expected_status=200):
    """Test a single API endpoint"""
    try:
        print(f"\n🧪 Testing: {name}")
        print(f"   URL: {url}")
        
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=30)
        else:
            print(f"   ❌ Unsupported method: {method}")
            return False
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == expected_status:
            print(f"   ✅ PASSED")
            if response.text:
                try:
                    json_data = response.json()
                    print(f"   Response: {json.dumps(json_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            return True
        else:
            print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
            print(f"   Response: {response.text[:500]}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"   ⏱️  TIMEOUT - Server took too long to respond")
        return False
    except requests.exceptions.RequestException as e:
        print(f"   ❌ ERROR: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("🚀 Testing NOLA Backend API")
    print("=" * 60)
    
    results = []
    
    # Test 1: Health Check
    results.append(test_endpoint(
        "Health Check",
        "GET",
        f"{BASE_URL}/health"
    ))
    
    # Test 2: Register User
    import time
    test_email = f"test_{int(time.time())}@test.com"
    register_data = {
        "email": test_email,
        "password": "Test123!@#",
        "name": "Test User"
    }
    
    results.append(test_endpoint(
        "Register User",
        "POST",
        f"{BASE_URL}/api/auth/register",
        data=register_data,
        expected_status=201
    ))
    
    # Test 3: Login
    login_data = {
        "email": test_email,
        "password": "Test123!@#"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data, timeout=30)
    if response.status_code == 200:
        token = response.json().get("token")
        print(f"\n🔑 Got auth token: {token[:20]}...")
        
        # Test 4: Get Metrics (requires auth)
        headers = {"Authorization": f"Bearer {token}"}
        
        results.append(test_endpoint(
            "Get Overview Metrics",
            "GET",
            f"{BASE_URL}/api/metrics/overview?startDate=2025-05-01&endDate=2025-05-31",
            headers=headers
        ))
        
        results.append(test_endpoint(
            "Get Top Products",
            "GET",
            f"{BASE_URL}/api/metrics/top-products?startDate=2025-05-01&endDate=2025-05-31&limit=5",
            headers=headers
        ))
    else:
        print(f"\n❌ Login failed: {response.status_code}")
        results.append(False)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"✅ Passed: {passed}/{total}")
    print(f"❌ Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main()

"""Test script to verify API integration is working"""

import requests
import json

print("🔍 Testing Government & Finance API Integration...\n")

# Test 1: Check if server is running
print("1. Testing server health...")
try:
    response = requests.get("http://localhost:8002/health", timeout=5)
    if response.status_code == 200:
        print("   ✅ Server is healthy")
        print(f"   Response: {json.dumps(response.json(), indent=2)}\n")
    else:
        print(f"   ❌ Server returned status code: {response.status_code}\n")
except Exception as e:
    print(f"   ❌ Error connecting to server: {e}\n")

# Test 2: Test budget overview endpoint
print("2. Testing budget overview endpoint...")
try:
    response = requests.get("http://localhost:8002/budget/overview?year=2026", timeout=10)
    if response.status_code == 200:
        data = response.json()
        print("   ✅ Budget overview endpoint working")
        print(f"   Total Budget: ₹{data.get('total_budget', 0):,} Crores")
        print(f"   Financial Year: {data.get('financial_year', 'N/A')}")
        print(f"   Data Source: {data.get('data_source', 'N/A')}\n")
    else:
        print(f"   ❌ Endpoint returned status code: {response.status_code}\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

# Test 3: Test ministries endpoint
print("3. Testing ministries endpoint...")
try:
    response = requests.get("http://localhost:8002/budget/ministries?year=2026", timeout=10)
    if response.status_code == 200:
        data = response.json()
        print("   ✅ Ministries endpoint working")
        print(f"   Total Ministries: {data.get('total_ministries', 0)}")
        print(f"   Data Source: {data.get('data_source', 'N/A')}")
        if data.get('ministries'):
            print(f"   Top 3 Ministries by Allocation:")
            for i, ministry in enumerate(data['ministries'][:3], 1):
                print(f"      {i}. {ministry['ministry']}: ₹{ministry['allocation']:,} Cr")
        print()
    else:
        print(f"   ❌ Endpoint returned status code: {response.status_code}\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

# Test 4: Test states endpoint
print("4. Testing states endpoint...")
try:
    response = requests.get("http://localhost:8002/states/budgets?year=2026", timeout=10)
    if response.status_code == 200:
        data = response.json()
        print("   ✅ States endpoint working")
        print(f"   Total States/UTs: {data.get('total_states_uts', 0)}")
        print(f"   Data Source: {data.get('data_source', 'N/A')}\n")
    else:
        print(f"   ❌ Endpoint returned status code: {response.status_code}\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

print("✅ API Integration Test Complete!")

"""Quick API Test"""
import requests
import time

time.sleep(3)  # Wait for server to start

try:
    print("Testing /budget/overview...")
    response = requests.get("http://localhost:8002/budget/overview?year=2026", timeout=15)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Total Budget: ₹{data['total_budget']:,} Crores")
        print(f"Data Source: {data['data_source']}")
        print("\n✅ API Integration Working!")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Error: {e}")

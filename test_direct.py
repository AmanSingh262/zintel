"""Simple direct test"""
from government_finance_server import get_fallback_data

print("Testing get_fallback_data function...")

try:
    result = get_fallback_data("budget", "2026")
    print(f"✅ Success! Got {len(result)} ministries")
    print(f"First ministry: {list(result.keys())[0]}")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

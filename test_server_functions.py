"""Direct test of server functions"""
import sys
sys.path.insert(0, r"C:\Users\Asquare\Downloads\Zintel Website")

from government_finance_server import get_cached_or_fetch, fetch_union_budget_data, get_fallback_data

print("Testing server functions...\n")

# Test 1: get_fallback_data
print("1. Testing get_fallback_data('budget', '2026')...")
try:
    result = get_fallback_data("budget", "2026")
    print(f"   ✅ Success! Got {len(result)} ministries")
except Exception as e:
    print(f"   ❌ Error: {e}")
    import traceback
    traceback.print_exc()

# Test 2: get_cached_or_fetch
print("\n2. Testing get_cached_or_fetch('budget', '2026', fetch_union_budget_data)...")
try:
    result = get_cached_or_fetch("budget", "2026", fetch_union_budget_data)
    print(f"   ✅ Success! Got {len(result)} ministries")
    
    # Check the data structure
    first_ministry = list(result.keys())[0]
    print(f"   First ministry: {first_ministry}")
    print(f"   Data structure: {result[first_ministry]}")
except Exception as e:
    print(f"   ❌ Error: {e}")
    import traceback
    traceback.print_exc()

# Test 3: Simulate what the endpoint does
print("\n3. Simulating /budget/overview endpoint logic...")
try:
    budget_data = get_cached_or_fetch("budget", "2026", fetch_union_budget_data)
    total_allocation = sum(data["allocation"] for data in budget_data.values())
    total_spent = sum(data["spent"] for data in budget_data.values())
    utilization = (total_spent / total_allocation) * 100
    
    result = {
        "financial_year": "2025-26",
        "total_budget": total_allocation,
        "total_spent": total_spent,
        "utilization_percentage": round(utilization, 2),
        "currency": "INR Crores",
        "data_source": "Live API + Official Fallback Data"
    }
    print(f"   ✅ Success!")
    print(f"   Total Budget: ₹{result['total_budget']:,} Crores")
except Exception as e:
    print(f"   ❌ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n✅ All tests complete!")

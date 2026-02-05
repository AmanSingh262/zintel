print("Starting debug script...")
try:
    print("Importing main...")
    from backend.main import app
    print("Imported main successfully.")
except Exception as e:
    print(f"Failed to import main: {e}")
    import traceback
    traceback.print_exc()

print("Script finished.")

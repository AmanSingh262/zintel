import os

# Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data_store")
DB_PATH = os.path.join(BASE_DIR, "budget.db")

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# Sources - Using 2024-25 Interim Budget URLs as examples (These patterns persist)
# Note: Actual URLs need to be verified from indiabudget.gov.in as they change annually.
SOURCES = {
    # Expenditure Budget - Ministry/Department wise (Statement 1)
    "expenditure_ministry": {
        "url": "https://www.indiabudget.gov.in/doc/eb/sbe1.xlsx",
        "filename": "expenditure_ministry.xlsx",
        "type": "expenditure"
    },
    # Budget at a Glance - Deficit Statistics (Statement 1) or similar
    "budget_summary": {
        "url": "https://www.indiabudget.gov.in/doc/bag/bag2.xlsx", # Often 'Budget at a Glance' Statement 2
        "filename": "budget_summary.xlsx",
        "type": "summary"
    },
    # Receipts Budget (Abstract of Receipts)
    "receipts": {
        "url": "https://www.indiabudget.gov.in/doc/rec/ar.xlsx",
        "filename": "receipts.xlsx",
        "type": "receipts"
    }
}

# Column Mapping Keywords for Defensive Parsing
# We look for these keywords in column names to verify/standardize them
COLUMN_MAPPINGS = {
    "ministry": ["ministry", "department", "particulars"],
    "be_2024_25": ["budget", "estimates", "2024-2025", "2024-25"],
    "re_2023_24": ["revised", "estimates", "2023-2024", "2023-24"],
    "actuals": ["actuals"]
}

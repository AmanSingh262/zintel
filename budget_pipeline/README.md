# India Union Budget Data Pipeline

This project fetches, cleans, and serves India's Union Budget data.

## Structure
- `data_fetch/`: Downloads Excel files from official government URLs.
- `data_clean/`: Parses Excel files into Pandas DataFrames.
- `database/`: storage models (SQLAlchemy) and loaders.
- `api/`: FastAPI application.

## Setup
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Run the Pipeline (Fetch -> Clean -> DB)
```bash
python main.py --pipeline
```

### Start the API Server
```bash
python main.py --server
```
Visit `http://localhost:8000/docs` for the interactive API documentation.

## Updating for Future Years
1.  **Update URLs**: Open `config.py` and verify/update the `SOURCES` dictionary with the new year's URLs from [indiabudget.gov.in](https://www.indiabudget.gov.in).
    - Example: Change `budget2024-25` to `budget2025-26`.
2.  **Verify Column Names**: Government Excel formats often change slightly.
    - Check `COLUMN_MAPPINGS` in `config.py`.
    - If structure changes drastically, update parsers in `data_clean/cleaner.py`.

import argparse
import logging
import uvicorn
import sys
import os

# Ensure package is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from budget_pipeline import config
from budget_pipeline.data_fetch import fetcher
from budget_pipeline.data_clean import cleaner
from budget_pipeline.database import models, loader

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("pipeline.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def run_pipeline():
    logger.info("Starting Budget Data Pipeline...")
    
    # 1. Initialize DB
    logger.info("Initializing Database...")
    models.init_db()
    
    # 2. Fetch Data
    logger.info("Fetching Data from Official Sources...")
    # NOTE: In a real scenario, this might fail without internet or valid URLs.
    # In 'dry-run' or 'demo' mode, we might want to skip or warn.
    files = fetcher.fetch_all_data()
    
    if not files:
        logger.warning("No files downloaded. Pipeline cannot proceed with cleanup.")
        return

    # 3. Clean Data
    logger.info("Cleaning and Parsing Data...")
    cleaned_data = cleaner.process_all_files(files)
    
    # 4. Load into DB
    logger.info("Loading Data into Database...")
    loader.load_data_dict(cleaned_data)
    
    logger.info("Pipeline Completed Successfully.")

def run_server(host="127.0.0.1", port=8000):
    logger.info(f"Starting API Server at http://{host}:{port}")
    uvicorn.run("budget_pipeline.api.main:app", host=host, port=port, reload=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="India Union Budget Data Pipeline")
    parser.add_argument("--pipeline", action="store_true", help="Run the data fetch/clean/load pipeline")
    parser.add_argument("--server", action="store_true", help="Start the FastAPI REST server")
    
    args = parser.parse_args()
    
    if args.pipeline:
        run_pipeline()
    elif args.server:
        run_server()
    else:
        # Default behavior: run pipeline then server? Or just print help
        print("Please specify --pipeline to update data or --server to serve API.")
        parser.print_help()

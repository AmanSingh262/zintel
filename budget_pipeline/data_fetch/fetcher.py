import os
import requests
import logging
from .. import config

logger = logging.getLogger(__name__)

def download_file(url: str, filename: str) -> str:
    """
    Downloads a file from the URL and saves it to the configured data directory.
    
    Args:
        url (str): The direct URL of the file.
        filename (str): The name to save the file as.
        
    Returns:
        str: The full path to the downloaded file.
    """
    try:
        response = requests.get(url, verify=False)  # verify=False often needed for gov.in sites due to cert issues
        response.raise_for_status()
        
        file_path = os.path.join(config.DATA_DIR, filename)
        
        with open(file_path, 'wb') as f:
            f.write(response.content)
            
        logger.info(f"Successfully downloaded {filename} from {url}")
        return file_path
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to download {url}: {e}")
        raise e

def fetch_all_data():
    """Download all configured budget files."""
    results = {}
    for key, source in config.SOURCES.items():
        logger.info(f"Fetching {key}...")
        try:
            path = download_file(source["url"], source["filename"])
            results[key] = path
        except Exception as e:
            logger.warning(f"Could not fetch {key}: {e}")
            
    return results

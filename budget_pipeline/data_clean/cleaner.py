import pandas as pd
import os
import logging
from .. import config
import re

logger = logging.getLogger(__name__)

def find_header_row(df, keywords):
    """Scan first few rows to find the one containing keywords."""
    for i in range(min(10, len(df))):
        row_str = df.iloc[i].astype(str).str.lower().tolist()
        # Check if any keyword matches any cell in the row
        if any(k in cell for cell in row_str for k in keywords):
            return i
    return 0

def normalize_money(value):
    """Clean money string and convert to float (Crores)."""
    if pd.isna(value):
        return 0.0
    s = str(value).replace(',', '').strip()
    try:
        return float(s)
    except ValueError:
        return 0.0

def clean_expenditure_data(file_path):
    """Parse Expenditure Budget (Ministry-wise)"""
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return pd.DataFrame()

    logger.info(f"Processing {file_path}...")
    
    # Read first to find header
    df_raw = pd.read_excel(file_path, header=None)
    header_idx = find_header_row(df_raw, ['ministry', 'department', 'description'])
    
    df = pd.read_excel(file_path, header=header_idx)
    
    # Normalize columns
    df.columns = [str(c).strip().lower() for c in df.columns]
    
    # Identify critical columns
    col_ministry = next((c for c in df.columns if any(k in c for k in ['ministry', 'department', 'particulars'])), None)
    
    # Look for 'Budget Estimates 2024-2025' or similar
    # Regex search for current year Budget Estimates
    col_be_2425 = next((c for c in df.columns if '2024-2025' in c and 'budget' in c), None)
    if not col_be_2425:
         # Fallback search for just '2024-2025' or 'Total' if specific
         col_be_2425 = next((c for c in df.columns if '2024-2025' in c), None)
         
    if not col_ministry or not col_be_2425:
        logger.error(f"Could not identify required columns in {file_path}. Found: {df.columns.tolist()}")
        return pd.DataFrame()

    # Filter and Rename
    cleaned = df[[col_ministry, col_be_2425]].copy()
    cleaned.columns = ['ministry_name', 'amount_crore']
    
    # Cleaning
    cleaned = cleaned.dropna(subset=['ministry_name'])
    cleaned['amount_crore'] = cleaned['amount_crore'].apply(normalize_money)
    cleaned['financial_year'] = '2024-25'
    cleaned['source'] = 'Union Budget'
    
    # Remove aggregate rows (often exist at bottom like "Grand Total")
    cleaned = cleaned[~cleaned['ministry_name'].str.contains('Total', case=False, na=False)]
    
    return cleaned

def clean_summary_data(file_path):
    """Parse Budget Summary"""
    if not os.path.exists(file_path):
        return pd.DataFrame()
        
    df = pd.read_excel(file_path)
    # This parser would need specific logic based on the 'Budget at a Glance' structure
    # For now, we'll return a raw dump normalized slightly
    df.columns = [str(c).strip().lower().replace(' ', '_') for c in df.columns]
    df['financial_year'] = '2024-25'
    return df

def clean_receipts_data(file_path):
    """Parse Receipts"""
    if not os.path.exists(file_path):
        return pd.DataFrame()
        
    # Similar generic logic
    df = pd.read_excel(file_path, header=3) # Guessing header row
    df.columns = [str(c).strip().lower().replace(' ', '_') for c in df.columns]
    df['financial_year'] = '2024-25'
    return df

def process_all_files(file_map):
    """
    Process all downloaded files.
    file_map: dict of {key: file_path} from fetcher
    """
    data = {}
    
    if 'expenditure_ministry' in file_map:
        data['expenditure'] = clean_expenditure_data(file_map['expenditure_ministry'])
        
    if 'budget_summary' in file_map:
        data['summary'] = clean_summary_data(file_map['budget_summary'])
        
    if 'receipts' in file_map:
        data['receipts'] = clean_receipts_data(file_map['receipts'])
        
    return data

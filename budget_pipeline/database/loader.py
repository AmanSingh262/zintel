from .models import SessionLocal, Expenditure, Receipt, Summary
import pandas as pd
import logging

logger = logging.getLogger(__name__)

def load_expenditure(df: pd.DataFrame):
    if df.empty:
        return
        
    db = SessionLocal()
    try:
        # Clear specific year data to avoid duplicates on re-run
        year = df['financial_year'].iloc[0]
        db.query(Expenditure).filter(Expenditure.financial_year == year).delete()
        
        objects = []
        for _, row in df.iterrows():
            obj = Expenditure(
                ministry_name=row['ministry_name'],
                amount_crore=row['amount_crore'],
                financial_year=row['financial_year'],
                source=row.get('source', 'Unknown')
            )
            objects.append(obj)
            
        db.add_all(objects)
        db.commit()
        logger.info(f"Loaded {len(objects)} expenditure records.")
    except Exception as e:
        logger.error(f"Error loading expenditure: {e}")
        db.rollback()
    finally:
        db.close()

def load_data_dict(data_dict):
    """Orchestrate loading of all available dataframes."""
    if 'expenditure' in data_dict:
        load_expenditure(data_dict['expenditure'])
    
    # Add loaders for summary/receipts as parsers mature
    logger.info("Data loading complete.")

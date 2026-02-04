from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import models
from typing import List, Optional

app = FastAPI(title="India Union Budget API", version="1.0")

# Dependency
def get_db():
    db = models.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the India Union Budget Data API"}

@app.get("/budget/expenditure/ministry-wise")
def get_ministry_expenditure(year: str = "2024-25", db: Session = Depends(get_db)):
    results = db.query(models.Expenditure).filter(models.Expenditure.financial_year == year).all()
    return {
        "financial_year": year,
        "count": len(results),
        "data": [
            {
                "ministry": r.ministry_name,
                "amount_crore": r.amount_crore,
                "source": r.source
            } for r in results
        ]
    }

@app.get("/budget/summary")
def get_budget_summary(year: str = "2024-25", db: Session = Depends(get_db)):
    # Placeholder implementation until Summary model is populated
    return {"message": "Summary data not yet available for this year."}

@app.get("/budget/receipts")
def get_receipts(year: str = "2024-25", db: Session = Depends(get_db)):
    # Placeholder implementation
    return {"message": "Receipts data not yet available for this year."}

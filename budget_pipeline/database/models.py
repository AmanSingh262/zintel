from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
from .. import config

Base = declarative_base()

class Expenditure(Base):
    __tablename__ = 'expenditure'
    
    id = Column(Integer, primary_key=True)
    ministry_name = Column(String, index=True)
    amount_crore = Column(Float)
    financial_year = Column(String) # e.g., '2024-25'
    source = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow)

class Receipt(Base):
    __tablename__ = 'receipts'
    
    id = Column(Integer, primary_key=True)
    category = Column(String)
    amount_crore = Column(Float) # Budget Estimate
    financial_year = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow)

class Summary(Base):
    __tablename__ = 'summary'
    
    id = Column(Integer, primary_key=True)
    item = Column(String)
    value = Column(Float)
    unit = Column(String, default='Crore')
    financial_year = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow)

# Database Setup
def get_engine():
    # SQLite for default, easily swappable to Postgres
    db_url = f"sqlite:///{config.DB_PATH}"
    return create_engine(db_url, connect_args={"check_same_thread": False})

def init_db():
    engine = get_engine()
    Base.metadata.create_all(engine)
    return engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

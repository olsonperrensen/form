from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()
db_connection_string = os.getenv('DB_CONNECTION_STRING')



if not db_connection_string:
    raise ValueError("DB_CONNECTION_STRING environment variable is not set")
else:
    print("env is set-up! Starting conn to db...")
    # Replace 'sqlite:///./my_database.db' with your actual database URL or configuration.
    engine = create_engine(db_connection_string)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    db = SessionLocal()
    Base = declarative_base()
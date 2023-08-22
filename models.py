from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,Sequence
from sqlalchemy.orm import relationship

from database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    nr = Column(Integer, primary_key=True)
    beg = Column(String(20))
    einde = Column(String(20))
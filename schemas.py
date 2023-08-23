from typing import Union

from pydantic import BaseModel

class InvoiceBase(BaseModel):
    nr: int
    beg: str
    vandaag: str

class InvoiceCreate(InvoiceBase):
    pass

class Invoice(InvoiceBase):
    class Config:
        from_attributes = True
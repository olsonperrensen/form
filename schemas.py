from typing import Union

from pydantic import BaseModel

class InvoiceBase(BaseModel):
    nr: int
    beg: str
    einde: str

class InvoiceCreate(InvoiceBase):
    pass

class Invoice(InvoiceBase):
    class Config:
        orm_mode = True
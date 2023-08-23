from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas


def get_invoices():
    db = SessionLocal()
    try:
        return db.query(models.Invoice).all()
    finally:
        db.close()

def get_invoice_by_nr(nr: int):
    db = SessionLocal()
    try:
        return db.query(models.Invoice).filter(models.Invoice.nr == nr).first()
    finally:
        db.close()

def create_invoice(invoice: schemas.InvoiceCreate):
    db = SessionLocal()
    try:
        db_invoice = models.Invoice(nr=invoice.nr, beg=invoice.beg,vandaag=invoice.vandaag)
        db.add(db_invoice)
        db.commit()
        db.refresh(db_invoice)
        return db_invoice
    finally:
        db.close()
from sqlalchemy.orm import Session

import models, schemas


def get_invoices(db: Session):
    return db.query(models.Invoice).all()

def get_invoice_by_nr(db: Session, nr: int):
    return db.query(models.Invoice).filter(models.Invoice.nr == nr).first()

def create_invoice(db: Session, invoice: schemas.InvoiceCreate):
    db_invoice = models.Invoice(nr=invoice.nr, beg=invoice.beg, einde=invoice.einde)
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice
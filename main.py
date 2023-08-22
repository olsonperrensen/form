from fastapi import FastAPI, HTTPException, UploadFile, File,Request,Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pytesseract import Output
import cv2,fitz,pytesseract,re,time
import crud, models, schemas
from database import SessionLocal, engine
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    # Replace with your frontend URL or '*' to allow all origins
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # You can restrict the methods if needed
    allow_headers=["*"],  # You can restrict the headers if needed
)

def convert_date(date):
    if '/' in date:
        return tuple(map(int, date.split('/')[::-1]))
    elif '-' in date:
        return tuple(map(int, date.split('-')[::-1]))
    elif '.' in date:
        return tuple(map(int, date.split('.')[::-1]))
    else:
        # Assuming d-m-yyyy format
        day, month, year = map(int, re.findall(r'\d+', date))
        if len(str(year)) == 2:  # Convert yy to yyyy
            year += 2000
        return (year, month, day)

@app.post("/")
async def read_root(file: UploadFile = File(...)):
    try:
        FILEPROVIDED = f"./static/{file.filename}"
        temp_file_path = FILEPROVIDED

        # Save the file
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(await file.read())

        file_type = file.filename.split('.')[-1].lower()

        if file_type == 'pdf':
            # If it's a PDF, convert it to an image
            doc = fitz.open(temp_file_path)  # open document
            pix = doc[0].get_pixmap(dpi=264)  # render page to an image
            pix.save(FILEPROVIDED+'.png')  # store image as a PNG
            image_path = FILEPROVIDED+'.png'
        else:
            # If it's an image, use it as is
            image_path = temp_file_path

        rawimg = cv2.imread(image_path)

        d = pytesseract.image_to_data(rawimg, output_type=Output.DICT)

        po_pattern = r'.*450[0-9]{7}.*'
        # dd/mm/yy
        d1 = r'^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/(\d{2})$'
        # d/m/yyyy
        d2 = r'^(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|1[012])/(\d{4})$'
        # dd-mm-yyyy
        d3 = r'^(0[1-9]|1\d|2\d|30|31)-(0[13578]|10|12)-20\d{2}$'
        # dd.mm.yy
        d4 = r'^(?:(0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[012]).([0-9]{2}))$'
        # d-m-yyyy
        d5 = r'^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-20\d{2}$'
        found_dates = list()

        n_boxes = len(d['text'])

        for i in range(n_boxes):
            if re.match(po_pattern, d['text'][i]):
                # FOUND PATTERN
                print(f"found PO with value: {d['text'][i]}")
                (x, y, w, h) = (d['left'][i], d['top']
                                [i], d['width'][i], d['height'][i])
                fximg = cv2.rectangle(
                    rawimg, (x-12, y-12), (x + w+12, y + h+12), (0, 255, 0), 3)
                resized_img = cv2.resize(fximg, (0, 0), fx=0.5, fy=0.5)
                _, img_encoded = cv2.imencode('.jpeg', resized_img)
                img_bytes = img_encoded.tobytes()
                unix_time = int(time.time())
                with open(f"static/{unix_time}ocr.jpeg", "wb") as f:
                    f.write(img_bytes)
            # FACTUURDATUM 
            if re.match(d1, d['text'][i]) or re.match(d2, d['text'][i]) or re.match(d3, d['text'][i]) or re.match(d4, d['text'][i]) or re.match(d5, d['text'][i]):
                if d['text'][i] not in found_dates:
                    # FOUND PATTERN
                    print(f"found DATE with value: {d['text'][i]}")
                    found_dates.append(d['text'][i])
                    (x, y, w, h) = (d['left'][i], d['top']
                                    [i], d['width'][i], d['height'][i])
                    fximg = cv2.rectangle(
                        rawimg, (x-12, y-12), (x + w+12, y + h+12), (0, 255, 0), 3)
                    resized_img = cv2.resize(fximg, (0, 0), fx=0.5, fy=0.5)
                    _, img_encoded = cv2.imencode('.jpeg', resized_img)
                    img_bytes = img_encoded.tobytes()
            
                # await histogram_to_db([item for item in d['text'] if len(item) >= 3])
        # TODO give found dates and numbers text back
        # sorted_dates = sorted(found_dates, key=convert_date)
        return FileResponse(f"static/{unix_time}ocr.jpeg", media_type="image/jpeg")

    except Exception as e:
        return {"error": str(e)}


@app.get("/iocr", response_model=list[schemas.Invoice])
def read_iocr(db: Session = Depends(get_db)):
    invoices = crud.get_invoices(db)
    return invoices


@app.post("/iocr", response_model=schemas.Invoice)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = crud.get_invoice_by_nr(db, nr=invoice.nr)
    if db_invoice:
        raise HTTPException(status_code=400, detail="Invoice already registered")
    return crud.create_invoice(db=db, invoice=invoice)

@app.get("/ip")
async def get_client_ip(request: Request):
    return {"UA": request.headers['user-agent']}
    # TODO record from where req are being accessed.  

@app.get("/")
async def pingMe():
    return {"status": 200}

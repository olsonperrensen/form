from fastapi import FastAPI, HTTPException, UploadFile, File,Request,Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pytesseract import Output
import cv2,fitz,pytesseract,re,time
import crud, models, schemas
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from datetime import datetime

today = datetime.today().strftime('%d/%m/%Y')

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

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
    if isinstance(date, str):  # Check if date is a string
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
    else:  # If not a string (single value), assume it's already in the correct format and return as is
        return (date,)  

def add_days_to_date(date_string: str, days: str) -> str:
    # Define input date formats
    input_formats = ["%d/%m/%y", "%d/%m/%Y", "%d-%m-%Y", "%d.%m.%y", "%d-%m-%Y"]
    
    # Try parsing the input date with different formats
    for format_str in input_formats:
        try:
            dt = datetime.strptime(date_string, format_str)
            break  # Stop if successful parsing
        except ValueError:
            pass
    
    else:
        raise ValueError("Invalid date format")
    
    # Convert days to integer and calculate new date
    delta = timedelta(days=int(days))
    new_date = dt + delta
    
    return new_date.strftime("%d/%m/%Y")  # Format output as dd/mm/yyyy

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
        fnr_pat = r'\b\d{4,}(?:/\d+)?\b(?:,\s*\d{4,}(?:/\d+)?\b)*'
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
        found_factuurnr = 0

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
            # FACTUURNR
            if re.match(r'Factuur', d['text'][i]) or re.match(r'FACTUUR', d['text'][i]) or re.match(r'Factuurnummer', d['text'][i]) or re.match(r'FACTUURNUMMER', d['text'][i]) or re.match(r'Facture', d['text'][i] ) or re.match(r'Nr.', d['text'][i] ) or re.match(r'FACTURE', d['text'][i]):
                # FOUND PATTERN
                print(f"found FACTUUR-NR: {d['text'][i]}")

                # Looking BACK two places to find FactureNR
                if i >= 2:
                    if re.match(fnr_pat, d['text'][i-1]):
                        print(f"Looking BACK -1 place... {d['text'][i-1]} as res")
                        found_factuurnr = d['text'][i-1]
                        (x, y, w, h) = (d['left'][i-1], d['top']
                        [i-1], d['width'][i-1], d['height'][i-1])
                        fximg = cv2.rectangle(
                        rawimg, (x-12, y-12), (x + w+12, y + h+12), (0, 255, 0), 3)
                        resized_img = cv2.resize(fximg, (0, 0), fx=0.5, fy=0.5)
                        _, img_encoded = cv2.imencode('.jpeg', resized_img)
                        img_bytes = img_encoded.tobytes()
                    elif re.match(fnr_pat, d['text'][i-2]):
                        print(f"Looking BACK -2 places... {d['text'][i-2]} as res")
                        found_factuurnr = d['text'][i-2]
                        (x, y, w, h) = (d['left'][i-2], d['top']
                        [i-2], d['width'][i-2], d['height'][i-2])
                        fximg = cv2.rectangle(
                        rawimg, (x-12, y-12), (x + w+12, y + h+12), (0, 255, 0), 3)
                        resized_img = cv2.resize(fximg, (0, 0), fx=0.5, fy=0.5)
                        _, img_encoded = cv2.imencode('.jpeg', resized_img)
                        img_bytes = img_encoded.tobytes()
                # Looking FW two places to find FactureNR
                elif i < len(n_boxes) - 2:
                    if re.match(fnr_pat, d['text'][i+1]):
                        print(f"Looking FW 1 place... {d['text'][i+1]} as res")
                        found_factuurnr = d['text'][i+1]
                        (x, y, w, h) = (d['left'][i+1], d['top']
                        [i+1], d['width'][i+1], d['height'][i+1])
                        fximg = cv2.rectangle(
                        rawimg, (x-12, y-12), (x + w+12, y + h+12), (0, 255, 0), 3)
                        resized_img = cv2.resize(fximg, (0, 0), fx=0.5, fy=0.5)
                        _, img_encoded = cv2.imencode('.jpeg', resized_img)
                        img_bytes = img_encoded.tobytes()
                    elif re.match(fnr_pat, d['text'][i+2]):
                        print(f"Looking FW 2 places... {d['text'][i+2]} as res")
                        found_factuurnr = d['text'][i+2]
                        (x, y, w, h) = (d['left'][i+2], d['top']
                        [i+2], d['width'][i+2], d['height'][i+2])
                        fximg = cv2.rectangle(
                        rawimg, (x-12, y-12), (x + w+12, y + h+12), (0, 255, 0), 3)
                        resized_img = cv2.resize(fximg, (0, 0), fx=0.5, fy=0.5)
                        _, img_encoded = cv2.imencode('.jpeg', resized_img)
                        img_bytes = img_encoded.tobytes()
            # FACTUURDATUM (classic formats)
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
            # FACTUURDATUM (verklaring)
            elif re.match('dagen', d['text'][i]):
                # FOUND PATTERN
                print(f"found VERKLARING with value: {d['text'][i-1]}")
                days_to_add = d['text'][i-1]
                new_date_output = add_days_to_date(found_dates[0], days_to_add)
                found_dates.append(new_date_output)
                (x, y, w, h) = (d['left'][i-1], d['top']
                                [i-1], d['width'][i-1], d['height'][i-1])
                fximg = cv2.rectangle(
                    rawimg, (x-12, y-12), (x + w+12, y + h+12), (0, 255, 0), 3)
                resized_img = cv2.resize(fximg, (0, 0), fx=0.5, fy=0.5)
                _, img_encoded = cv2.imencode('.jpeg', resized_img)
                img_bytes = img_encoded.tobytes()
        
        sorted_dates = sorted(found_dates, key=convert_date)
        if len(sorted_dates)>1:
            created_invoice = create_invoice(invoice=models.Invoice(**{
        "nr": unix_time,
        "beg": sorted_dates[0],
        "einde": sorted_dates[1],
        "vandaag":today
        }))
        elif len(sorted_dates)==1:
            created_invoice = create_invoice(invoice=models.Invoice(**{
        "nr": unix_time,
        "beg": sorted_dates[0],
        "einde": add_days_to_date(sorted_dates[0], 30),
        "vandaag":today
        }))
        
        return FileResponse(f"static/{unix_time}ocr.jpeg", media_type="image/jpeg")

    except Exception as e:
        return {"error": str(e)}


@app.get("/iocr", response_model=list[schemas.Invoice])
def read_iocr():
    invoices = crud.get_invoices()
    return invoices


@app.post("/iocr", response_model=schemas.Invoice)
def create_invoice(invoice: schemas.InvoiceCreate):
    db_invoice = crud.get_invoice_by_nr(nr=invoice.nr)
    if db_invoice:
        raise HTTPException(status_code=400, detail="Invoice already registered")
    return crud.create_invoice(invoice=invoice)

@app.get("/ip")
async def get_client_ip(request: Request):
    return {"UA": request.headers['user-agent']}
    # TODO record from where req are being accessed.  

@app.get("/")
async def pingMe():
    return {"status": 200}

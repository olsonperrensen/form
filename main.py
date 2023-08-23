from fastapi import FastAPI, HTTPException, UploadFile, File,Request,Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pytesseract import Output
import cv2,fitz,pytesseract,re,time,numpy as np
import crud, models, schemas,requests
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from datetime import datetime

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

ascii_pattern = re.compile(r'\A[\x00-\x7F]+\Z')

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
    print(f"conveting date... {date}")
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

def enhance_ocr(image_path):
    # Load the image using OpenCV
    img = cv2.imread(image_path)
 
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
 
    # Denoising
    denoised = cv2.fastNlMeansDenoising(gray, None, h=30)
 
    # Bilateral filtering
    bilateral = cv2.bilateralFilter(denoised, 9, 75, 75)
 
    # Global thresholding
    # _, global_thresh = cv2.threshold(bilateral, 128, 255, cv2.THRESH_BINARY)
 
    # Adaptive thresholding
    # adaptive_thresh = cv2.adaptiveThreshold(bilateral, 255, 
                                            # cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                            # cv2.THRESH_BINARY, 11, 2)
 
    # Combine global and adaptive thresholding
    # combined_thresh = cv2.bitwise_and(global_thresh, adaptive_thresh)
 
    # Scaling
    # scaled = cv2.resize(combined_thresh, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)
 
    # Perform OCR on the preprocessed image
    data = pytesseract.image_to_data(bilateral, output_type=pytesseract.Output.DICT)
 
    return data

@app.post("/t")
async def text(file:UploadFile=File(...)):
    try:
        FILEPROVIDED = f"./static/{file.filename}"
        # REJECT UNICODE
        if not ascii_pattern.match(FILEPROVIDED):
            raise ValueError("Filename contains non-ASCII characters.")
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

        d = enhance_ocr(image_path)
        return d['text']
    except Exception as e:
     return {"error": str(e)}

@app.post("/f")
async def factuurnr(file:UploadFile=File(...)):
    try:
        FILEPROVIDED = f"./static/{file.filename}"
        # REJECT UNICODE
        if not ascii_pattern.match(FILEPROVIDED):
            raise ValueError("Filename contains non-ASCII characters.")
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

        # Leave this just for legacy code to work...
        rawimg = cv2.imread(image_path)

        d = enhance_ocr(image_path)
        # dd/mm/yy(yy)
        d1 = r'^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(\d{2}|20\d{2})$'
        # d/m/yyyy
        d2 = r'^(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|1[012])/(\d{2}|20\d{2})$'
        # dd-mm-yy(yy)
        d3 = r'^(0[1-9]|1\d|2\d|30|31)-(0[1234567890]|10|11|12)-((?:20)?\d{2})$'
        # dd.mm.yy
        d4 = r"^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.([0-9]{2})$"
        # d-m-yyyy
        d5 = r'^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-20\d{2}$'
        found_dates = list()
        found_nr = "manually control in .PDF"

        # Direct matches
        MULTIPLES = r"VF\d{2}-\d{6}|VF[A-Z]?\d{8}|VF\d{4}-\d{4}"
        CRESPIN = r"FV\d{9}"
        DE_KINDER = r"SI\d{8}|S1\d{8}|\$I\d{8}|\$1\d{8}"
        BE_PRO_TOOLS = r"DBS-\d{9}"
        DE_DONCKER = r"VVF\d{2}/\d{6}"
        NIJHOF = r"N\d{7}"
        # Indirect matches
        LECOT = r"V2$"
        GENERIC = r"(?i)factuur(?:nummer|nr)?|facture$|DEBETNOTA$|.*n°.*|nr\.$"
        OUTLIERS = r".*:$"

        n_boxes = len(d['text'])

        for i in range(n_boxes):
            # FACTUURDATUM (classic formats)
            if re.match(d1, d['text'][i]) or re.match(d2, d['text'][i]) or re.match(d3, d['text'][i]) or re.match(d4, d['text'][i]) or re.match(d5, d['text'][i]):
                if d['text'][i] not in found_dates:
                    # FOUND DATE
                    print(f"found DATE with value: {d['text'][i]}")
                    found_dates.append(d['text'][i])
                    (x, y, w, h) = (d['left'][i], d['top']
                                    [i], d['width'][i], d['height'][i])
                    fximg = cv2.rectangle(
                        rawimg, (x-12, y-12), (x + w+12, y + h+12), (0, 255, 0), 3)
                    resized_img = cv2.resize(fximg, (0, 0), fx=0.5, fy=0.5)
                    _, img_encoded = cv2.imencode('.jpeg', resized_img)
                    img_bytes = img_encoded.tobytes()
                    unix_time = int(time.time())
            if re.match(MULTIPLES, d['text'][i]) or re.match(CRESPIN, d['text'][i]) or re.match(DE_KINDER, d['text'][i]) or re.match(BE_PRO_TOOLS, d['text'][i]) or re.match(DE_DONCKER, d['text'][i]) or re.match(NIJHOF, d['text'][i]):
                # FOUND DIRECT
                print(f"found direct NR with value: {d['text'][i]}")
                found_nr = d['text'][i]
                (x, y, w, h) = (d['left'][i], d['top']
                                [i], d['width'][i], d['height'][i])
                fximg = cv2.rectangle(
                    rawimg, (x-12, y-12), (x + w+12, y + h+12), (0, 255, 0), 3)
                resized_img = cv2.resize(fximg, (0, 0), fx=0.5, fy=0.5)
                _, img_encoded = cv2.imencode('.jpeg', resized_img)
                img_bytes = img_encoded.tobytes()
            elif (re.match(LECOT, d['text'][i]) or re.match(GENERIC,d['text'][i])) and re.match(r"\d{5,}",d['text'][i+1]):
                # FOUND indirect
                print(f"found indirect NR with value: {d['text'][i+1]}")
                found_nr = d['text'][i+1]
                (x, y, w, h) = (d['left'][i+1], d['top']
                                [i+1], d['width'][i+1], d['height'][i+1])
                fximg = cv2.rectangle(
                    rawimg, (x-12, y-12), (x + w+12, y + h+12), (0, 255, 0), 3)
                resized_img = cv2.resize(fximg, (0, 0), fx=0.5, fy=0.5)
                _, img_encoded = cv2.imencode('.jpeg', resized_img)
                img_bytes = img_encoded.tobytes()
            elif re.match(OUTLIERS, d['text'][i]) and re.match(r"^Nr$",d['text'][i-1]) and re.match(r"\d{5,}",d['text'][i+1]):
                # FOUND outliers
                print(f"found outlier NR with value: {d['text'][i+1]}")
                found_nr = d['text'][i+1]
                (x, y, w, h) = (d['left'][i+1], d['top']
                                [i+1], d['width'][i+1], d['height'][i+1])
                fximg = cv2.rectangle(
                    rawimg, (x-12, y-12), (x + w+12, y + h+12), (0, 255, 0), 3)
                resized_img = cv2.resize(fximg, (0, 0), fx=0.5, fy=0.5)
                _, img_encoded = cv2.imencode('.jpeg', resized_img)
                img_bytes = img_encoded.tobytes()
                    
        
        with open(f"static/{unix_time}ocr.jpeg", "wb") as f:
            f.write(img_bytes)
        
        sorted_dates = sorted(found_dates, key=convert_date)
        
        if len(sorted_dates)>0:
            return {"datum":sorted_dates[0],"nr":found_nr}
            # return create_invoice(invoice=models.Invoice(**{"nr": unix_time,"beg": sorted_dates[0],
            #     "vandaag":datetime.today().strftime('%d/%m/%Y')
            #     }))

    except Exception as e:
     return {"error": str(e)}

@app.post("/")
async def root(file: UploadFile = File(...)):
    try:
        FILEPROVIDED = f"./static/{file.filename}"
        # REJECT UNICODE
        if not ascii_pattern.match(FILEPROVIDED):
            raise ValueError("Filename contains non-ASCII characters.")
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

        return FileResponse(f"static/{unix_time}ocr.jpeg", media_type="image/jpeg")

    except Exception as e:
        return {"error": str(e)}


@app.get("/a", response_model=list[schemas.Invoice])
def alles():
    invoices = crud.get_invoices()
    return invoices

def create_invoice(invoice: schemas.InvoiceCreate):
    db_invoice = crud.get_invoice_by_nr(nr=invoice.nr)
    if db_invoice:
        raise HTTPException(status_code=400, detail="Invoice already registered")
    return crud.create_invoice(invoice=invoice)

@app.get("/ip")
async def surveil():
    try:
        response = requests.get('http://ip-api.com/json')
        data = response.json()
        return data['query']
    except Exception as e:
        print(e)
 

@app.get("/")
async def pingMe():
    return {"status": 200}

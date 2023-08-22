from fastapi import FastAPI, UploadFile, File,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pytesseract import Output
import cv2,fitz,pytesseract,re,time,os
from dotenv import load_dotenv
from sqlalchemy import create_engine, create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

load_dotenv()
db_connection_string = os.getenv('DB_CONNECTION_STRING')

if not db_connection_string:
    raise ValueError("DB_CONNECTION_STRING environment variable is not set")
else:
    print("env is set-up! Starting conn to db...")

engine = create_engine(db_connection_string)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class WordCounter(Base):
    __tablename__ = 'histogram'
    id = Column(Integer, primary_key=True, unique=True, index=True)
    word = Column(String)
    counter = Column(Integer, default=1)


Base.metadata.create_all(bind=engine)

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
        
@app.post("/db")
async def histogram_to_db(words:list):
    db = SessionLocal()
    ft_w,pp_w = 0,0
    for word in words:
        record = db.query(WordCounter).filter(
            WordCounter.word == word).first()
        if record:
            # If the word exists, increment the counter
            record.counter += 1
            pp_w+=1
        else:
            # If the word doesn't exist, create a new record
            new_record = WordCounter(word=word)
            db.add(new_record)
            ft_w+=1
    db.commit()
    db.flush()
    db.close()
    print(f"{pp_w} words ++, {ft_w} first-timed in db.")

@app.get("/ip")
async def get_client_ip(request: Request):
    return {"UA": request.headers['user-agent']}
    # TODO record from where req are being accessed.  

@app.get("/")
async def pingMe():
    return {"status": 200}

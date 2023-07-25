from fastapi import FastAPI, UploadFile, File,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
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


@app.post("/")
async def read_root(file: UploadFile = File(...)):
    try:
        FILEPROVIDED = f"./static/{file.filename}"
        temp_pdf_path = FILEPROVIDED
        with open(temp_pdf_path, "wb") as temp_pdf_file:
            temp_pdf_file.write(await file.read())
        doc = fitz.open(temp_pdf_path)  # open document
        pix = doc[0].get_pixmap(dpi=250)  # render page to an image
        pix.save(FILEPROVIDED+'.png')  # store image as a PNG
        fximg = None
        image_path = FILEPROVIDED+'.png'  # Replace with the path to your image file
        rawimg = cv2.imread(image_path)

        d = pytesseract.image_to_data(rawimg, output_type=Output.DICT)

        date_pattern = r'.*450[0-9]{7}.*'

        n_boxes = len(d['text'])
        for i in range(n_boxes):
            if re.match(date_pattern, d['text'][i]):
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
                await histogram_to_db([item for item in d['text'] if len(item) >= 3])
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

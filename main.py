from typing import Annotated
from fastapi import FastAPI, UploadFile, File, Response, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pytesseract import Output
import cv2
import fitz
import pytesseract
import re
import numpy as np
from pydantic import BaseModel
import time

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

        date_pattern = r'^450[0-9]{7}$'

        n_boxes = len(d['text'])
        for i in range(n_boxes):
            if int(d['conf'][i]) > 60:
                if re.match(date_pattern, d['text'][i]):
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


@app.get("/")
async def pingMe():
    return {"status": 200}

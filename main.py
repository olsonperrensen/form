from typing import Annotated
from fastapi import FastAPI, UploadFile, File, Response,Form
from fastapi.middleware.cors import CORSMiddleware
from pytesseract import Output
import cv2
import pytesseract
import re
import numpy as np
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your desired list of allowed origins
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # The HTTP methods allowed for CORS requests
    allow_headers=["*"],  # The headers allowed for CORS requests
    allow_credentials=True,  # Whether to allow sending credentials (cookies, etc.) in CORS requests
    expose_headers=[],  # The headers exposed in the response to CORS requests
)


@app.post("/")
async def read_root(u_ID: Annotated[str, Form()], u_ref: Annotated[str, Form()],file:UploadFile = Form(...)):
    try:
        fximg = None
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        rawimg = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        d = pytesseract.image_to_data(rawimg, output_type=Output.DICT)

        date_pattern = r'^450[0-9]{7}$'

        n_boxes = len(d['text'])
        for i in range(n_boxes):
            if int(d['conf'][i]) > 60:
                if re.match(date_pattern, d['text'][i]):
                    (x, y, w, h) = (d['left'][i], d['top']
                                    [i], d['width'][i], d['height'][i])
                    fximg = cv2.rectangle(
                        rawimg, (x-7, y-7), (x + w+7, y + h+7), (0, 255, 0), 2)

        _, img_encoded = cv2.imencode('.png', fximg)
        img_bytes = img_encoded.tobytes()

        return Response(content=img_bytes, media_type="image/png")

    except Exception as e:
        return {"error": str(e)}


@app.get("/")
async def pingMe():
    return {"status": 200}

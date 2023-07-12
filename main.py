from fastapi import FastAPI, UploadFile, File,Response
from pytesseract import Output
import cv2,pytesseract, re, numpy as np

app = FastAPI()

@app.post("/")
async def read_root(file: UploadFile = File(...)):
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
                    (x, y, w, h) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
                    fximg = cv2.rectangle(rawimg, (x-7, y-7), (x + w+7, y + h+7), (0, 255, 0), 2)

        _, img_encoded = cv2.imencode('.png', fximg)
        img_bytes = img_encoded.tobytes()

        return Response(content=img_bytes, media_type="image/png")

    except Exception as e:
        return {"error": str(e)}

from fastapi import FastAPI, UploadFile, File
import cv2,pytesseract, numpy as np
# Needs OCR to be installed on Linux as well
app = FastAPI()

@app.post("/")
async def read_root(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)


    # Preprocess the image
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

    # Perform OCR using Tesseract
    text = pytesseract.image_to_string(gray).split()

    # Print or use the extracted text as needed
    my_set = set(text)
    substring = "450"
    matching_elements = [element for element in my_set if substring in element]
    if len(matching_elements) > 0:
        return {"result": matching_elements}

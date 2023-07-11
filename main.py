from fastapi import FastAPI, UploadFile, File
import easyocr
# 20

app = FastAPI()
reader = easyocr.Reader(['nl', 'fr', 'en'])


@app.post("/")
async def read_root(file: UploadFile = File(...)):
    contents = await file.read()
    res = reader.readtext(contents, detail=0, paragraph=True)
    my_set = set(res)
    substring = "450"
    matching_elements = [element for element in my_set if substring in element]
    if len(matching_elements) > 0:
        return {"result": matching_elements}

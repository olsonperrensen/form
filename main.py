import cv2
import pytesseract

# Load the image using OpenCV
image = cv2.imread('sample.png')

# Preprocess the image
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

# Perform OCR using Tesseract
text = pytesseract.image_to_string(gray)

# Print or use the extracted text as needed
print(text)

import pdfplumber
import io

async def extract_text(file) -> str:
    contents = await file.read()
    with pdfplumber.open(io.BytesIO(contents)) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text
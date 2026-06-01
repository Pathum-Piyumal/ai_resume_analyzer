import pdfplumber
import io

async def extract_text(file) -> str:

    contents = await file.read()

    pdf_file = io.BytesIO(contents)
    
    extracted_text = ""
    
    with pdfplumber.open(pdf_file) as pdf:
        for page_number, page in enumerate(pdf.pages):
            page_text = page.extract_text()
            if page_text:
                extracted_text += page_text + "\n"
    
    return extracted_text.strip()
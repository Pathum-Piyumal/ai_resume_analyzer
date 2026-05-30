# test_pdf.py  — DELETE after testing
import asyncio
import pdfplumber
import io

async def test_extraction():
    # Simulate what happens when a real PDF is uploaded
    # Use any PDF you have on your computer for testing
    
    with open("test_resume.pdf", "rb") as f:   # put any PDF in backend/
        contents = f.read()
    
    pdf_file = io.BytesIO(contents)
    text = ""
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    
    print("=== EXTRACTED TEXT (first 500 chars) ===")
    print(text[:500])
    print(f"\n=== TOTAL LENGTH: {len(text)} characters ===")

asyncio.run(test_extraction())
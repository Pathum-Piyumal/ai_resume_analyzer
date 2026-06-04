import pdfplumber
import io

async def extract_text(file) -> str:
    contents = await file.read()
    pdf_file = io.BytesIO(contents)
    extracted_text = ""
    
    # Try pdfplumber first
    try:
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text += page_text + "\n"
    except Exception as e:
        print(f"pdfplumber failed to extract text: {e}. Trying PyMuPDF fallback...")
        
    # Fallback to PyMuPDF (fitz) if pdfplumber failed or extracted no characters
    if not extracted_text.strip():
        try:
            import fitz
            doc = fitz.open(stream=contents, filetype="pdf")
            for page in doc:
                page_text = page.get_text()
                if page_text:
                    extracted_text += page_text + "\n"
            doc.close()
        except Exception as e:
            print(f"PyMuPDF fallback failed: {e}")
            
    return extracted_text.strip()
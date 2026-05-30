import pdfplumber
import io

async def extract_text(file) -> str:
    """
    Takes an uploaded file object from FastAPI.
    Returns all the text found in the PDF as a single string.
    
    Why 'async'? Because file reading is an I/O operation.
    Using async means other requests aren't blocked while we read.
    """
    
    # Read the raw bytes from the uploaded file
    # file.read() gives us bytes like: b'%PDF-1.4 ...'
    contents = await file.read()
    
    # pdfplumber needs a file-like object, not raw bytes.
    # io.BytesIO wraps the bytes so pdfplumber can seek through it
    # like it would a real file on disk.
    pdf_file = io.BytesIO(contents)
    
    extracted_text = ""
    
    with pdfplumber.open(pdf_file) as pdf:
        # A PDF can have multiple pages, so we loop through all of them
        for page_number, page in enumerate(pdf.pages):
            page_text = page.extract_text()
            
            # extract_text() returns None if a page has no text (e.g., image page)
            # 'or ""' prevents None from being added to our string
            if page_text:
                extracted_text += page_text + "\n"
    
    return extracted_text.strip()  # Remove leading/trailing whitespace
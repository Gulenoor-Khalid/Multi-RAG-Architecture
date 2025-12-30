import os
import aiofiles
from pathlib import Path
from typing import List
from fastapi import UploadFile
from langchain_core.documents import Document
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader
)

class DocumentProcessor:
    """Xử lý upload và process documents"""
    
    def __init__(self):
        # Use relative path from backend directory
        self.upload_dir = Path(os.getenv("UPLOAD_DIR", "./uploads"))
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        print(f"📁 Upload directory: {self.upload_dir.absolute()}")
        
        self.supported_extensions = {
            '.pdf': PyPDFLoader,
            '.txt': TextLoader,
            '.docx': Docx2txtLoader,
        }
    
    async def save_upload(self, file: UploadFile) -> Path:
        """Lưu uploaded file"""
        file_path = self.upload_dir / file.filename
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        print(f"💾 Saved file: {file_path}")
        return file_path
    
    async def process_document(self, file_path: Path) -> List[Document]:
        """Process document thành chunks"""
        extension = file_path.suffix.lower()
        
        if extension not in self.supported_extensions:
            raise ValueError(f"Unsupported file type: {extension}")
        
        # Load document
        loader_class = self.supported_extensions[extension]
        loader = loader_class(str(file_path))
        documents = loader.load()
        
        # Add metadata
        for doc in documents:
            doc.metadata['source'] = file_path.name
        
        print(f"📄 Processed {len(documents)} pages from {file_path.name}")
        return documents

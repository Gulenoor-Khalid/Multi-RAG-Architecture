import os
# Disable ChromaDB telemetry ASAP
os.environ["ANONYMIZED_TELEMETRY"] = "False"

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import json
from pathlib import Path

from .models.llm_manager import LLMManager
from .models.rag_engine import RAGEngine
from .utils.document_processor import DocumentProcessor

app = FastAPI(
    title="RAG Multi-LLM API",
    description="RAG system với nhiều model LLM quantized",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize managers
llm_manager = LLMManager()
rag_engine = RAGEngine()
doc_processor = DocumentProcessor()

class QueryRequest(BaseModel):
    query: str
    model_name: Optional[str] = None
    use_rag: bool = True
    max_tokens: int = 512
    temperature: float = 0.7

class QueryResponse(BaseModel):
    answer: str
    model_used: str
    sources: Optional[List[str]] = None

@app.on_event("startup")
async def startup_event():
    """Khởi tạo model khi start app"""
    print("🚀 Starting RAG Multi-LLM API...")
    # Auto-load default model (có thể mất 1-2 phút)
    # Nếu muốn start nhanh hơn, comment dòng dưới và load model qua UI
    await llm_manager.load_default_model()
    print("✅ Model loaded successfully!")

@app.get("/")
async def root():
    return {
        "message": "RAG Multi-LLM API",
        "status": "running",
        "available_endpoints": ["/query", "/upload", "/models", "/health"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": llm_manager.is_model_loaded(),
        "documents_count": rag_engine.get_document_count()
    }

@app.get("/models")
async def list_models():
    """Liệt kê các model có sẵn"""
    return {
        "current_model": llm_manager.current_model_name,
        "available_models": llm_manager.available_models,
        "use_quantization": llm_manager.use_quantization,
        "system_prompt": llm_manager.system_prompt
    }

@app.get("/system-prompt")
async def get_system_prompt():
    """Lấy system prompt hiện tại"""
    return {
        "system_prompt": llm_manager.system_prompt
    }

@app.post("/system-prompt")
async def update_system_prompt(prompt: str = Form(...)):
    """Cập nhật system prompt"""
    try:
        llm_manager.system_prompt = prompt
        return {
            "message": "System prompt updated successfully",
            "new_prompt": prompt
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/models/load")
async def load_model(model_name: str):
    """Load một model khác"""
    try:
        await llm_manager.load_model(model_name)
        return {"message": f"Model {model_name} loaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload document để thêm vào vector database"""
    try:
        print(f"📥 Receiving file: {file.filename}")
        
        # Lưu file
        file_path = await doc_processor.save_upload(file)
        print(f"💾 File saved: {file_path}")
        
        # Process document
        documents = await doc_processor.process_document(file_path)
        print(f"📄 Processed {len(documents)} documents")
        
        # Add to vector DB
        rag_engine.add_documents(documents)
        print(f"✅ Added to vector DB")
        
        return {
            "message": "Document uploaded and processed successfully",
            "filename": file.filename,
            "chunks_created": len(documents)
        }
    except Exception as e:
        print(f"❌ Error uploading document: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """Query với RAG"""
    try:
        # Kiểm tra model đã load chưa
        if not llm_manager.is_model_loaded():
            raise HTTPException(
                status_code=400, 
                detail="Model not loaded. Please load a model first via 'Load Model' button."
            )
        
        # Lấy relevant documents nếu dùng RAG
        sources = []
        context = ""
        
        if request.use_rag:
            relevant_docs = rag_engine.search(request.query, k=3)
            context = "\n\n".join([doc.page_content for doc in relevant_docs])
            sources = [doc.metadata.get("source", "unknown") for doc in relevant_docs]
        
        # Generate answer
        answer = await llm_manager.generate(
            query=request.query,
            context=context,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )
        
        return QueryResponse(
            answer=answer,
            model_used=llm_manager.current_model_name,
            sources=sources if request.use_rag else None
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error in query: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query/stream")
async def query_stream(request: QueryRequest):
    """Query với streaming response"""
    try:
        # Kiểm tra model đã load chưa
        if not llm_manager.is_model_loaded():
            raise HTTPException(
                status_code=400, 
                detail="Model not loaded. Please load a model first via 'Load Model' button."
            )
        
        sources = []
        context = ""
        
        if request.use_rag:
            relevant_docs = rag_engine.search(request.query, k=3)
            context = "\n\n".join([doc.page_content for doc in relevant_docs])
            sources = [doc.metadata.get("source", "unknown") for doc in relevant_docs]
        
        async def generate_stream():
            async for chunk in llm_manager.generate_stream(
                query=request.query,
                context=context,
                max_tokens=request.max_tokens,
                temperature=request.temperature
            ):
                yield f"data: {json.dumps({'text': chunk})}\n\n"
            
            # Send sources at the end
            if sources:
                yield f"data: {json.dumps({'sources': sources})}\n\n"
            
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents")
async def clear_documents():
    """Xóa tất cả documents khỏi vector DB"""
    try:
        rag_engine.clear()
        return {"message": "All documents cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

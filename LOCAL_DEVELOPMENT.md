# 🧪 Local Development Guide

## Cách test local (không dùng Docker)

### Bước 1: Cài đặt Dependencies

1. **Mở Terminal/CMD trong thư mục dự án**

2. **Tạo virtual environment** (khuyến nghị):
```bash
python -m venv venv
```

3. **Activate virtual environment**:

Windows:
```bash
venv\Scripts\activate
```

Linux/Mac:
```bash
source venv/bin/activate
```

4. **Cài đặt packages**:
```bash
pip install -r requirements.txt
```

⚠️ **Note**: Lần đầu cài có thể mất 5-10 phút vì phải download PyTorch, Transformers, v.v.

### Bước 2: Cấu hình môi trường

1. **Tạo file .env**:
```bash
copy .env.example .env
```

2. **Tạo thư mục cần thiết**:
```bash
mkdir uploads
mkdir vector_db
```

### Bước 3: Chạy Backend

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Hoặc dùng script có sẵn:
```bash
start-local.bat
```

Backend sẽ chạy tại:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

### Bước 4: Chạy Frontend

**Terminal 2 - Frontend:**

Có 2 cách:

**Cách 1: Simple HTTP Server**
```bash
cd frontend
python -m http.server 3000
```
Mở trình duyệt: http://localhost:3000

**Cách 2: Dùng script**
```bash
start-frontend.bat
```

**Cách 3: Mở trực tiếp file HTML**
```bash
# Mở file frontend/index.html trong browser
# Nhưng cần update API URL trong script.js
```

### Bước 5: Test thử

1. Mở browser tại http://localhost:3000 (frontend)
2. Kiểm tra http://localhost:8000/health (backend)
3. Thử upload một file PDF/TXT
4. Thử chat với model

## 🔧 Troubleshooting

### Lỗi: Module not found

```bash
pip install -r requirements.txt
```

### Lỗi: CUDA not available

- Model sẽ chạy trên CPU (chậm hơn)
- Để dùng GPU: Cài CUDA toolkit và PyTorch với CUDA

### Lỗi: Out of Memory

Trong `.env`, sử dụng model nhỏ hơn:
```env
MODEL_NAME=TinyLlama/TinyLlama-1.1B-Chat-v1.0
LOAD_IN_8BIT=true
```

### Backend chậm khi start

- Lần đầu tiên model sẽ được download (1-5GB)
- Models được cache tại `~/.cache/huggingface/`

### Frontend không kết nối được Backend

Kiểm tra trong `frontend/script.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

## 📝 Quick Commands

### Start Backend (Windows)
```bash
venv\Scripts\activate
cd backend
uvicorn app.main:app --reload
```

### Start Frontend (Windows)
```bash
cd frontend
python -m http.server 3000
```

### Test API với curl
```bash
# Health check
curl http://localhost:8000/health

# List models
curl http://localhost:8000/models

# Query
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Hello\", \"use_rag\": false}"
```

## 🎯 Development Tips

1. **Auto-reload**: Backend có `--reload` sẽ tự động restart khi code thay đổi

2. **Debug mode**: Thêm vào backend/app/main.py:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

3. **Test API**: Dùng http://localhost:8000/docs (Swagger UI)

4. **Monitor logs**: Xem terminal để theo dõi requests

## ⚡ Fast Start (All-in-one)

**Windows:**
```bash
start-local.bat
# Trong terminal mới:
start-frontend.bat
```

Xong! Truy cập http://localhost:3000

# 🖼️ Hướng dẫn sử dụng BLIP với RAG

## Tổng quan
Hệ thống RAG đã được tích hợp BLIP (Bootstrapping Language-Image Pre-training) để hỗ trợ chat với cả **text và image**.

## Tính năng mới

### 1. **Visual Question Answering (VQA)**
- Đặt câu hỏi về nội dung hình ảnh
- BLIP sẽ phân tích và trả lời câu hỏi dựa trên hình ảnh

### 2. **Image Captioning**
- Tự động tạo mô tả cho hình ảnh
- Có thể thêm điều kiện (conditional text) để hướng dẫn việc tạo caption

### 3. **Multimodal RAG**
- Kết hợp thông tin từ documents (text) và images
- Truy vấn đồng thời cả text và image context

## Cài đặt

### 1. Cài đặt dependencies mới
```bash
pip install -r requirements.txt
```

Các thư viện mới được thêm:
- `Pillow==10.4.0` - Xử lý hình ảnh

### 2. Khởi động lại backend
```bash
# Windows
start.bat

# hoặc
python -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

## Cách sử dụng

### 1. Upload Image qua UI

1. Mở giao diện web: `http://localhost:3000`
2. Trong sidebar, tìm phần **"🖼️ Upload Image"**
3. Chọn file hình ảnh (PNG, JPG, JPEG, etc.)
4. Click **"Upload Image"**
5. Chọn mode:
   - **Q&A về ảnh**: Để đặt câu hỏi về hình ảnh
   - **Mô tả ảnh**: Để tạo mô tả cho hình ảnh

### 2. Chat với Image

Sau khi upload image:

**Mode Q&A:**
```
User: "What is in this image?"
Bot: [Phân tích hình ảnh và trả lời]

User: "What color is the car?"
Bot: [Trả lời dựa trên hình ảnh]
```

**Mode Mô tả:**
```
User: "Describe this image"
Bot: [Tạo mô tả chi tiết cho hình ảnh]

User: "A photo of"
Bot: [Tạo caption bắt đầu với "A photo of..."]
```

### 3. Kết hợp RAG + Image

Bạn có thể:
1. Upload documents (PDF, TXT, DOCX)
2. Upload image
3. Đặt câu hỏi → Hệ thống sẽ tìm kiếm cả trong documents VÀ phân tích image để trả lời

**Ví dụ:**
```
Documents: Tài liệu về xe hơi
Image: Hình ảnh một chiếc xe
Query: "Chiếc xe trong ảnh thuộc loại nào? Nó có những tính năng gì?"

→ Bot sẽ kết hợp thông tin từ:
  - Phân tích hình ảnh (BLIP)
  - Tìm kiếm trong documents (RAG)
```

## API Endpoints

### 1. Upload Image
```http
POST /upload-image
Content-Type: multipart/form-data

file: [image file]
```

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "filename": "image.jpg",
  "caption": "a photo of a red car"
}
```

### 2. Query với Image
```http
POST /query
Content-Type: application/json

{
  "query": "What is in this image?",
  "use_rag": true,
  "image_base64": "data:image/jpeg;base64,/9j/4AAQ...",
  "image_mode": "vqa",
  "max_tokens": 512,
  "temperature": 0.7
}
```

**Parameters:**
- `query`: Câu hỏi/yêu cầu
- `use_rag`: Có sử dụng RAG không
- `image_base64`: Hình ảnh dạng base64 (optional)
- `image_mode`: `"vqa"` hoặc `"caption"`

**Response:**
```json
{
  "answer": "The image shows a red sports car...",
  "model_used": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
  "sources": ["document1.pdf", "document2.txt"]
}
```

## Models BLIP

Hệ thống sử dụng 2 models BLIP:

### 1. BLIP Caption Model
- **Model:** `Salesforce/blip-image-captioning-base`
- **Chức năng:** Tạo mô tả cho hình ảnh
- **Kích thước:** ~990MB
- **VRAM:** ~2-3GB

### 2. BLIP VQA Model
- **Model:** `Salesforce/blip-vqa-base`
- **Chức năng:** Trả lời câu hỏi về hình ảnh
- **Kích thước:** ~990MB
- **VRAM:** ~2-3GB

## Cấu hình nâng cao

### Environment Variables

Thêm vào file `.env`:

```bash
# BLIP Models
BLIP_CAPTION_MODEL=Salesforce/blip-image-captioning-base
BLIP_VQA_MODEL=Salesforce/blip-vqa-base
```

### Tùy chỉnh trong code

**Load model:**
```python
from backend.app.models.blip_processor import BLIPImageProcessor

blip = BLIPImageProcessor()
await blip.load_caption_model()
await blip.load_vqa_model()
```

**Generate caption:**
```python
from PIL import Image

image = Image.open("image.jpg")
caption = await blip.generate_caption(image)
print(caption)  # "a photo of a red car"
```

**Answer question:**
```python
answer = await blip.answer_question(image, "What color is the car?")
print(answer)  # "red"
```

## Performance Tips

### 1. Memory Management
- Chỉ load model khi cần thiết
- Dùng `blip.unload_models()` để giải phóng VRAM

### 2. Batch Processing
```python
images = [image1, image2, image3]
captions = await blip.batch_generate_captions(images)
```

### 3. GPU vs CPU
- **GPU (CUDA):** Nhanh hơn ~10x, cần 2-3GB VRAM
- **CPU:** Chậm hơn nhưng không cần GPU

## Troubleshooting

### 1. Out of Memory
```
Error: CUDA out of memory
```
**Giải pháp:**
- Giảm batch size
- Unload models không dùng
- Dùng CPU thay vì GPU

### 2. Model load chậm
**Lần đầu:** Download model (~1-2GB), mất 5-10 phút
**Lần sau:** Load từ cache, nhanh hơn

### 3. Lỗi PIL/Image
```bash
pip install --upgrade Pillow
```

## Examples

### Example 1: Basic VQA
```python
from PIL import Image
from backend.app.models.blip_processor import BLIPImageProcessor

blip = BLIPImageProcessor()
image = Image.open("car.jpg")

answer = await blip.answer_question(image, "What is this?")
print(answer)  # "car"
```

### Example 2: Conditional Captioning
```python
caption = await blip.generate_caption(image, "a photo of")
print(caption)  # "a photo of a red sports car on the road"
```

### Example 3: Multimodal RAG
```python
# User uploads image + documents
# User asks: "What type of car is this and what are its specs?"
# System:
# 1. Analyzes image → "red sports car"
# 2. Searches documents → "Ferrari specs..."
# 3. Combines → Complete answer
```

## Architecture

```
User Query + Image
     ↓
Frontend (image upload)
     ↓
Backend API (/query)
     ↓
┌─────────────────┬──────────────────┐
│  BLIP Processor │   RAG Engine     │
│  (VQA/Caption)  │  (Vector Search) │
└─────────────────┴──────────────────┘
     ↓                    ↓
  Image Context      Text Context
     └────────┬───────────┘
              ↓
         LLM Manager
              ↓
          Response
```

## Roadmap

- [x] BLIP integration
- [x] VQA support
- [x] Image captioning
- [x] Multimodal RAG
- [ ] Multiple image support
- [ ] Image-to-image search
- [ ] OCR integration
- [ ] Video frame analysis

## Credits

- **BLIP:** Salesforce Research
- **Models:** Hugging Face Transformers
- **Framework:** FastAPI, LangChain

---

**Enjoy multimodal RAG! 🎉**

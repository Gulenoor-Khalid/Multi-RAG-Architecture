# 🤖 RAG Multi-LLM System (Quantized 8B Models)

![GitHub Repo stars](https://img.shields.io/github/stars/Kietnehi/RAG?style=social)
![GitHub forks](https://img.shields.io/github/forks/Kietnehi/RAG?style=social)
![GitHub issues](https://img.shields.io/github/issues/Kietnehi/RAG)
![GitHub license](https://img.shields.io/github/license/Kietnehi/RAG)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)
![Python](https://img.shields.io/badge/Python-3.9%2B-brightgreen)

> 🚀 **RAG Multi-LLM System** là một hệ thống **Retrieval-Augmented Generation (RAG)** hoàn chỉnh, hỗ trợ **nhiều mô hình LLM quantized (4-bit / 8-bit)**, có giao diện web, vector database và triển khai dễ dàng bằng Docker.

> 🔗 **[GitHub Repository chính thức](https://github.com/Kietnehi/RAG)**


---

<p align="center">
  <img src="output.gif" width="100%" alt="Intro GIF" />
</p>


## 📌 Giới thiệu dự án

Dự án **RAG Multi-LLM System** được xây dựng nhằm mục tiêu:

- 🧠 Nghiên cứu & triển khai **Retrieval-Augmented Generation (RAG)** trong thực tế
- ⚡ Chạy **LLM 7B–8B** trên máy cấu hình hạn chế bằng **quantization**
- 🌐 Cung cấp **Web UI trực quan** cho người dùng cuối
- 🐳 Hỗ trợ **Docker / GPU / CPU**
- 📚 Phù hợp cho **educational, research, demo & portfolio**

---

## 🧠 AI – Deep Learning – RAG Overview

<table align="center">
  <tr>
    <td align="center" width="50%">
      <img src="image/readme/AI.jpg" width="100%" alt="AI Overview"><br>
      <b>Artificial Intelligence (AI)</b><br>
      <sub>Tổng quan trí tuệ nhân tạo</sub>
    </td>
    <td align="center" width="50%">
      <img src="image/readme/deeplearning.jpg" width="100%" alt="Deep Learning"><br>
      <b>Deep Learning</b><br>
      <sub>Nền tảng cho LLM</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="image/readme/docx.jpg" width="100%" alt="RAG Documents"><br>
      <b>RAG Input Documents</b><br>
      <sub>PDF, DOCX, TXT</sub>
    </td>
    <td align="center">
      <img src="image/readme/rag_pipeline.jpg" width="100%" alt="RAG Pipeline"><br>
      <b>RAG Pipeline</b><br>
      <sub>Retrieve → Context → Generate</sub>
    </td>
  </tr>
</table>

---
## 🐳 Triển khai Docker & Demo Giao Diện Web

> Minh họa các Docker containers, Docker images và giao diện web của hệ thống RAG Multi-LLM

### 📦 Các Docker Containers đang chạy

<p align="center">
  <img src="image/docker_container.png" width="90%" alt="Docker Containers">
</p>

<sub align="center">
Danh sách các container: frontend, backend (FastAPI), vector database
</sub>

---

### 🧱 Docker Images

#### 🔹 Docker Image – Frontend

<p align="center">
  <img src="image/docker_image_frontend.png" width="80%" alt="Docker Image Frontend">
</p>

<sub align="center">
Image cho giao diện Web UI (HTML / CSS / JavaScript + Nginx)
</sub>

#### 🔹 Docker Image – Backend

<p align="center">
  <img src="image/docker_image_backend.png" width="80%" alt="Docker Image Backend">
</p>

<sub align="center">
Image cho Backend FastAPI + LLM + RAG Engine
</sub>

---

### 🌐 Giao diện Web (Web UI)

<p align="center">
  <img src="image/frontend.png" width="90%" alt="Web UI Chat">
</p>

<sub align="center">
Giao diện chat RAG: upload tài liệu, chọn mô hình, streaming câu trả lời
</sub>

**Demo Run**

<p align="center">
  <img src="image/demo_run_rag.png" width="90%" alt="Demo Run RAG">
</p>

<sub align="center">
Ảnh minh họa quá trình chạy RAG (upload tài liệu và phản hồi từ model).
</sub>

---

## ✨ Tính năng

- 🧠 **Hỗ trợ nhiều LLM models 8B** (quantized với 4-bit/8-bit)
  - Meta Llama 2 7B
  - Mistral 7B Instruct
  - Google Gemma 7B
  - Microsoft Phi-2
  - TinyLlama 1.1B

- 📚 **RAG với Vector Database**
  - ChromaDB cho vector storage
  - Sentence transformers cho embeddings
  - Hỗ trợ PDF, DOCX, TXT

- 🎨 **Web Interface hiện đại**
  - Chat interface với streaming
  - Upload và quản lý documents
  - Switch giữa các models
  - Điều chỉnh temperature, max tokens

- 🐳 **Docker support**
  - Docker Compose cho deployment dễ dàng
  - GPU support cho inference nhanh
  - Persistent storage cho documents

## 🏗️ Kiến trúc

```
RAG MINI/
├── backend/                 # FastAPI backend
│   └── app/
│       ├── main.py         # API endpoints
│       ├── models/
│       │   ├── llm_manager.py    # Quản lý LLM models
│       │   └── rag_engine.py     # RAG logic
│       └── utils/
│           └── document_processor.py
├── frontend/               # Web UI
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Dockerfile             # Backend container
├── Dockerfile.frontend    # Frontend container
├── docker-compose.yml     # Orchestration
├── nginx.conf            # Nginx config
└── requirements.txt      # Python dependencies
```

## 🚀 Cài đặt và Chạy

### Yêu cầu

- Docker & Docker Compose
- NVIDIA GPU (khuyến nghị, nhưng có thể chạy trên CPU)
- 8GB RAM trở lên
- 10GB disk space cho models

### Cách 1: Docker Compose (Khuyến nghị)

1. **Clone hoặc tải project**

2. **Cấu hình môi trường** (optional)
```bash
cp .env.example .env
# Edit .env để thay đổi model mặc định và settings
```

3. **Build và chạy**
```bash
docker-compose up --build
```

4. **Truy cập ứng dụng**
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Cách 2: Local Development

1. **Cài đặt dependencies**
```bash
pip install -r requirements.txt
```

2. **Tạo file .env**
```bash
cp .env.example .env
```

3. **Chạy backend**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

4. **Chạy frontend**
```bash
# Mở frontend/index.html trong browser
# Hoặc dùng simple HTTP server:
cd frontend
python -m http.server 3000
```

## 🎮 Sử dụng

### 1. Upload Documents

1. Click vào **"📁 Upload Documents"** trong sidebar
2. Chọn file (PDF, DOCX, TXT)
3. Click **Upload**
4. Documents sẽ được xử lý và lưu vào vector database

### 2. Chat với RAG

1. Nhập câu hỏi vào chat input
2. Bật **"Sử dụng RAG"** để query từ documents
3. Tắt RAG để chat trực tiếp với LLM
4. Click **Gửi** hoặc nhấn Enter

### 3. Switch Models

1. Chọn model từ dropdown **"Model"**
2. Click **"Load Model"**
3. Đợi model load (có thể mất 1-2 phút)

### 4. Điều chỉnh Parameters

- **Temperature**: 0-1 (creativity)
- **Max Tokens**: 128-2048 (response length)

## 🔧 Cấu hình

### Environment Variables (.env)

```env
# Model Configuration
MODEL_NAME=TinyLlama/TinyLlama-1.1B-Chat-v1.0
LOAD_IN_8BIT=true
LOAD_IN_4BIT=false

# Generation Settings
MAX_NEW_TOKENS=512
TEMPERATURE=0.7

# Vector DB Settings
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
CHUNK_SIZE=500
CHUNK_OVERLAP=50
```

### Chọn Model khác

Sửa `MODEL_NAME` trong `.env`:

```env
# Llama 2 7B (yêu cầu HuggingFace token)
MODEL_NAME=meta-llama/Llama-2-7b-chat-hf

# Mistral 7B
MODEL_NAME=mistralai/Mistral-7B-Instruct-v0.2

# Gemma 7B (yêu cầu Google token)
MODEL_NAME=google/gemma-7b-it

# Phi-2 (nhỏ, nhanh)
MODEL_NAME=microsoft/phi-2

# TinyLlama (nhỏ nhất, cho testing)
MODEL_NAME=TinyLlama/TinyLlama-1.1B-Chat-v1.0
```

### Quantization Options

```env
# 8-bit quantization (tiết kiệm ~50% VRAM)
LOAD_IN_8BIT=true
LOAD_IN_4BIT=false

# 4-bit quantization (tiết kiệm ~75% VRAM)
LOAD_IN_8BIT=false
LOAD_IN_4BIT=true
```

## 📊 API Endpoints

### Health Check
```bash
GET /health
```

### List Models
```bash
GET /models
```

### Load Model
```bash
POST /models/load?model_name=<model_name>
```

### Upload Document
```bash
POST /upload
Content-Type: multipart/form-data
```

### Query (RAG)
```bash
POST /query
Content-Type: application/json

{
  "query": "Your question here",
  "use_rag": true,
  "max_tokens": 512,
  "temperature": 0.7
}
```

### Clear Documents
```bash
DELETE /documents
```

## 🐛 Troubleshooting

### Model không load được

1. Kiểm tra RAM/VRAM đủ không
2. Thử model nhỏ hơn (TinyLlama)
3. Enable quantization (8-bit hoặc 4-bit)

### Out of Memory

1. Tăng Docker memory limit
2. Sử dụng 4-bit quantization
3. Chọn model nhỏ hơn

### Docker không start

```bash
# Xem logs
docker-compose logs -f

# Restart
docker-compose down
docker-compose up --build
```

### GPU không được detect

1. Cài đặt NVIDIA Docker runtime
2. Kiểm tra: `docker run --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi`
3. Nếu không có GPU, xóa phần `deploy.resources` trong docker-compose.yml

## 🎯 Performance Tips

1. **Sử dụng GPU**: Nhanh hơn 10-20x so với CPU
2. **Quantization**: Giảm VRAM, tăng tốc độ
3. **Cache models**: Models được cache sau lần đầu
4. **Chunking**: Adjust `CHUNK_SIZE` phù hợp với documents
## 📝 TODO / Improvements

- [ ] Thêm **authentication**
- [ ] Multi-user support
- [ ] Conversation history
- [ ] Advanced RAG strategies (HyDE, Multi-query)
- [ ] Model comparison mode
- [ ] Export chat history
- [ ] Support thêm file formats (CSV, Excel, etc.)

---

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp!  
Vui lòng tạo **issue** hoặc **pull request** trên GitHub.

---

## 📄 License

MIT License

---

## 🙏 Credits

- FastAPI  
- Transformers (HuggingFace)  
- LangChain  
- ChromaDB  
- bitsandbytes (quantization)  

> **Lưu ý**: Project dùng cho **educational purposes**. Một số models yêu cầu token từ HuggingFace hoặc tuân thủ license riêng.
---

## 🔗 GitHub của tác giả

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=header"/>

<p align="center">
  <a href="https://github.com/Kietnehi">
    <img src="https://github.com/Kietnehi.png" width="140" height="140" style="border-radius: 50%; border: 4px solid #A371F7;" alt="Avatar Trương Phú Kiệt"/>
  </a>
</p>

<h3>🚀 Trương Phú Kiệt</h3>

<a href="https://github.com/Kietnehi">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=236AD3&background=00000000&center=true&vCenter=true&width=435&lines=Student+@+Sai+Gon+University;Fullstack+Dev+%26+AI+Researcher;Building+RAG+%26+Docker+Systems" alt="Typing SVG" />
</a>

<br/><br/>

<p align="center">
  <img src="https://img.shields.io/badge/SGU-Sai_Gon_University-0056D2?style=flat-square&logo=google-scholar&logoColor=white" alt="SGU"/>
  <img src="https://img.shields.io/badge/Base-Ho_Chi_Minh_City-FF4B4B?style=flat-square&logo=google-maps&logoColor=white" alt="HCMC"/>
</p>

<h3>🛠 Tech Stack</h3>
<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=docker,python,react,nodejs,mongodb,git,fastapi,pytorch&theme=light" alt="My Skills"/>
  </a>
</p>

<br/>

<h3>🌟 Dự án: RAG Multi-LLM System</h3>
<p align="center">
  <a href="https://github.com/Kietnehi/RAG">
    <img src="https://img.shields.io/github/stars/Kietnehi/RAG?style=for-the-badge&color=yellow" alt="Stars"/>
    <img src="https://img.shields.io/github/forks/Kietnehi/RAG?style=for-the-badge&color=orange" alt="Forks"/>
    <img src="https://img.shields.io/github/issues/Kietnehi/RAG?style=for-the-badge&color=red" alt="Issues"/>
  </a>
</p>
<!-- Quote động -->
<p align="center">
  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=dark" alt="Daily Quote"/>
</p>
<p align="center">
  <i>Cảm ơn bạn đã ghé thăm! Đừng quên nhấn <b>⭐️ Star</b> để ủng hộ mình nhé.</i>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=80&section=footer"/>

</div>
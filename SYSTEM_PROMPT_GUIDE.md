# 🎯 System Prompt Guide

## System Prompt là gì?

System Prompt định nghĩa **vai trò và hành vi** của chatbot. Đây là phần quan trọng nhất để điều khiển cách AI phản hồi.

## Cách sử dụng

### 1. Qua File .env

Chỉnh sửa file `.env`:

```env
SYSTEM_PROMPT=Bạn là tư vấn viên bán quần áo chuyên nghiệp...
```

Restart backend để áp dụng.

### 2. Qua Web UI (Không cần restart)

1. Click nút **⚙️ System Prompt** trên control panel
2. Chọn template có sẵn hoặc viết prompt tùy chỉnh
3. Click **Lưu**
4. Chat ngay lập tức với vai trò mới!

## 📋 Templates có sẵn

### 1. Tư vấn Quần áo (Fashion Consultant)

```
Bạn là tư vấn viên bán quần áo chuyên nghiệp và thân thiện tại một cửa hàng thời trang. 

Nhiệm vụ của bạn:
- Giúp khách hàng tìm trang phục phù hợp với nhu cầu, phong cách và ngân sách
- Tư vấn về xu hướng thời trang hiện đại
- Đề xuất cách phối đồ hài hòa
- Giải đáp thắc mắc về chất liệu, size, cách bảo quản
- Luôn nhiệt tình, am hiểu và đưa ra gợi ý cụ thể

Phong cách giao tiếp: Thân thiện, chuyên nghiệp, tạo cảm giác thoải mái cho khách hàng.
```

**Ví dụ chat:**
- User: "Tôi cần trang phục đi làm"
- Bot: "Dạ, tôi rất vui được tư vấn cho anh/chị! Để tôi gợi ý trang phục đi làm phù hợp nhất..."

### 2. Chăm sóc Khách hàng (Customer Support)

```
Bạn là nhân viên chăm sóc khách hàng chuyên nghiệp.

Nguyên tắc làm việc:
- Lắng nghe và thấu hiểu vấn đề của khách hàng
- Giải quyết vấn đề nhanh chóng và hiệu quả
- Luôn lịch sự, kiên nhẫn và tích cực
- Cung cấp thông tin chính xác và đầy đủ
- Theo dõi và đảm bảo khách hàng hài lòng
```

### 3. Gia sư (Teacher/Tutor)

```
Bạn là một gia sư giỏi và tận tâm.

Phương pháp giảng dạy:
- Giải thích khái niệm một cách đơn giản, dễ hiểu
- Sử dụng ví dụ thực tế để minh họa
- Khuyến khích học sinh tư duy và đặt câu hỏi
- Kiên nhẫn giải đáp mọi thắc mắc
- Điều chỉnh cách giảng dạy phù hợp với từng học sinh
```

## ✍️ Viết System Prompt tốt

### Cấu trúc đề xuất:

```
[Vai trò] + [Nhiệm vụ] + [Phong cách] + [Quy tắc]

Ví dụ:
Bạn là [chuyên gia dinh dưỡng].
Nhiệm vụ: [tư vấn chế độ ăn lành mạnh].
Phong cách: [khoa học, dễ hiểu, thực tế].
Quy tắc: [không đưa ra lời khuyên y tế, luôn khuyên gặp bác sĩ khi cần].
```

### Tips:

1. **Cụ thể và rõ ràng**: Đừng chỉ nói "hãy giúp đỡ", mà nói rõ "giúp gì" và "như thế nào"

2. **Đưa ra ví dụ**: Chỉ cho AI cách bạn muốn nó phản hồi

3. **Đặt giới hạn**: Nói rõ AI nên/không nên làm gì

4. **Tone phù hợp**: Formal (công ty) vs Casual (bạn bè)

## 🎯 Use Cases

### E-commerce Quần áo

```env
SYSTEM_PROMPT=Bạn là tư vấn viên thời trang của shop ABC. Upload catalog sản phẩm (PDF/Excel) vào RAG, sau đó chatbot sẽ tư vấn dựa trên sản phẩm thực tế trong kho.
```

**Workflow:**
1. Upload file catalog sản phẩm (tên, giá, size, màu, chất liệu)
2. Bật RAG
3. Khách hỏi → Bot tìm trong catalog → Gợi ý sản phẩm cụ thể

### Customer Support

```env
SYSTEM_PROMPT=Bạn là bot hỗ trợ khách hàng của công ty XYZ. Upload FAQ, chính sách, hướng dẫn vào RAG để trả lời chính xác các câu hỏi thường gặp.
```

### Knowledge Base

```env
SYSTEM_PROMPT=Bạn là trợ lý nghiên cứu. Upload papers, documents vào RAG và giúp tìm kiếm, tóm tắt thông tin khoa học.
```

## 🔄 Kết hợp với RAG

Khi **bật RAG**:
- System Prompt vẫn hoạt động
- Bot sẽ tìm info trong documents trước
- Sau đó trả lời theo vai trò đã định

**Ví dụ:**

```
System Prompt: "Bạn là tư vấn viên quần áo"
Documents: Catalog sản phẩm shop

User: "Tôi cần áo sơ mi nam size M"
→ Bot tìm trong catalog
→ Trả lời: "Dạ, shop có 3 mẫu áo sơ mi nam size M:
   1. Áo sơ mi trắng - 299k
   2. Áo sơ mi xanh navy - 349k
   3. Áo sơ mi kẻ caro - 399k
   
   Anh/chị thích phong cách nào để tôi tư vấn chi tiết hơn ạ?"
```

## 🚀 Quick Start

1. **Chạy backend:**
```bash
start-local.bat
```

2. **Mở frontend:**
```bash
start-frontend.bat
```

3. **Click ⚙️ System Prompt → Chọn "Tư vấn Quần áo" → Lưu**

4. **Test chat:**
```
User: "Xin chào"
Bot: "Xin chào! Tôi là tư vấn viên thời trang. Hôm nay tôi có thể giúp gì cho anh/chị?"
```

## 🎨 Custom cho business của bạn

Chỉnh sửa theo nhu cầu:

```
Bạn là [VAI TRÒ CỦA BẠN].

Chuyên môn:
- [Lĩnh vực 1]
- [Lĩnh vực 2]
- [Lĩnh vực 3]

Cách phản hồi:
- [Phong cách giao tiếp]
- [Tone of voice]
- [Format câu trả lời]

Quy tắc:
- Luôn [quy tắc 1]
- Không bao giờ [quy tắc 2]
- Khi [tình huống X], hãy [hành động Y]
```

Chúc bạn thành công! 🎉
cd "c:\Users\ADMIN\Desktop\RAG MINI\backend" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
cd "c:\Users\ADMIN\Desktop\RAG MINI\frontend" && python -m http.server 3000 







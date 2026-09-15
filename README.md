# 📚 DeepNotes — Ghi Chú Học Tập THPT

> Trang web lưu trữ ghi chú lý thuyết THPT cá nhân, thiết kế theo phong cách đại dương xanh thẫm.

🌐 **Live site**: [https://[username].github.io/study-notes](https://[username].github.io/study-notes)

---

## ✨ Tính năng

- 🎨 Giao diện ocean dark theme, cá voi xanh mờ, hiệu ứng sao trời và bong bóng
- 📂 Phân loại theo 10 môn học THPT
- 🔍 Tìm kiếm tức thì
- 📄 Xem và tải PDF ngay trên trang
- 📱 Responsive hoàn toàn

---

## 🚀 Cách thêm ghi chú mới

### Bước 1 — Thêm file PDF
Upload file PDF vào thư mục `notes/`:
```
notes/
  toan-dao-ham.pdf
  ly-mach-rlc.pdf
  hoa-phan-ung-hoa-hoc.pdf
  ...
```

### Bước 2 — Đăng ký trong `data.js`
Mở file `data.js` và thêm object vào mảng `NOTES`:

```js
const NOTES = [
  {
    id: 1,
    title: "Đạo hàm - Lý thuyết cơ bản",
    subject: "toan",          // phải khớp với id trong SUBJECTS
    description: "Định nghĩa đạo hàm, quy tắc tính đạo hàm, bảng đạo hàm.",
    file: "notes/toan-dao-ham.pdf",
    date: "2026-09-15",
    pages: 8
  },
  // thêm các ghi chú khác...
];
```

**Danh sách `subject` hợp lệ:**
| id | Tên môn |
|----|---------|
| `toan` | Toán học |
| `ly` | Vật lý |
| `hoa` | Hóa học |
| `van` | Ngữ văn |
| `anh` | Tiếng Anh |
| `su` | Lịch sử |
| `dia` | Địa lý |
| `sinh` | Sinh học |
| `tin` | Tin học |
| `gdcd` | GDCD |

### Bước 3 — Push lên GitHub
```bash
git add .
git commit -m "Add note: Tên bài học"
git push
```

GitHub Pages sẽ tự động cập nhật trong vài phút!

---

## 🌐 Deploy lên GitHub Pages

```bash
# 1. Tạo repo trên GitHub (đặt tên: study-notes)
# 2. Liên kết và push
git init
git remote add origin https://github.com/[username]/study-notes.git
git add .
git commit -m "Initial commit: DeepNotes 🌊"
git push -u origin main

# 3. Vào Settings → Pages → Source: Deploy from branch → main → / (root)
```

---

## 📁 Cấu trúc dự án

```
study-notes/
├── index.html      # Trang chính
├── style.css       # Toàn bộ CSS
├── app.js          # Logic ứng dụng
├── data.js         # ← CHỈNH SỬA ĐỂ THÊM GHI CHÚ
├── README.md
└── notes/          # ← ĐẶT FILE PDF TẠI ĐÂY
    ├── .gitkeep
    └── ...
```

---

Made with 💙 | Deep ocean, bright mind.

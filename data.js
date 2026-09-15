/**
 * data.js — Dữ liệu môn học và ghi chú
 *
 * ĐỂ THÊM GHI CHÚ MỚI:
 * Thêm object vào mảng NOTES với cấu trúc:
 * {
 *   id: số duy nhất,
 *   title: "Tên bài học",
 *   subject: "ten-mon" (phải khớp với id trong SUBJECTS),
 *   description: "Mô tả ngắn",
 *   file: "notes/ten-file.pdf",  ← đường dẫn tới file PDF
 *   date: "YYYY-MM-DD",
 *   pages: số trang (tuỳ chọn)
 * }
 */

const SUBJECTS = [
  { id: "toan-10", name: "Toán học 10", icon: "📐", color: ["#3b82f6", "#1d4ed8"] },
  { id: "toan-11", name: "Toán học 11", icon: "📐", color: ["#3b82f6", "#1d4ed8"] },
  { id: "toan-12", name: "Toán học 12", icon: "📐", color: ["#3b82f6", "#1d4ed8"] },
  { id: "ly-10",   name: "Vật lý 10",   icon: "⚡", color: ["#f59e0b", "#b45309"] },
  { id: "ly-11",   name: "Vật lý 11",   icon: "⚡", color: ["#f59e0b", "#b45309"] },
  { id: "ly-12",   name: "Vật lý 12",   icon: "⚡", color: ["#f59e0b", "#b45309"] },
  { id: "hoa-10",  name: "Hóa học 10",  icon: "🧪", color: ["#10b981", "#065f46"] },
  { id: "hoa-11",  name: "Hóa học 11",  icon: "🧪", color: ["#10b981", "#065f46"] },
  { id: "hoa-12",  name: "Hóa học 12",  icon: "🧪", color: ["#10b981", "#065f46"] },
];

/**
 * NOTES — Thêm ghi chú của bạn vào đây
 *
 * Bước 1: Upload file PDF vào thư mục notes/
 * Bước 2: Thêm object vào mảng dưới đây
 * Bước 3: Push lên GitHub, trang web sẽ tự động cập nhật
 */
const NOTES = [
  // ──── VÍ DỤ MẪU — BẠN CÓ THỂ XÓA HOẶC THAY THẾ ────

  // {
  //   id: 1,
  //   title: "Đạo hàm - Lý thuyết cơ bản",
  //   subject: "toan",
  //   description: "Định nghĩa đạo hàm, quy tắc tính đạo hàm, bảng đạo hàm các hàm số cơ bản.",
  //   file: "notes/toan-dao-ham.pdf",
  //   date: "2026-09-01",
  //   pages: 8
  // },
  // {
  //   id: 2,
  //   title: "Điện xoay chiều - Mạch RLC",
  //   subject: "ly",
  //   description: "Hiện tượng cộng hưởng điện, công suất mạch xoay chiều, hệ số công suất.",
  //   file: "notes/ly-mach-rlc.pdf",
  //   date: "2026-09-03",
  //   pages: 12
  // },

  // ──── THÊM GHI CHÚ THẬT CỦA BẠN TỪ ĐÂY ────
];

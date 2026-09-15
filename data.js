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
  { id: "toan",    name: "Toán học",    icon: "📐", color: ["#3b82f6", "#1d4ed8"] },
  { id: "ly",      name: "Vật lý",      icon: "⚡", color: ["#f59e0b", "#b45309"] },
  { id: "hoa",     name: "Hóa học",     icon: "🧪", color: ["#10b981", "#065f46"] },
  { id: "van",     name: "Ngữ văn",     icon: "📖", color: ["#ec4899", "#9d174d"] },
  { id: "anh",     name: "Tiếng Anh",   icon: "🌐", color: ["#8b5cf6", "#5b21b6"] },
  { id: "su",      name: "Lịch sử",     icon: "🏛️", color: ["#ef4444", "#991b1b"] },
  { id: "dia",     name: "Địa lý",      icon: "🌏", color: ["#06b6d4", "#0e7490"] },
  { id: "sinh",    name: "Sinh học",    icon: "🧬", color: ["#84cc16", "#365314"] },
  { id: "tin",     name: "Tin học",     icon: "💻", color: ["#64748b", "#334155"] },
  { id: "gdcd",    name: "GDCD",        icon: "⚖️", color: ["#f97316", "#9a3412"] },
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

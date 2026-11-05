# CLAUDE.md — Quy ước dự án osce-web

## Mục tiêu
- Web ôn tập **OSCE Sản khoa Y4**.
- Dùng được trên **điện thoại, iPad và PC**, chạy tốt trên **Safari, Chrome, Edge**.
- Giao diện **responsive một bản duy nhất** (không tách bản mobile/desktop riêng).
- Toàn bộ giao diện bằng **tiếng Việt**.

## Kỹ thuật
- **HTML/CSS/JS thuần**, không framework bắt buộc, **không cần bước build** (mở file là chạy).
- Không phụ thuộc công cụ đóng gói (npm build, bundler...). Nếu cần thư viện ngoài thì nhúng trực tiếp.

## Nội dung y khoa
- `nguon/` là nội dung gốc: **không tóm tắt, không sửa, không viết lại** nội dung y khoa trong thư mục này. Web chỉ hiển thị/trích nguyên văn.
- Bất kỳ phần nào tự soạn thêm (không có trong `nguon/`) phải **gắn nhãn "soạn thêm"** rõ ràng trên giao diện.

## Dữ liệu
- Nguồn dữ liệu duy nhất: `mau-nap/tram/*.md` (khuôn: `mau-nap/MAU_NAP_DE_OSCE.md`). Không sửa tay `data/stations.json` / `data/stations.js`.
- Sau khi sửa đề: chạy `node tools/build_data.js` và `node --test tests/*.test.js`.

## Quy trình
- Mỗi việc làm xong thì **commit và push** ngay.

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
- Dữ liệu công cụ luyện tập: `mau-nap/cong-cu/*.json` (CTG, sản đồ); biểu đồ tăng trưởng đọc từ `nguon/mau-trong/script/shino.json`.
- Sau khi sửa đề/dữ liệu: chạy `node tools/build_data.js` (sinh lại `data/` và `sw.js`) và `node --test tests/*.test.js`.

## Kiểm thử
- Test logic: `node --test tests/*.test.js`.
- Test giao diện (Playwright, script trong `tests/e2e/`): `node tests/e2e/chay.js` chạy bộ nhanh (tự bật server tĩnh). Kiểm toàn bộ 121 đề × 6 cỡ màn hình: `DAY_DU=1 node tests/e2e/chay.js toan-trang` (~20 phút, chạy nền, làm ở cuối).
- Cỡ màn hình phải đạt: 360/390 (điện thoại), 820/1180 (iPad dọc/ngang), 1280/1440 (PC). Không lỗi JS, không cuộn ngang trang.
- Trong Playwright, trước `goto` tới địa chỉ chỉ khác `#hash` phải mở `about:blank` (nếu không sẽ treo chờ sự kiện tải trang).
- Script Node vừa bật server vừa chạy tiến trình con thì dùng `spawn` (bất đồng bộ), không dùng `spawnSync` – nó chặn vòng lặp sự kiện làm server không trả lời.
- Test mới phải được thấy **thất bại một lần** (đổi tạm dữ liệu hoặc công thức) để chắc nó kiểm thật.

## Quy tắc kỹ thuật (rút kinh nghiệm)
- CSS gốc luôn có `[hidden] { display: none !important; }` – nếu không, `display:flex/grid` của class sẽ đè thuộc tính `hidden`.
- Biểu tượng trên nút điều khiển dùng SVG, không dùng emoji (⏸ hiển thị thành vạch nhỏ trên một số máy).
- Không dùng phông monospace cho chữ tiếng Việt (vỡ dấu); nút nhỏ đặt `white-space: nowrap`.
- Chạy được trên Safari iOS 15+: không dùng regex lookbehind `(?<!…)`; `:has()` chỉ để trang trí, phải có cách hiển thị thay thế.
- Mọi truy cập `localStorage` đi qua `LuuTru` (try/catch) trong `js/app.js`.
- Service worker: không tự tải lại trang ở lần cài đầu; chỉ tải lại khi thay thế bản cũ (đã có `controller`) và không đang làm trạm.
- Sau mỗi lần sửa JS bằng script (sed/python) chạy `node --check <file>`. Đoạn JS nhiều dấu nháy thì sửa bằng công cụ Edit, không ghép chuỗi.

## Quy trình
- Mỗi việc làm xong thì **commit và push** ngay.
- Chốt định dạng nguồn dữ liệu trước khi tách/chuyển dữ liệu. Prompt nhắc tới tài liệu (kế hoạch, khuôn mẫu…) không có trong repo thì hỏi một câu, không tự đoán.
- File nguồn lớn: liệt kê tiêu đề trước (`grep -n "^#"`), chỉ đọc phần cần cho việc đang làm.
- Sau mỗi màn mới: chụp màn hình ở 390 và 1440px và tự xem trước khi làm tiếp.
- Prompt có "dừng / chờ duyệt / để mình duyệt trước khi…" thì dừng đúng chỗ đó và báo lại.

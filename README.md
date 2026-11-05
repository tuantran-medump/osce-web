# osce-web

Web ôn tập OSCE Sản khoa Y4, dùng trên điện thoại, iPad và PC (Safari, Chrome, Edge). HTML/CSS/JS thuần, không cần build.

## Chạy

- Mở thẳng `index.html` bằng trình duyệt (dữ liệu nạp từ `data/stations.js`, chạy được cả khi mở file trực tiếp), hoặc
- chạy server tĩnh: `python3 -m http.server 8000` rồi vào http://localhost:8000

## Cấu trúc

- `mau-nap/tram/*.md`: **nguồn dữ liệu duy nhất** – mỗi trạm một file theo khuôn nạp đề (chữ nguyên văn từ tài liệu; phần tự soạn thêm nằm dưới dòng `Soạn thêm:`).
- `mau-nap/MAU_NAP_DE_OSCE.md`: khuôn file nạp (có chú thích từng dòng) + một đề ví dụ điền đủ.
- `mau-nap/huong-dan-chung.md`: phần "Hướng dẫn thi OSCE" ở cuối tài liệu.
- `nguon/`: tài liệu gốc để đối chiếu (OSCE Y21 viết lại từng bước + hình, lưu đồ, rubric, tập đọc CTG, mẫu trống). Không sửa tay nội dung y khoa trong thư mục này.
- `js/nap.js`: trình đọc/xuất file nạp, dùng chung cho web (trang **Nạp đề**) và Node (`tools/build_data.js`).
- `tools/build_data.js`: build `data/stations.json`, `data/rubrics.json`, `data/stations.js` và bảng kiểm tra `kiem_tra/*.md` từ `mau-nap/tram/` và `nguon/Rubric_OSCE_TungBuoc.md` (bộ tách rubric: `tools/rubric.js`).
- Ghép rubric vào trạm: dòng `Rubric: trang-58, trang-60` ở đầu file trạm; bảng ghép để duyệt: `kiem_tra/bang_rubric.md`.
- `tests/e2e/`: kiểm thử giao diện bằng Playwright – `node tests/e2e/chay.js` (bộ nhanh, tự bật server); `DAY_DU=1 node tests/e2e/chay.js toan-trang` (toàn bộ đề × 6 cỡ màn hình). Cần cài Playwright: `npm i -D playwright && npx playwright install chromium`.
- `tests/`: test trình đọc (file ví dụ, đọc–xuất–đọc lại toàn bộ dữ liệu, các file lỗi trong `tests/mau-loi/`).
- `index.html`, `css/style.css`, `js/md.js`, `js/app.js`: giao diện.

## Sửa / thêm đề

1. Sửa hoặc thêm file trong `mau-nap/tram/` theo khuôn `mau-nap/MAU_NAP_DE_OSCE.md`.
2. Build lại dữ liệu và chạy test:

```bash
node tools/build_data.js
```

```bash
node --test tests/*.test.js
```

Trên web, trang **Nạp đề** cho phép chọn file .md hoặc dán chữ, xem trước, báo lỗi theo dòng, lưu vào trình duyệt (localStorage) và **Xuất ra .md** để đưa vào `mau-nap/tram/`.

Tự chấm: làm xong trạm sẽ hiện phần Tự chấm (rubric F/40/80/100% hoặc checklist đáp án). Điểm %, ngày, thời gian làm lưu trong localStorage; trang **Lịch sử** có Xuất/Nhập file JSON để sao lưu.

## Ứng dụng (PWA) và chạy offline

- `manifest.webmanifest`, `icons/`, `sw.js` (sinh tự động khi build từ `tools/sw-mau.js`, danh sách tệp + phiên bản theo nội dung).
- Lần mở đầu (có mạng) lưu toàn bộ trang, dữ liệu, hình vào bộ nhớ máy; sau đó dùng offline. Khi có bản mới sẽ hiện thông báo "Đã có bản cập nhật – Tải lại".
- Cài như app: iPhone/iPad (Safari → Chia sẻ → Thêm vào MH chính), Android (Chrome → Cài đặt ứng dụng), PC (Chrome/Edge → biểu tượng cài ở thanh địa chỉ).
- Service worker chỉ chạy qua `http(s)`; mở thẳng file `index.html` vẫn dùng được nhưng không offline/cài app.

## Công cụ luyện tập

- Tập đọc CTG: `js/ctg.js` (chuyển từ `nguon/tap-doc-ctg/script` sang JS, sinh băng mới bằng seed); 12 ca + đáp án `mau-nap/cong-cu/ctg-ca-goc.json`, khóa đáp án dạng chọn `mau-nap/cong-cu/ctg-khoa.json`.
- Tập sản đồ: 6 tình huống `mau-nap/cong-cu/san-do.json` (nguồn ghi theo số đề và số dòng chương 5).
- Biểu đồ tăng trưởng: số liệu `nguon/mau-trong/script/shino.json` (Shinozuka) và công thức Hadlock.
- Thi thử: 6 trạm (mỗi chương 1 đề) × 7 phút + 1 phút chuyển trạm, bảng điểm cuối buổi.

## Deploy

Trang là web tĩnh, dữ liệu đã build sẵn trong repo, **không cần bước build trên máy chủ**. Trước khi đẩy lên, chạy `node tools/build_data.js` nếu có sửa đề/dữ liệu (để cập nhật `data/` và `sw.js`).

### GitHub Pages

1. Gộp nhánh vào `main` (hoặc chọn nhánh muốn xuất bản).
2. Trên GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, chọn nhánh `main`, thư mục `/ (root)`, bấm **Save**.
3. Sau 1–2 phút trang có ở `https://<tên-tài-khoản>.github.io/osce-web/`. Mọi đường dẫn trong web đều là đường dẫn tương đối nên chạy được dưới thư mục con `/osce-web/`.
4. Tệp `.nojekyll` đã có để GitHub không xử lý các file `.md` bằng Jekyll (giữ nguyên `mau-nap/*.md` cho nút tải khuôn).

### Vercel

1. Vào vercel.com → **Add New… → Project** → chọn repo `osce-web`.
2. **Framework Preset: Other**; **Build Command**: để trống; **Output Directory**: `.` (thư mục gốc); bấm **Deploy**.
3. `vercel.json` đã đặt `Cache-Control: no-cache` cho `sw.js` để bản cập nhật đến người dùng nhanh.
4. Mỗi lần push lên nhánh đã kết nối, Vercel tự triển khai lại.

Sau khi deploy: mở trang bằng Safari/Chrome một lần khi có mạng, rồi cài như app theo hướng dẫn ở trên.


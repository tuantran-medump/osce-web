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

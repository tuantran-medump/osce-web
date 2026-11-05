# osce-web

Web ôn tập OSCE Sản khoa Y4, dùng trên điện thoại, iPad và PC (Safari, Chrome, Edge). HTML/CSS/JS thuần, không cần build.

## Chạy

- Mở thẳng `index.html` bằng trình duyệt (dữ liệu nạp từ `data/stations.js`, chạy được cả khi mở file trực tiếp), hoặc
- chạy server tĩnh: `python3 -m http.server 8000` rồi vào http://localhost:8000

## Cấu trúc

- `nguon/`: nội dung gốc (OSCE Y21 viết lại từng bước + hình, 29 lưu đồ SVG, rubric OSCE từng bước, tập đọc CTG, mẫu trống sản đồ và biểu đồ tăng trưởng). Không sửa tay nội dung y khoa trong thư mục này.
- `tools/build_data.py`: sinh `data/stations.json` và `data/stations.js` từ `nguon/TongHop_OSCE_Y21_TungBuoc.md`.
- `tools/cau_hinh/c1.py … c6.py`: cách chia từng trạm/đề theo số dòng của file nguồn (chữ được chép nguyên dòng) và phần **soạn thêm** (khóa `st`).
- `kiem_tra/bang_kiem_tra.md`: số đề mỗi trạm, các bước của từng đề, bước nào có soạn thêm, tiêu đề bị bỏ qua.
- `kiem_tra/noi_dung_soan_them.md`: toàn bộ nội dung soạn thêm để duyệt.
- `index.html`, `css/style.css`, `js/md.js`, `js/app.js`: giao diện.

## Sinh lại dữ liệu

```bash
python3 tools/build_data.py
```

Sửa nội dung soạn thêm hoặc cách chia dòng trong `tools/cau_hinh/`, chạy lại lệnh trên; giao diện không cần sửa.

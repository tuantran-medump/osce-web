"""Cấu hình tách đề cho tools/build_data.py.

Mỗi trạm:
  id, ten (tên hiển thị), dong (phạm vi dòng của trạm trong file nguồn),
  ly_thuyet (dòng), vung_de (vùng chứa các tiêu đề ##### là đề),
  buoc (thứ tự bước mặc định: hb=hỏi bệnh, kh=khám, cls=cận lâm sàng, cd=chẩn đoán, xt=xử trí),
  dap_an (đáp án mẫu chung: bước -> các khoảng dòng của phần "CÁC BƯỚC TIẾP CẬN"),
  de (danh sách đề).

Mỗi đề:
  so            số đề trong tài liệu (khớp tiêu đề #####), hoặc tự đặt cho đề không có tiêu đề
  dong          phạm vi dòng (chỉ cần cho đề không có tiêu đề #####)
  ten/nguon_de  ghi đè tên / nguồn đề nếu cần
  buoc          ghi đè các bước của đề
  mo_dau, tac_vu, giai_dap, <b>_de, <b>_kq, <b>_da   các dòng nguồn xếp vào từng ô
                (kq = kết quả mở ra sau khi xong bước, da = đáp án riêng của đề cho bước đó)
  dap_an        ghi đè đáp án mẫu chung cho từng bước; dap_an_tu: lấy bộ đáp án của trạm khác
  st            phần SOẠN THÊM: mo_dau, tac_vu, <b> (kết quả soạn thêm), <b>_de (yêu cầu soạn thêm)
  bo_qua        lý do bỏ qua tiêu đề (đề trống / trùng)
Dòng nào của đề không được xếp sẽ tự vào giai_dap.
"""
from . import c1, c2, c3, c4, c5, c6

SHA256_NGUON = "c1a6fbbcb89b53487a6b25f5b3e17e8cd2d44636a7ad4837513f2b73a5be3898"

# Phần "Hướng dẫn thi OSCE by BS Uyên" + "Đoán đề" ở cuối tài liệu
HUONG_DAN_CHUNG = "3506-3575"

CHUONG = [
    {"id": "c1", "ten": "CHƯƠNG 1: 3 THÁNG ĐẦU THAI KÌ", "tram": c1.TRAM},
    {"id": "c2", "ten": "CHƯƠNG 2: NỬA ĐẦU THAI KÌ", "tram": c2.TRAM},
    {"id": "c3", "ten": "CHƯƠNG 3: LƯỢNG GIÁ SỨC KHOẺ THAI", "tram": c3.TRAM},
    {"id": "c4", "ten": "CHƯƠNG 4: NỬA SAU THAI KÌ", "tram": c4.TRAM},
    {"id": "c5", "ten": "CHƯƠNG 5: QUẢN LÝ MỘT CUỘC CHUYỂN DẠ SANH", "tram": c5.TRAM},
    {"id": "c6", "ten": "CHƯƠNG 6: CẤP CỨU SẢN KHOA", "tram": c6.TRAM},
]

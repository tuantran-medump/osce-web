"""Chương 1: 3 tháng đầu thai kì."""

KHAM_TCN1_BT = """- Tổng trạng tỉnh, tiếp xúc tốt, da niêm hồng.
- Sinh hiệu: mạch 80 lần/phút, huyết áp 110/70 mmHg, nhiệt độ 37 °C, nhịp thở 18 lần/phút.
- Tim đều, phổi trong, bụng mềm, không điểm đau, không phản ứng thành bụng.
- Khám mỏ vịt: âm đạo sạch, không ra huyết, cổ tử cung đóng, không sang thương."""

TRAM = [
    {
        "id": "kham-thai-tcn1",
        "ten": "Hỏi bệnh sử khám thai thường quy (trễ kinh, tuổi thai)",
        "dong": "17-253",
        "vung_de": "21-150",
        "dap_an": {
            "hb": "153-212",
            "kh": "214-216",
            "cd": "218-225",
            "xt": "227-252",
        },
        "de": [
            dict(so="2.1", mo_dau="25", tac_vu="26", hb_kq="29", cls_kq="30",
                 st=dict(
                     hb="""- Chị 24 tuổi, giáo viên tiểu học, sống tại TPHCM; lập gia đình năm 21 tuổi.
- PARA 1001: năm 2021 sinh thường 1 bé trai đủ tháng (39 tuần), nặng 3.400 g, sau sinh nằm viện 2 ngày, không tai biến; bé hiện khỏe. Thai kỳ trước không được làm nghiệm pháp dung nạp đường, không tăng huyết áp.
- Kinh nguyệt: trước đây đều 28–30 ngày, hành kinh 4 ngày; chị không nhớ ngày kinh chót, chỉ nhớ "khoảng giữa tháng trước nữa". Không dùng thuốc tránh thai nội tiết trong 3 tháng trước đó.
- Thai lần này tự nhiên, ngoài kế hoạch nhưng muốn giữ.
- Hiện tại: không đau bụng, không ra huyết; nghén nhẹ; gần đây hay khát nước, tiểu nhiều.
- Nội khoa: chưa từng được chẩn đoán đái tháo đường, tăng huyết áp, bệnh tuyến giáp. Ngoại khoa: chưa mổ.
- Gia đình: mẹ ruột bị đái tháo đường type 2.
- Không dị ứng thuốc, không dùng thuốc gì; không nhớ đã tiêm ngừa Rubella hay chưa.""",
                     kh="""- Tổng trạng tỉnh, da niêm hồng. Cao 155 cm, nặng 62 kg (BMI ≈ 25,8 kg/m²).
- Sinh hiệu: mạch 82 lần/phút, huyết áp 120/70 mmHg, nhiệt độ 37 °C.
- Tim phổi bình thường, bụng mềm, không đau.
- Khám mỏ vịt: âm đạo sạch, cổ tử cung đóng, không ra huyết.""",
                 )),
            dict(so="2.2", mo_dau="34", tac_vu="36-38", hb_kq="42-46", cd_da="47", xt_da="48",
                 st=dict(
                     kh=KHAM_TCN1_BT,
                     cls="""- Siêu âm ngả âm đạo hôm nay (26/10/2022): chưa thấy túi thai trong và ngoài tử cung; nội mạc tử cung dày; hai phần phụ bình thường; không có dịch ổ bụng.
- Thai phụ có mang theo 1 tờ kết quả định lượng β-hCG = 200 mIU/mL.""",
                 )),
            dict(so="2.3", tac_vu="52", mo_dau="53", hb_kq="55-58", cd_da="59",
                 xt_de="61-62", xt_da="63,67-69",
                 st=dict(
                     hb="""- Chị 29 tuổi, nhân viên văn phòng. PARA 0010: thai lưu lúc 7 tuần năm 2021, được hút thai, không rõ nguyên nhân.
- Lần này thử que thai 2 vạch; không đau bụng, không ra huyết, không nghén.
- Không dùng thuốc tránh thai nội tiết; thai tự nhiên, mong con.
- Không bệnh nội, ngoại khoa; không dị ứng; không dùng thuốc ngoài acid folic.""",
                     kh=KHAM_TCN1_BT,
                     cls="""- Siêu âm ngày 21/12: một túi thai trong lòng tử cung, MSD 9 mm, có yolk sac, chưa thấy phôi và hoạt động tim thai; hai phần phụ bình thường.""",
                 )),
            dict(so="2.4", mo_dau="73", xt_da="75-78", cls_kq="79-82",
                 buoc=["cls", "cd", "xt"],
                 st=dict(
                     cls="""- Siêu âm hôm nay (13/4/2022): một thai trong lòng tử cung, CRL 17 mm (tương ứng 8 tuần), có hoạt động tim thai 165 lần/phút, chưa ghi nhận bất thường.""",
                     xt_de="""Thai phụ hỏi:
1. Tôi tự tính thấy 6 tuần nhưng sao siêu âm ra 8 tuần, có sai không?
2. Sức khỏe thai có bình thường không?
3. Ngày dự sanh là bao nhiêu?
4. Khi nào tôi cần tái khám?""",
                 )),
            dict(so="2.5", mo_dau="86", cls_kq="87-88", cd_da="89", xt_da="90-91",
                 buoc=["hb", "cls", "cd", "xt"],
                 st=dict(
                     hb="""- Chị 27 tuổi, PARA 0000, thai tự nhiên.
- Kinh chót tính theo dương lịch, ngày đầu có kinh; tính đến hôm nay tròn 10 tuần. Kinh đều 28 ngày, hành kinh 5 ngày, tính chất kinh chót giống các lần trước; kinh áp chót cách kinh chót 28 ngày.
- Không dùng thuốc tránh thai nội tiết. Chị tự đếm theo tháng nên ra 9 tuần.
- Không đau bụng, không ra huyết, nghén nhẹ. Chưa làm xét nghiệm máu nào trong thai kỳ này.""",
                     xt_de="Thai phụ hỏi thêm: \"Thai của tôi có tốt không bác sĩ?\"",
                 )),
            dict(so="2.6", mo_dau="95", hb_kq="96", cd_da="97", xt_de="98", xt_da="99",
                 st=dict(
                     hb="""- Chị 44 tuổi, buôn bán. PARA 2002: sinh thường 2 lần (2008, 2012), đủ tháng, không biến chứng; hai con khỏe.
- Kinh chót cách đây 9 tuần, kinh đều 28–30 ngày, tính chất giống các lần trước. Thai tự nhiên, ngoài dự định nhưng muốn giữ.
- Không dùng thuốc, không tiếp xúc hóa chất. Không bệnh nội ngoại khoa.""",
                     kh=KHAM_TCN1_BT,
                     cls="""- Siêu âm lại hôm nay: một túi thai trong lòng tử cung, kích thước 33 × 24 × 23 mm (MSD ≈ 26,7 mm), không thấy phôi; không có khối bất thường ở phần phụ.""",
                     xt_de="Thai phụ hỏi thêm: \"Bây giờ sẽ giải quyết như thế nào?\"",
                 )),
            dict(so="2.7", mo_dau="103", tac_vu="105-107",
                 st=dict(
                     hb="""- Chị 32 tuổi, kế toán. PARA 1011:
    + 2019: sinh thường bé gái 39 tuần, 3.100 g, không biến chứng.
    + 2021: thai ngoài tử cung vòi trứng phải lúc 7 tuần, mổ nội soi cắt vòi trứng phải; sau mổ tránh thai bằng bao cao su 6 tháng.
- Kinh chót 01/03/2023 (dương lịch, ngày đầu có kinh), kinh áp chót 01/02/2023; kinh đều 28 ngày, tính chất kinh chót giống các lần trước; không dùng thuốc nội tiết.
- Hôm nay 22/05/2023. Không đau bụng, không ra huyết, nghén ít.
- Không bệnh lây truyền qua đường tình dục, không bệnh nội khoa; không dị ứng.""",
                     kh=KHAM_TCN1_BT,
                     cls="""Giấy tờ khám thai thai phụ mang theo:
- Siêu âm 10/04/2023: một túi thai trong lòng tử cung, có yolk sac, CRL 4 mm, có hoạt động tim thai; hai phần phụ không thấy khối.
- Siêu âm hôm nay 22/05/2023: một thai sống trong tử cung, CRL 45 mm (tương ứng 11 tuần 2 ngày), tim thai 160 lần/phút.
- Chưa làm xét nghiệm máu, chưa tầm soát lệch bội.""",
                 )),
            dict(so="2.8", mo_dau="116", tac_vu="118-119", hb_kq="120", cls_kq="121",
                 st=dict(
                     hb="""- PARA 1010: con đầu sinh thường năm 2018, khỏe. Năm 2021 thai ngoài tử cung vòi trứng trái, điều trị nội khoa bằng methotrexate, theo dõi đến khi β-hCG âm tính.
- Hiện không đau bụng, không ra huyết âm đạo.
- Không dùng thuốc tránh thai nội tiết; thai tự nhiên, mong con.""",
                     kh=KHAM_TCN1_BT,
                     xt_de="Thai phụ hỏi: \"Thai ngoài tử cung lần trước do nguyên nhân gì? Lần này tôi có thể bị lại không?\"",
                 )),
            dict(so="2.9", mo_dau="125,132-133", tac_vu="126-130", cls_kq="134-137", xt_de="138-141",
                 st=dict(
                     hb="""- Chị 31 tuổi, PARA 0000. Kinh chót cách đây 8 tuần, kinh đều 28 ngày; thai tự nhiên, mong con.
- Không đau bụng, không ra huyết âm đạo, không thấy ra mô.
- Không dùng thuốc, không tiếp xúc hóa chất, không hút thuốc lá. Không bệnh nội ngoại khoa.""",
                     kh=KHAM_TCN1_BT,
                 )),
            dict(so="2.10", mo_dau="147", tac_vu="148", hb_da="149",
                 st=dict(
                     hb="""- Chị 21 tuổi, nhân viên bán hàng, lập gia đình được 4 tháng.
- Kinh chót: ngày đầu có kinh, theo dương lịch, cách đây 30 ngày; kinh áp chót cách kinh chót 28 ngày; kinh đều 28 ngày, hành kinh 4 ngày, tính chất kinh chót giống các lần trước.
- PARA 0010: năm 16 tuổi có thai ngoài ý muốn, bỏ thai bằng thuốc, sau đó không biến chứng.
- Sau cưới không dùng biện pháp tránh thai; mong con.
- Không đau bụng, không ra huyết, chưa nghén.
- Không bệnh phụ khoa, không bệnh lây truyền qua đường tình dục; không bệnh nội ngoại khoa; không dị ứng.""",
                     kh=KHAM_TCN1_BT,
                     cls="""- Thai phụ chưa siêu âm, chưa làm xét nghiệm máu; chỉ có que thử thai 1 vạch đậm 1 vạch nhạt sáng nay.""",
                 )),
        ],
    },
    {
        "id": "xhad-tcn1",
        "ten": "Xuất huyết âm đạo 3 tháng đầu",
        "dong": "254-509",
        "ly_thuyet": "256-276,280-284",
        "vung_de": "278-302",
        "dap_an": {
            "hb": "305-358",
            "kh": "360-362",
            "cls": "364-366",
            "cd": "370-371,425-429,448-465",
            "xt": "372-382,384-421,431-446,467-508",
        },
        "de": [
            dict(so="2.1", mo_dau="288", hb_da="289", kh_da="290", cd_da="291",
                 st=dict(
                     hb="""- Chị 30 tuổi, PARA 1001 (sinh thường 2020). Kinh chót cách đây 9 tuần, kinh đều 28 ngày.
- Siêu âm 3 tuần trước tại phòng khám tư: một thai trong lòng tử cung, có tim thai, tương ứng 6 tuần.
- Từ chiều hôm qua đau bụng hạ vị từng cơn, quặn; sáng nay ra huyết đỏ tươi lượng nhiều hơn hành kinh, thấm 3 băng vệ sinh, có máu cục và thấy "một ít mô" ra theo. Hiện còn ra huyết ít hơn, còn đau âm ỉ.
- Không chóng mặt, không ngất. Không chấn thương, không dùng thuốc.""",
                     kh="""- Tỉnh, da niêm hồng. Mạch 88 lần/phút, huyết áp 110/70 mmHg (chỉ số sốc ≈ 0,8), nhiệt độ 37 °C.
- Bụng mềm, ấn đau nhẹ hạ vị, không phản ứng thành bụng, không phản ứng dội.
- Khám mỏ vịt: máu đỏ chảy ra từ lỗ cổ tử cung lượng vừa, cổ tử cung hé mở, có mô ở lỗ ngoài cổ tử cung.
- Khám âm đạo: tử cung to nhỏ hơn tuổi thai, mềm; hai phần phụ không sờ chạm, không đau.""",
                     cls="""- Siêu âm ngả âm đạo: không còn thấy túi thai; lòng tử cung có khối echo hỗn hợp dày 22 mm, có tín hiệu mạch máu; hai phần phụ bình thường; không dịch ổ bụng.""",
                 )),
            dict(so="2.2", mo_dau="295", tac_vu="296", cls_kq="299", hb_kq="300", xt_da="301",
                 st=dict(kh=KHAM_TCN1_BT)),
        ],
    },
]

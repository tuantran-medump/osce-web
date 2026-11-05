"""Chương 3: Lượng giá sức khoẻ thai."""

DA_GIAM_CDT = {
    "kh": "1646,1659-1663",
    "hb": "1648-1657",
    "cls": "1665-1669",
    "xt": "1670-1678",
}
# Đáp án mẫu chương 5 (sản đồ – CTG), dùng cho đề CTG nằm trong trạm FGR
DA_CHUYEN_DA = {
    "cd": "2434-2466,2474-2495",
    "xt": "2411-2432,2467-2473",
}

TRAM = [
    {
        "id": "fgr",
        "ten": "Thai giới hạn tăng trưởng (FGR) – biểu đồ tăng trưởng",
        "dong": "1262-1617",
        "ly_thuyet": "1264-1276",
        "vung_de": "1369-1547",
        "buoc": ["cls", "cd", "xt"],
        "dap_an": {
            "hb": "1280-1293",
            "kh": "1297",
            "cls": "1298,1548-1562",
            "cd": "1300-1321,1563-1564,1598-1603",
            "xt": "1323-1367,1565-1597,1604-1616",
        },
        "de": [
            dict(so="3.1", mo_dau="1373", cls_da="1374", cls_kq="1375-1376", cd_da="1382-1383,1387-1388",
                 buoc=["hb", "cls", "cd", "xt"],
                 st=dict(
                     hb="""- Chị 28 tuổi, PARA 0000, thai 26 tuần, thai tự nhiên; kinh đều 28 ngày, kinh chót tin cậy.
- Khoảng tuần 14–15 sốt nhẹ, nổi ban đỏ toàn thân 2–3 ngày, đau khớp cổ tay, tự khỏi, không đi khám; lúc đó có chăm cháu bị phát ban.
- Chưa từng tiêm ngừa Rubella; gia đình không ai được chẩn đoán Rubella.
- Không tăng huyết áp, không đái tháo đường, không hút thuốc lá.""",
                     cls="- Siêu âm 26 tuần: BPD < bách phân vị 1, AC < bách phân vị 1, EFW < bách phân vị 3; bánh nhau dày; AFI 10 cm.",
                     xt_de="Thai phụ hỏi: \"Con tôi bị gì và nguyên nhân bị vậy? Có chắc chắn là do Rubella không?\"",
                 )),
            dict(so="3.2", mo_dau="1392", tac_vu="1393-1397", cd_da="1399", buoc=["cls", "cd"],
                 st=dict(
                     cls="""Các lần siêu âm sinh trắc (tuổi thai tính theo ngày dự sinh trên sổ, siêu âm và kinh cuối trùng nhau):
- Lần 1 – 24 tuần (đã chấm sẵn trên biểu đồ): BPD, AC, FL ở bách phân vị 50.
- Lần 2 – 28 tuần 6 ngày: BPD bách phân vị 25, AC bách phân vị 8, FL bách phân vị 20.
- Lần 3 – 30 tuần 2 ngày: BPD bách phân vị 15, AC bách phân vị 4, FL bách phân vị 10.""",
                 )),
            dict(so="3.3", bo_qua="Trùng nội dung đề 3.14 (Đề Y17 Đợt 2), giữ đề 3.14 vì đầy đủ hơn"),
            dict(so="3.4", cls_kq="1414,1416,1418",
                 st=dict(
                     mo_dau="""Thai phụ Chu Thị C., sinh năm 1977, không biết ngày kinh cuối, đi khám không mang theo giấy tờ cũ. Đề cho các phiếu siêu âm ở nhiều thời điểm.
Yêu cầu: (1) vẽ biểu đồ tăng trưởng đường kính lưỡng đỉnh và chu vi vòng bụng; (2) kết luận tình trạng tăng trưởng thai và định hướng nguyên nhân; (3) chọn tối đa 2 khảo sát cần làm hôm nay, giải thích.""",
                 )),
            dict(so="3.5", mo_dau="1426-1429", tac_vu="1430-1431", cls_kq="1434-1436", xt_da="1438",
                 st=dict(xt_de="Câu 2: Xử trí trường hợp trên như thế nào?")),
            dict(so="3.6", mo_dau="1442-1443", tac_vu="1444", cls_kq="1445", cls_da="1447-1450",
                 st=dict(
                     cls="""- EFM (NST): nhịp tim thai căn bản 140 lần/phút, dao động nội tại 10 nhịp/phút, có nhịp tăng, không nhịp giảm.
- Siêu âm grey-scale: EFW bách phân vị 3, AFI 7 cm, nhau tiền đạo trung tâm.
- Velocimetry Doppler: PI động mạch rốn bách phân vị 50, PI động mạch não giữa bách phân vị 40, CPR 2,54.""",
                 )),
            dict(so="3.7", mo_dau="1454", tac_vu="1455-1462", cls_da="1465-1466", cd_da="1467",
                 st=dict(
                     cls="""- Sổ khám thai: kinh không đều 30–45 ngày; siêu âm TCN1 có CRL 55 mm.
- Siêu âm hôm nay 28/06/2023: BPD bách phân vị 75, AC bách phân vị 97, FL bách phân vị 60, EFW bách phân vị 95; AFI 20 cm; chưa thấy bất thường cấu trúc.
- Nếu đề nghị nghiệm pháp dung nạp đường 75 g: đói 95 mg/dL, 1 giờ 190 mg/dL, 2 giờ 160 mg/dL.""",
                 )),
            dict(so="3.8", mo_dau="1471", cd_da="1472", xt_da="1473",
                 st=dict(
                     cls="""- Siêu âm mốc lúc 12 tuần: CRL 55 mm, phù hợp tuổi thai.
- Siêu âm hôm nay (24 tuần theo mốc): BPD < bách phân vị 3, HC < bách phân vị 1, AC bách phân vị 40, FL bách phân vị 45, EFW bách phân vị 30; AFI 12 cm.""",
                 )),
            dict(so="3.9", cls_da="1479", cd_da="1480",
                 st=dict(
                     mo_dau="Thai phụ đến khám, đưa 1 phiếu siêu âm sinh trắc hôm nay (không ghi tuổi thai). Yêu cầu: vẽ biểu đồ tăng trưởng và trả lời: thai tăng trưởng có bình thường không? Có cần làm thêm cận lâm sàng nào không? Giải thích tại sao.",
                     cls="""- Siêu âm hôm nay: HC 230 mm; BPD, AC, FL tương ứng; AFI 8 cm.
- Nếu hỏi siêu âm trước đó: thai phụ đưa phiếu siêu âm sớm có MSD (chưa thấy phôi).
- Nếu hỏi tiếp siêu âm có CRL sớm nhất: CRL 45 mm (11 tuần 2 ngày), làm cách hôm nay 13 tuần 6 ngày.""",
                 )),
            dict(so="3.10", buoc=["hb", "kh", "cls", "cd", "xt"], dap_an_tu=DA_GIAM_CDT,
                 st=dict(
                     mo_dau="Thai phụ đến khám vì giảm cử động thai. Yêu cầu: khám, giải thích cho thai phụ, đưa ra hướng quản lý.",
                     hb="""- Thai 36 tuần, PARA 1001. Từ sáng nay thấy con máy ít hơn mọi ngày.
- Không đau bụng, không ra huyết, không ra nước âm đạo.
- Sổ khám thai: thai kỳ nguy cơ thấp, các tầm soát bình thường.""",
                     kh="""- Tổng trạng tốt; mạch 80 lần/phút, huyết áp 110/70 mmHg, nhiệt độ 37 °C.
- Bề cao tử cung 32 cm; không cơn gò; Leopold: ngôi đầu; tim thai 140 lần/phút.
- Khám trong: cổ tử cung đóng, ối còn.""",
                     cls="""- NST: nhịp tim thai căn bản 140 lần/phút, dao động nội tại 10 nhịp/phút, có 2 nhịp tăng trong 20 phút, không nhịp giảm.
- Siêu âm thai: sinh trắc bách phân vị 50, AFI 12 cm, nhau nhóm I.""",
                 )),
            dict(so="3.11", mo_dau="1488",
                 st=dict(
                     cls="""- Giấy IVF: chuyển phôi ngày 5 vào 01/03/2023.
- Siêu âm hôm nay 20/09/2023: BPD bách phân vị 50, AC bách phân vị 45, FL bách phân vị 50, EFW bách phân vị 50; AFI 13 cm.""",
                 )),
            dict(so="3.12", mo_dau="1492,1494", tac_vu="1495", cd_da="1496",
                 st=dict(
                     cls="""- Siêu âm TCN1: CRL phù hợp tuổi thai theo kinh chót.
- Siêu âm TCN2 (22 tuần): các chỉ số sinh trắc ở bách phân vị 50.
- Siêu âm TCN3 hôm nay (32 tuần): BPD bách phân vị 75, AC bách phân vị 97, FL bách phân vị 60, EFW bách phân vị 97; AFI 22 cm.
- Nếu đề nghị: đường huyết đói 100 mg/dL, 2 giờ sau ăn 165 mg/dL, HbA1c 6,0 %.""",
                 )),
            dict(so="3.13", tac_vu="1502", cls_kq="1503-1505", cd_da="1508,1510", cls_da="1509", xt_da="1511",
                 st=dict(
                     mo_dau="Thai phụ con lần 2, thai 38 tuần, đến khám thai; có sổ khám thai, biểu đồ tăng trưởng, băng EFM và kết quả Doppler động mạch rốn.",
                     cls="- Siêu âm hôm nay: ngôi đầu, AFI 3 cm.",
                 )),
            dict(so="3.14", mo_dau="1515", cls_kq="1518", cd_da="1519", cls_da="1520", xt_da="1521",
                 st=dict(
                     cls="""- Siêu âm hôm nay (32 tuần, tính theo siêu âm định tuổi thai): BPD bách phân vị 75, AC > bách phân vị 95, FL bách phân vị 60.
- Nếu đề nghị: đường huyết đói 105 mg/dL, HbA1c 6,1 %.""",
                 )),
            dict(so="3.15", mo_dau="1525", tac_vu="1527-1529", buoc=["cd", "xt"], dap_an_tu=DA_CHUYEN_DA),
            dict(so="3.16", mo_dau="1538", tac_vu="1540-1542,1546", cd_da="1544",
                 st=dict(
                     cls="""- Chuyển phôi ngày 5 vào 10/01/2023; siêu âm lúc 8 tuần có CRL phù hợp.
- Bảng siêu âm: 22 tuần – BPD bách phân vị 50, AC bách phân vị 55; 28 tuần – BPD bách phân vị 70, AC bách phân vị 85; hôm nay 32 tuần – BPD bách phân vị 80, AC bách phân vị 97.""",
                 )),
        ],
    },
    {
        "id": "giam-cdt",
        "ten": "Giảm cử động thai – NST",
        "dong": "1618-1679",
        "vung_de": "1620-1643",
        "buoc": ["kh", "hb", "cls", "cd", "xt"],
        "dap_an": DA_GIAM_CDT,
        "de": [
            dict(so="1.1", mo_dau="1624", hb_da="1626", xt_da="1627",
                 st=dict(
                     kh="""- Tim thai qua Doppler cầm tay 145 lần/phút, đều.
- Mẹ: mạch 82 lần/phút, huyết áp 110/70 mmHg, nhiệt độ 37 °C.
- Bề cao tử cung 32 cm; không cơn gò; Leopold: ngôi đầu, lưng trái.
- Khám trong: cổ tử cung đóng, ối còn.""",
                     hb="""- Thai 37 tuần, PARA 0000.
- Từ sáng nay thấy con máy ít hơn mọi ngày; tối qua đếm sau ăn được 3 cử động trong 1 giờ.
- Không đau bụng, không ra huyết, không ra nước.
- Sổ khám thai: tầm soát TCN1, TCN2 bình thường, OGTT âm tính, huyết áp bình thường, không thiếu máu.""",
                     cls="""- NST: nhịp tim thai căn bản 140 lần/phút, dao động nội tại 10 nhịp/phút, 2 nhịp tăng trong 20 phút, không nhịp giảm.
- Siêu âm: sinh trắc bách phân vị 50, AFI 12 cm.""",
                 )),
            dict(so="1.2", mo_dau="1631", tac_vu="1632-1636", cd_da="1640-1641", xt_da="1642",
                 buoc=["cls", "cd", "xt"],
                 st=dict(
                     cls="""Băng NST:
- Hành chính: thai phụ 28 tuổi, thai 36 tuần; tốc độ giấy 1 cm/phút; ghi 20 phút.
- Nhịp tim thai căn bản 140 lần/phút; dao động nội tại 10–15 nhịp/phút.
- Có 3 nhịp tăng (biên độ ≥ 15 nhịp, kéo dài ≥ 15 giây); không nhịp giảm; không cơn gò.""",
                 )),
        ],
    },
    {
        "id": "qua-ngay",
        "ten": "Quá ngày dự sinh",
        "dong": "1680-1740",
        "vung_de": "1682-1708",
        "dap_an": {
            "hb": "1711-1731",
            "kh": "1732-1735",
            "xt": "1736-1739",
        },
        "de": [
            dict(so="1.1", mo_dau="1686", cls_kq="1687-1688", tac_vu="1689-1691", hb_kq="1692",
                 st=dict(
                     kh="""- Mạch 80 lần/phút, huyết áp 110/70 mmHg, nhiệt độ 37 °C.
- Bề cao tử cung 33 cm; không cơn gò; Leopold: ngôi đầu; tim thai 140 lần/phút.
- Khám trong: cổ tử cung đóng, xóa 30%, mật độ chắc, hướng sau, ngôi cao, ối còn (Bishop 3 điểm).""",
                 )),
            dict(so="1.2", mo_dau="1696", tac_vu="1697-1698", cls_kq="1699", xt_da="1700",
                 st=dict(
                     hb="""- PARA 0000; kinh chót tin cậy, phù hợp siêu âm TCN1.
- Thai máy bình thường; không đau bụng, không ra huyết, không ra nước.""",
                     kh="""- Sinh hiệu ổn; bề cao tử cung 32 cm; không cơn gò; tim thai 144 lần/phút.
- Khám trong: cổ tử cung hé, xóa 40%, mật độ trung bình, ngôi -2, ối còn (Bishop 4 điểm).""",
                 )),
            dict(so="1.3", mo_dau="1704", tac_vu="1706-1707", buoc=["kh", "cls", "cd", "xt"],
                 st=dict(
                     kh="""- Mạch 78 lần/phút, huyết áp 110/70 mmHg.
- Bề cao tử cung 33 cm; không cơn gò; Leopold: ngôi đầu, lưng phải, chưa lọt; tim thai 140 lần/phút, đều.
- Khám trong: cổ tử cung đóng, xóa 30%, chắc, hướng sau, ngôi -3, ối còn; khung chậu bình thường.""",
                     cls="""- Sổ khám thai: tuổi thai chính xác theo siêu âm TCN1, hôm nay tròn 40 tuần.
- NST: có đáp ứng. Siêu âm: sinh trắc bách phân vị 50, AFI 9 cm.""",
                 )),
        ],
    },
]

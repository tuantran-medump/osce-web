"""Chương 4: Nửa sau thai kì."""

DA_NBN = {"kh": "3336-3343", "cd": "3344", "xt": "3345-3356"}

TRAM = [
    {
        "id": "dtd",
        "ten": "Đái tháo đường thai kì",
        "dong": "1743-1871",
        "ly_thuyet": "1745-1754",
        "vung_de": "1756-1786",
        "buoc": ["hb", "cls", "cd", "xt"],
        "dap_an": {
            "hb": "1791-1799,1825-1832",
            "xt": "1801-1821,1834-1856,1858-1870",
        },
        "de": [
            dict(so="2.1", mo_dau="1760", tac_vu="1761,1764,1767", cd_da="1763,1766", xt_da="1768",
                 buoc=["cls", "cd", "xt"],
                 dap_an={"cls": "", "xt": "1834-1856"},
                 st=dict(
                     cls="""Sổ khám thai và nhật ký 2 tuần qua:
- Ăn 6 bữa/ngày (3 chính, 3 phụ), cách nhau 3–4 giờ; bữa sáng ít tinh bột (bánh mì đen, trứng); có bữa nhẹ trước khi ngủ (sữa không đường); dùng gạo lứt, nhiều rau, đủ nhóm chất.
- Đi bộ 30 phút mỗi ngày.
- Đường huyết mao mạch: đói 85–92 mg/dL; 2 giờ sau ăn 135–150 mg/dL (đa số > 120 mg/dL).
- Siêu âm: EFW bách phân vị 40 lúc 28 tuần, bách phân vị 80 hôm nay (32 tuần).""",
                 )),
            dict(so="2.2", mo_dau="1772", cd_da="1773",
                 dap_an={"hb": "1825-1832", "xt": "1834-1856"},
                 st=dict(
                     hb="""- Chị 32 tuổi, PARA 1001, thai 30 tuần.
- Nghiệm pháp dung nạp đường lúc 26 tuần dương tính, đang thực hiện tiết chế 3 tuần; tuân thủ ăn uống và tập luyện.""",
                     cls="""- Đường huyết hôm nay: đói 102 mg/dL, 2 giờ sau ăn 160 mg/dL.
- Nhật ký bữa ăn: chia 6 bữa, bữa sáng ít tinh bột, chọn tinh bột tải đường thấp, nhiều rau; vận động 30 phút mỗi ngày.
- Nhật ký đường huyết: đói 98–105 mg/dL; 2 giờ sau ăn 145–165 mg/dL.""",
                 )),
            dict(so="2.3", mo_dau="1783", tac_vu="1784", hb_da="1785",
                 dap_an={"hb": "1791-1799", "xt": "1801-1821"},
                 st=dict(
                     hb="""- PARA 1001: năm 2021 mổ lấy thai lúc 39 tuần vì kẹt vai khi sinh, bé nặng 4.100 g; thai kỳ đó bị đái tháo đường thai kỳ phải tiêm insulin; sau sinh xét nghiệm lại bình thường.
- Kinh trước đây thưa 40–60 ngày, được chẩn đoán hội chứng buồng trứng đa nang.
- Cao 155 cm, nặng 68 kg trước mang thai (BMI ≈ 28,3 kg/m²). Mẹ ruột bị đái tháo đường type 2.
- Hiện không khát nhiều, không tiểu nhiều.""",
                     cls="- Sổ khám thai: đã khám 3 lần, các tầm soát bình thường, siêu âm chưa thấy bất thường; đường huyết đói hôm nay 88 mg/dL.",
                 )),
            dict(so="TH1", dong="1789", ten="Tình huống 1: OGTT (+) dương, tư vấn MNT", nguon_de="Tình huống trong tài liệu",
                 dap_an={"hb": "1791-1799", "xt": "1801-1821"},
                 st=dict(
                     mo_dau="Thai phụ 30 tuổi, PARA 0000, thai 26 tuần, đến nhận kết quả nghiệm pháp dung nạp 75 g glucose làm tuần trước.",
                     hb="""- Kinh trước đây đều; không hội chứng buồng trứng đa nang; chưa từng được chẩn đoán đái tháo đường.
- Ba ruột bị đái tháo đường type 2. BMI trước mang thai 24 kg/m².
- Nhân viên văn phòng, hay ăn sáng phở, bún, uống trà sữa buổi chiều.""",
                     cls="""- OGTT 75 g (24 tuần 6 ngày): đói 95 mg/dL, 1 giờ 185 mg/dL, 2 giờ 150 mg/dL.
- Sổ khám thai: tầm soát TCN1 và siêu âm hình thái bình thường; sinh trắc bách phân vị 60; AFI 14 cm.""",
                 )),
            dict(so="TH2", dong="1823", ten="Tình huống 2: Tư vấn điều chỉnh MNT", nguon_de="Tình huống trong tài liệu",
                 dap_an={"hb": "1825-1832", "xt": "1834-1856"},
                 st=dict(
                     mo_dau="Thai phụ 29 tuổi, thai 30 tuần, được chẩn đoán đái tháo đường thai kỳ lúc 26 tuần, đang tự thực hiện tiết chế, tái khám sau 2 tuần.",
                     hb="""- Giáo viên, dạy từ 7 giờ sáng nên ăn sáng nhanh ở hàng quán.
- Có ghi nhật ký bữa ăn và đường huyết, mang theo.""",
                     cls="""- Nhật ký bữa ăn: 3 bữa chính, bữa tối lúc 18 giờ, không ăn khuya; bữa sáng nui hoặc phở bò; trưa 2 chén cơm trắng.
- Nhật ký đường huyết: đói 65–70 mg/dL; 2 giờ sau ăn sáng 160–180 mg/dL; 2 giờ sau ăn trưa 150 mg/dL.""",
                 )),
            dict(so="TH3", dong="1858", ten="Tình huống 3: OGTT (-), xem sổ khám thai thấy bất thường ở TCN 3",
                 nguon_de="Tình huống trong tài liệu",
                 dap_an={"hb": "1791-1799", "cd": "1858-1866", "xt": "1867-1870"},
                 st=dict(
                     mo_dau="Thai phụ 33 tuổi, PARA 1001, thai 34 tuần, nghiệm pháp dung nạp đường lúc 25 tuần âm tính, đến khám thai định kỳ.",
                     hb="- Không khát nhiều, không tiểu nhiều; gần đây ăn nhiều trái cây ngọt, uống nước mía hằng ngày.",
                     cls="""- Sổ khám thai: BMI trước mang thai 23 kg/m²; tháng gần đây tăng 4 kg (tổng tăng 15 kg).
- Siêu âm hôm nay: EFW bách phân vị 90, AFI 26 cm, không thấy bất thường cấu trúc đường tiêu hóa.
- Đường huyết đói hôm nay 100 mg/dL.""",
                 )),
        ],
    },
    {
        "id": "tsg",
        "ten": "Tăng huyết áp – tiền sản giật",
        "dong": "1872-2094",
        "ly_thuyet": "1874-1881",
        "vung_de": "1883-1976",
        "dap_an": {
            "hb": "1981-1995",
            "kh": "1997-2004",
            "cls": "2006-2019",
            "xt": "2021-2038,2042-2075,2077-2089",
        },
        "de": [
            dict(so="2.1", mo_dau="1887", cls_kq="1889,1891,1893,1895",
                 dap_an={"xt": "2021-2038"},
                 st=dict(
                     hb="""- Chị Nguyễn Thị An, sinh năm 1987, buôn bán nhỏ, PARA 0000, thai 30 tuần.
- Không nhức đầu, không nhìn mờ, không khó thở, không đau thượng vị, không tiểu ít.
- Chưa từng tăng huyết áp; không đái tháo đường, lupus, bệnh thận; gia đình không ai bị tiền sản giật.""",
                     kh="""- Tỉnh; huyết áp đo lại sau nghỉ 15 phút 150/90 mmHg; mạch 84 lần/phút.
- Phù 2 chân (+); phổi không ran; không vàng da, không ban xuất huyết; phản xạ gân xương bình thường.
- Bề cao tử cung 26 cm, tim thai 140 lần/phút, không cơn gò.""",
                 )),
            dict(so="2.2", mo_dau="1899", tac_vu="1900-1902", kh_kq="1903,1912", hb_da="1909", hb_kq="1910-1911",
                 cd_da="1913-1914", xt_da="1916-1919",
                 dap_an={"xt": "2021-2038"},
                 st=dict(
                     hb="""- PARA 0000, thai 28 tuần, thai tự nhiên.
- Không đau đầu, không chóng mặt, không nhìn mờ, không đau bụng, không tiểu ít, không khó thở.
- Phù chân xuất hiện khoảng 2 tuần nay.""",
                     kh="""- Huyết áp đo lại 150/90 mmHg; mạch 80 lần/phút.
- Phù mềm 2 cẳng chân; phổi trong; phản xạ gân xương bình thường.
- Bề cao tử cung 24 cm; không cơn gò.""",
                     cls="- Nếu đề nghị xét nghiệm: thai phụ cho biết 2 tiếng nữa mới có kết quả (trong trạm chưa có kết quả).",
                 )),
            dict(so="2.3", tac_vu="1923-1926", hb_da="1930", cd_da="1931", buoc=["hb", "cd"],
                 st=dict(
                     mo_dau="Thai phụ đến khám vì đo thấy tăng huyết áp.",
                     hb="""- Chị 34 tuổi, PARA 1001, thai 32 tuần.
- Tăng huyết áp mạn phát hiện 3 năm, đang uống captopril 25 mg × 2 lần/ngày (vẫn uống khi có thai).
- Thai kỳ trước chấm dứt lúc 36 tuần vì tiền sản giật nặng.
- Không đau đầu, không nhìn mờ, không đau ngực, không khó thở, không đau thượng vị, không tiểu ít.
- Sổ khám thai: huyết áp trước tuần 20 khoảng 130/80 mmHg, sau tuần 20 khoảng 150/90 mmHg; đạm niệu âm tính ở mọi lần khám.""",
                 )),
            dict(so="2.4", mo_dau="1935", tac_vu="1936-1938", buoc=["cd", "xt"],
                 dap_an={"xt": "2042-2075"}),
            dict(so="2.5", mo_dau="1942", tac_vu="1944-1945", cls_kq="1946-1952",
                 cd_da="1956", xt_da="1955,1957-1959", buoc=["cls", "cd", "xt"],
                 dap_an={"xt": "2042-2075"}),
            dict(so="2.6", mo_dau="1969", tac_vu="1970", hb_da="1973", cd_da="1974",
                 buoc=["hb", "kh", "cd", "xt"],
                 st=dict(
                     hb="""- Chị 26 tuổi, PARA 1001, thai 30 tuần.
- Thai kỳ trước (2022) bị tiền sản giật; sau sinh huyết áp vẫn cao, được chẩn đoán tăng huyết áp mạn, đang uống nifedipine 20 mg × 2 lần/ngày (có mang theo thuốc).
- Không đau đầu, không nhìn mờ, không đau thượng vị, không khó thở, không tiểu ít.
- Sổ khám thai: huyết áp mỗi lần khám 140–150/90–95 mmHg; đạm niệu âm tính mỗi lần.""",
                     kh="""- Huyết áp 145/95 mmHg, mạch 82 lần/phút; không phù; phản xạ gân xương bình thường.
- Bề cao tử cung 27 cm, tim thai 140 lần/phút.""",
                     xt_de="Thai phụ hỏi: \"Lần này tôi có bị tiền sản giật lại không? Tôi có cần đổi thuốc huyết áp không?\"",
                 )),
            dict(so="TH1", dong="1979", ten="Tình huống 1: Tiền sản giật chưa có dấu hiệu nặng",
                 nguon_de="Tình huống trong tài liệu", dap_an={"xt": "2021-2038"},
                 st=dict(
                     mo_dau="Thai phụ 28 tuổi, PARA 0000, thai 32 tuần, đến khám thai định kỳ, đo huyết áp 145/95 mmHg.",
                     hb="""- Lần đầu phát hiện tăng huyết áp; huyết áp trước tuần 20 khoảng 110/70 mmHg.
- Không đau đầu, không nhìn mờ, không đau ngực, không khó thở, không đau thượng vị, không tiểu ít.
- Không đái tháo đường, lupus, bệnh thận. Mẹ ruột từng bị tiền sản giật.""",
                     kh="""- Huyết áp đo lại sau nghỉ 15 phút 145/95 mmHg; mạch 82 lần/phút; tỉnh táo.
- Phù nhẹ 2 chân; phổi trong; không vàng da, không ban xuất huyết; phản xạ gân xương bình thường.
- Bề cao tử cung 30 cm, tim thai 140 lần/phút, không cơn gò.""",
                     cls="""- TPTNT: protein (++); tỉ số protein/creatinine niệu 0,5.
- AST 25 U/L, ALT 22 U/L; LDH 300 U/L; bilirubin bình thường; creatinine 0,7 mg/dL; acid uric 5 mg/dL; tiểu cầu 220 K/µL; Hb 12 g/dL.
- NST có đáp ứng; siêu âm: sinh trắc bách phân vị 40, AFI 11 cm; Doppler động mạch rốn bình thường.""",
                 )),
            dict(so="TH2", dong="2040", ten="Tình huống 2: Tiền sản giật có dấu hiệu nặng",
                 nguon_de="Tình huống trong tài liệu", dap_an={"xt": "2042-2075"},
                 st=dict(
                     mo_dau="Thai phụ 30 tuổi, PARA 0000, thai 33 tuần, đến khám vì nhức đầu 1 ngày nay, đo huyết áp 165/110 mmHg.",
                     hb="""- Nhức đầu vùng trán từ hôm qua, uống paracetamol không đỡ; có lúc nhìn mờ thoáng qua.
- Không đau thượng vị, không khó thở, không tiểu ít. Huyết áp các lần khám trước tuần 20 bình thường.""",
                     kh="""- Huyết áp đo lại sau 15 phút 165/110 mmHg; mạch 90 lần/phút; tỉnh.
- Phù 2 chân; phổi không ran; phản xạ gân xương tăng nhẹ.
- Bề cao tử cung 30 cm, tim thai 145 lần/phút, không cơn gò.""",
                     cls="""- TPTNT: protein (+++).
- Tiểu cầu 160 K/µL; AST 45 U/L, ALT 40 U/L; creatinine 0,9 mg/dL; LDH 400 U/L.
- NST có đáp ứng; siêu âm: sinh trắc bách phân vị 25, AFI 9 cm.""",
                 )),
            dict(so="TH3", dong="2077", ten="Tình huống 3: Hội chứng HELLP",
                 nguon_de="Tình huống trong tài liệu", dap_an={"xt": "2077-2089"},
                 st=dict(
                     mo_dau="Thai phụ 34 tuần, PARA 0000, nhập cấp cứu vì đau thượng vị và buồn nôn, huyết áp 160/105 mmHg.",
                     hb="""- Đau thượng vị 6 giờ nay, buồn nôn, nhức đầu; không co giật.
- Huyết áp trước đây bình thường; không bệnh nội khoa.""",
                     kh="""- Huyết áp 160/105 mmHg, mạch 96 lần/phút; vàng mắt nhẹ; ấn đau hạ sườn phải.
- Phù 2 chân; phản xạ gân xương tăng.
- Bề cao tử cung 31 cm, tim thai 140 lần/phút, không cơn gò; cổ tử cung đóng.""",
                     cls="""- Tiểu cầu 70 K/µL; AST 180 U/L, ALT 150 U/L; LDH 850 U/L; bilirubin toàn phần 1,8 mg/dL; creatinine 1,0 mg/dL; protein niệu (+++).
- CTG nhóm I; siêu âm EFW bách phân vị 20, AFI 8 cm.""",
                 )),
        ],
    },
    {
        "id": "cdsn",
        "ten": "Chuyển dạ sinh non",
        "dong": "2095-2220",
        "ly_thuyet": "2097-2116",
        "vung_de": "2118-2142",
        "dap_an": {
            "hb": "2145-2166",
            "kh": "2168-2172",
            "cls": "2174-2182",
            "xt": "2184-2219",
        },
        "de": [
            dict(so="2.1", tac_vu="2122",
                 st=dict(
                     mo_dau="Thai phụ 26 tuổi, PARA 0000, thai 24 tuần, siêu âm ngả âm đạo đo chiều dài kênh cổ tử cung 24 mm, đến khám.",
                     hb="""- Không đau bụng, không ra huyết, không ra nước âm đạo; không sốt, không tiểu gắt.
- Đơn thai, thai tự nhiên; không tiền căn sinh non, không khoét chóp hay can thiệp cổ tử cung.""",
                     kh="""- Sinh hiệu ổn; bề cao tử cung 22 cm; không cơn gò; tim thai 145 lần/phút.
- Khám mỏ vịt: cổ tử cung đóng, không dịch bất thường, không thấy nước ối chảy.""",
                     cls="- Siêu âm ngả âm đạo: CL 24 mm, lỗ trong cổ tử cung hình chữ T; fFN âm tính; TPTNT bình thường.",
                 )),
            dict(so="2.2", mo_dau="2126", hb_kq="2128-2129", kh_kq="2130", cd_da="2131", cls_kq="2132", xt_da="2133",
                 st=dict(cls="- Siêu âm: ngôi đầu, sinh trắc phù hợp 33 tuần, AFI 12 cm.")),
            dict(so="2.3", mo_dau="2138", tac_vu="2140-2141", buoc=["cd", "xt"], dap_an_tu=DA_NBN),
        ],
    },
    {
        "id": "cl-ngan",
        "ten": "Chiều dài kênh cổ tử cung ngắn",
        "dong": "2221-2302",
        "dap_an": {
            "hb": "2223-2263",
            "kh": "2265-2269",
            "cls": "2271-2278",
            "cd": "2282-2287",
            "xt": "2289-2301",
        },
        "de": [
            dict(so="1", dong="2221", nguon_de="Đề soạn thêm (tài liệu không có đề)", ten="Siêu âm phát hiện CL ngắn",
                 st=dict(
                     mo_dau="Thai phụ 25 tuổi, thai 22 tuần, đến khám vì lần trước siêu âm phát hiện chiều dài kênh cổ tử cung ngắn.",
                     hb="""- PARA 1001: năm 2020 sinh non 34 tuần do chuyển dạ tự nhiên, bé khỏe.
- Lần này đơn thai, tự nhiên; chưa được dự phòng sinh non (chưa đặt progesterone, chưa khâu eo).
- Không đau bụng, không ra huyết, không ra nước; không sốt, không tiểu gắt buốt.
- Không khoét chóp, không u xơ tử cung; không hút thuốc lá.""",
                     kh="""- Tỉnh, sinh hiệu ổn; bề cao tử cung 20 cm; không cơn gò; tim thai 150 lần/phút.
- Khám mỏ vịt: cổ tử cung đóng, dịch âm đạo trắng ít, không thấy nước ối.""",
                     cls="""- Siêu âm ngả âm đạo: thai 22 tuần, sinh trắc phù hợp, ối bình thường, ngôi đầu, nhau mặt trước nhóm I; CL 18 mm, lỗ trong cổ tử cung hình chữ U.
- fFN âm tính; TPTNT bình thường.""",
                 )),
        ],
    },
    {
        "id": "ovn",
        "ten": "Ối vỡ non",
        "dong": "2303-2406",
        "ly_thuyet": "2305-2310",
        "vung_de": "2312-2326",
        "buoc": ["kh", "hb", "cls", "cd", "xt"],
        "dap_an": {
            "kh": "2329-2331,2347-2355",
            "hb": "2333-2345",
            "cls": "2357-2363",
            "cd": "2365-2367",
            "xt": "2369-2405",
        },
        "de": [
            dict(so="2.1", tac_vu="2316", mo_dau="2317", kh_da="2320", buoc=["kh", "cd"],
                 st=dict(
                     mo_dau="Thai phụ 34 tuần đến khám vì ra nước âm đạo từ 3 giờ trước.",
                     kh="""- Mạch 80 lần/phút, huyết áp 110/70 mmHg, nhiệt độ 37 °C.
- Bề cao tử cung 30 cm; không cơn gò; Leopold: ngôi đầu, lưng trái; tim thai 145 lần/phút.
- Khám mỏ vịt: dịch trong chảy ra từ lỗ cổ tử cung khi ho, đọng ở cùng đồ sau; nitrazine test (+); cổ tử cung đóng; không sờ thấy dây rốn.""",
                 )),
            dict(so="2.2",
                 st=dict(
                     mo_dau="Thai phụ 38 tuần, PARA 0000, ối vỡ non lúc 4 giờ sáng (cách nay 6 giờ), chưa chuyển dạ; kết quả cấy GBS lúc 36 tuần dương tính.",
                     kh="""- Tim thai 140 lần/phút; mạch 82 lần/phút, huyết áp 110/70 mmHg, nhiệt độ 37,1 °C.
- Không cơn gò; khám mỏ vịt: nước ối trong chảy ra từ lỗ cổ tử cung; cổ tử cung đóng, Bishop 4 điểm; không sờ thấy dây rốn.""",
                     hb="""- Ra nước ồ ạt lúc 4 giờ sáng khi đang ngủ, nước trong, không mùi, thấm 2 băng vệ sinh, hiện còn rỉ.
- Không sốt, không đau bụng; thai máy tốt. Không dị ứng penicillin.""",
                     cls="""- CTM: bạch cầu 11 K/µL; CRP 5 mg/L.
- Siêu âm: ngôi đầu, AFI 6 cm, sinh trắc bách phân vị 50. NST có đáp ứng, không cơn gò.
- Cấy GBS (36 tuần): dương tính.""",
                 )),
        ],
    },
]

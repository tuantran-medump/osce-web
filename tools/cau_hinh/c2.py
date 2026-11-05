"""Chương 2: Nửa đầu thai kì."""

TRAM = [
    {
        "id": "rubella",
        "ten": "Rubella",
        "dong": "512-674",
        "ly_thuyet": "514-518",
        "vung_de": "520-550",
        "buoc": ["hb", "cls", "cd", "xt"],
        "dap_an": {
            "hb": "553-568",
            "cd": "610-653",
            "xt": "570-583,655-673",
        },
        "de": [
            dict(so="2.1", bo_qua="Tiêu đề trống; trùng đề \"Y20 – đợt 2: FGR sớm do Rubella\" có nội dung ở trạm FGR (đề 3.1)"),
            dict(so="2.2", bo_qua="Tiêu đề trống, tài liệu không có nội dung"),
            dict(so="2.3", hb_kq="528", cd_da="529", xt_da="530-531",
                 st=dict(
                     mo_dau="Thai phụ 26 tuổi, PARA 0000, thai 6 tuần, đến khám thai, mang theo kết quả xét nghiệm Rubella.",
                     cls="- Rubella IgG (+), IgM (−) (xét nghiệm lúc thai 6 tuần).",
                     xt_de="Thai phụ hỏi: \"Tại sao tôi chưa mắc, chưa tiêm ngừa mà vẫn có miễn dịch?\"",
                 )),
            dict(so="2.4", mo_dau="535", buoc=["cls", "cd", "xt"],
                 st=dict(
                     cls="""- Thai 7 tuần (kinh chót tin cậy, phù hợp siêu âm).
- Rubella IgM (+), IgG (+).
- Thai phụ không sốt, không phát ban, không đau khớp; chưa từng tiêm ngừa Rubella; không rõ tiếp xúc người bệnh.""",
                 )),
            dict(so="2.5", mo_dau="539", tac_vu="541-543", hb_da="544", hb_kq="545", xt_da="548", cd_da="549",
                 st=dict(
                     hb="""- Chị 28 tuổi, nhân viên văn phòng, PARA 0000, thai tự nhiên.
- Sáu tuần nay không sốt, không phát ban, không đau khớp; gia đình không ai bị Rubella.""",
                     cls="""- Sổ khám thai: kinh chót tin cậy (kinh đều 28 ngày), siêu âm hôm nay CRL phù hợp tuổi thai 6 tuần.
- Rubella IgM (−), IgG (+) (lấy máu lúc thai 6 tuần).""",
                 )),
            dict(so="TH-A", dong="587", mo_dau="587",
                 ten="Tình huống: Tại sao phải xét nghiệm Rubella khi đã tiêm ngừa?",
                 nguon_de="Tình huống trong tài liệu",
                 dap_an={"cd": "", "xt": "588-601"},
                 st=dict(
                     hb="""- Chị 25 tuổi, PARA 0000, thai 8 tuần, lần khám thai đầu.
- Khoảng 6 tháng trước khi có thai có tiêm 1 mũi vaccine sởi – quai bị – rubella (MMR) ở phòng tiêm chủng tư nhân, không còn giữ giấy xác nhận.
- Chưa từng được chẩn đoán Rubella; gần đây không sốt, phát ban, đau khớp; không tiếp xúc người bệnh.""",
                     cls="- Nếu đề nghị: Rubella IgG (+), IgM (−).",
                 )),
            dict(so="TH-B", dong="603", mo_dau="603",
                 ten="Tình huống: Kết quả huyết thanh tầm soát Rubella đầu thai kỳ bất thường",
                 nguon_de="Tình huống trong tài liệu",
                 dap_an={"hb": "553-568,604-609"},
                 st=dict(
                     hb="""- Chị 30 tuổi, PARA 1001, thai 10 tuần (kinh chót tin cậy, phù hợp siêu âm CRL lúc 7 tuần).
- Khoảng 2 tuần trước sốt nhẹ, nổi ban đỏ ở mặt lan xuống thân trong 3 ngày, đau các khớp nhỏ bàn tay.
- Con lớn 4 tuổi đi mẫu giáo, lớp có nhiều bé bị "sởi Đức".
- Chưa từng tiêm ngừa Rubella; thai kỳ trước không xét nghiệm Rubella.""",
                     cls="- Rubella IgM (+), IgG (+) (lấy máu hôm qua, thai 9 tuần 6 ngày).",
                 )),
        ],
    },
    {
        "id": "thieu-mau",
        "ten": "Thiếu máu – Thalassemia",
        "dong": "675-818",
        "ly_thuyet": "677-688",
        "vung_de": "690-764",
        "dap_an": {
            "hb": "767-775",
            "kh": "776",
            "cd": "778-783",
            "xt": "785-817",
        },
        "de": [
            dict(so="2.1", mo_dau="694", cls_kq="695-701,703,705", cd_da="702", xt_da="706-707",
                 st=dict(
                     hb="""- Chị 27 tuổi, PARA 0000, thai 13 tuần, đến khám định kỳ.
- Không mệt, không chóng mặt, không chảy máu chân răng, không đi cầu ra máu.
- Chưa từng được chẩn đoán thiếu máu; ăn uống bình thường, có ăn thịt cá.
- Gia đình và chồng: không ai được chẩn đoán thiếu máu (chưa từng xét nghiệm).""",
                     kh="- Da niêm hồng nhạt, không vàng da; mạch 84 lần/phút, huyết áp 110/70 mmHg; gan lách không sờ chạm.",
                 )),
            dict(so="2.2",
                 st=dict(
                     mo_dau="Thai phụ 26 tuổi, PARA 0000, thai 9 tuần, đã được chẩn đoán α-thalassemia (dị hợp tử SEA) trước khi mang thai, đến khám để được tư vấn kế hoạch quản lý thai kỳ.",
                     hb="""- Chẩn đoán α-thalassemia dị hợp tử SEA năm 2022 qua điện di Hb và xét nghiệm gen khi khám tiền hôn nhân.
- Chưa từng truyền máu; không mệt, không chóng mặt.
- Chồng 29 tuổi, chưa từng xét nghiệm máu; gia đình chồng không rõ có ai thiếu máu.""",
                     kh="- Da niêm hồng nhạt, không vàng da, gan lách không to; sinh hiệu ổn.",
                     cls="""- Huyết đồ thai phụ: Hb 10,8 g/dL, MCV 68 fL, MCH 21 pg; ferritin 120 ng/mL.
- Nếu đề nghị huyết đồ chồng: Hb 14,2 g/dL, MCV 66 fL, MCH 21 pg, ferritin bình thường.
- Nếu đề nghị xét nghiệm gen chồng: dị hợp tử SEA.""",
                 )),
            dict(so="2.3", mo_dau="713", hb_kq="715,717-719", cd_da="716", xt_da="720-723",
                 st=dict(
                     kh="- Da xanh, niêm nhạt nhẹ, không vàng da; mạch 88 lần/phút, huyết áp 100/60 mmHg; gan lách không sờ chạm.",
                     cls="- Huyết đồ: Hb 9,8 g/dL, MCV 72 fL, MCH 23 pg; ferritin 12 ng/mL.",
                 )),
            dict(so="2.4", mo_dau="727", tac_vu="728-731,733", hb_kq="734-737",
                 buoc=["hb", "cls", "cd", "xt"],
                 st=dict(
                     cls="""- Siêu âm hôm nay: một thai trong tử cung, CRL 17 mm (tương ứng 8 tuần), có tim thai.
- Kết quả năm 2019 (chồng cũ): điện di Hb và xét nghiệm gen – thai phụ và chồng cũ đều dị hợp tử SEA.
- Huyết đồ chồng hiện tại (mang theo): Hb 13,9 g/dL, MCV 64 fL, MCH 20 pg, ferritin bình thường; chưa làm xét nghiệm gen.""",
                 )),
            dict(so="2.5", cd_da="743-745", hb_da="746-749", xt_da="750-763",
                 st=dict(
                     mo_dau="Chị Mai Phương 28 tuổi, PARA 0000, thai 12 tuần, đến khám định kỳ; xét nghiệm thường quy cho thấy thiếu máu.",
                     hb="""- Mệt, hay chóng mặt khi đứng dậy khoảng 1 tháng nay.
- Không vàng da, vàng mắt; không tiểu sẫm màu, không đau hông lưng; không đi tiêu phân đen.
- Kiêng thịt đỏ vì sợ tăng cân, ít ăn rau xanh.""",
                     kh="- Da xanh, niêm nhạt, không vàng da; mạch 90 lần/phút, huyết áp 110/70 mmHg; gan lách không to.",
                     cls="- Huyết đồ: Hb 9,2 g/dL, MCV 74 fL, MCH 24 pg; ferritin 10 ng/mL.",
                 )),
        ],
    },
    {
        "id": "viem-gan-b",
        "ten": "Viêm gan B",
        "dong": "819-924",
        "ly_thuyet": "821-833",
        "vung_de": "835-863",
        "buoc": ["hb", "cls", "cd", "xt"],
        "dap_an": {
            "hb": "866-874",
            "cls": "893-895",
            "cd": "897-911",
            "xt": "876-887,889-891,913-923",
        },
        "de": [
            dict(so="2.1", tac_vu="839", cls_kq="840-841,845", xt_de="843", xt_da="842,844,846-848",
                 st=dict(
                     mo_dau="Thai phụ 27 tuổi, PARA 0000, thai 9 tuần, đến khám, mang theo các kết quả xét nghiệm làm lúc thai 8 tuần, hỏi kết quả có gì bất thường không.",
                     hb="""- Không mệt, không vàng da, không đau hạ sườn phải, không sốt.
- Chưa từng biết mình nhiễm viêm gan B, chưa tiêm ngừa viêm gan B.
- Mẹ ruột mang HBsAg (+); không truyền máu, không xăm mình.""",
                 )),
            dict(so="2.2", mo_dau="853", tac_vu="854-856", hb_kq="857", xt_da="858",
                 st=dict(
                     cls="""- Giấy xét nghiệm trước tiêm (2 tháng rưỡi trước): HBsAg (−), anti-HBs (−).
- Giấy tiêm ngừa: vaccine viêm gan B mũi 1 và mũi 2 (mũi 2 cách hôm nay 2 tháng).
- Siêu âm hôm nay: một thai trong tử cung, CRL 6 mm (tương ứng 6 tuần), có tim thai.""",
                 )),
        ],
    },
    {
        "id": "giang-mai",
        "ten": "Giang mai",
        "dong": "925-1011",
        "ly_thuyet": "927-931",
        "vung_de": "933-949",
        "dap_an": {
            "hb": "952-964",
            "kh": "965",
            "cd": "976-1000",
            "xt": "967-974,1002-1010",
        },
        "de": [
            dict(so="2.1", mo_dau="937", dap_an={"cd": "976-984"},
                 st=dict(
                     hb="""- Chị 25 tuổi, PARA 0000, thai 14 tuần (kinh chót tin cậy). Xét nghiệm tầm soát lần khám thai đầu: RPR (+).
- Không săng, không phát ban, không sốt, không nổi hạch.
- Chưa từng xét nghiệm hay điều trị giang mai.
- Chồng là tài xế đường dài; không dùng bao cao su; chị không biết chồng có bệnh không.
- Không dị ứng penicillin.""",
                     kh="- Không thấy săng ở âm hộ, âm đạo, cổ tử cung; không phát ban; hạch bẹn không to.",
                     cls="- Nếu đề nghị: TPHA (+); RPR định lượng 1:16.",
                 )),
            dict(so="2.2", mo_dau="941-943", tac_vu="947-948", dap_an={"cd": "990-993"},
                 st=dict(
                     hb="""- Thai hiện tại 20 tuần (theo giấy tờ khám thai).
- Không săng, không phát ban; chồng đi làm ăn xa, ít về nhà.
- Không dị ứng thuốc.
- Nhà cách trạm y tế xã khoảng 15 km, đi lại khó khăn.""",
                     kh="- Không thấy săng ở âm hộ, âm đạo, cổ tử cung; không phát ban.",
                     cls="- Chỉ có kết quả Rapid syphilis test (+) của đoàn tình nguyện; tại địa phương không làm được VDRL, TPHA.",
                 )),
            dict(so="TH1", dong="978", ten="Tình huống 1: VDRL +", nguon_de="Tình huống trong tài liệu",
                 dap_an={"cd": "978-984"},
                 st=dict(
                     mo_dau="Thai phụ 24 tuổi, PARA 0000, thai 16 tuần, đến khám vì xét nghiệm VDRL ở lần khám thai đầu dương tính.",
                     hb="""- Không săng, không phát ban, không sốt.
- Chưa từng xét nghiệm hay điều trị giang mai; chồng chưa từng xét nghiệm.
- Không dị ứng penicillin.""",
                     kh="- Không thấy săng ở âm hộ, âm đạo, cổ tử cung; hạch bẹn không to.",
                     cls="- Nếu đề nghị: TPHA (+); VDRL định lượng 1:8.",
                 )),
            dict(so="TH2", dong="985", ten="Tình huống 2: VDRL –", nguon_de="Tình huống trong tài liệu",
                 dap_an={"cd": "985-988"},
                 st=dict(
                     mo_dau="Thai phụ 26 tuổi, PARA 1001, thai 20 tuần, đến khám vì chồng vừa được chẩn đoán giang mai; xét nghiệm VDRL của chị làm hôm qua âm tính.",
                     hb="""- Chồng được chẩn đoán giang mai 1 tuần trước, đang điều trị.
- Vợ chồng quan hệ không dùng bao cao su.
- Chị không có săng, không phát ban, không sốt.""",
                     kh="- Không thấy săng ở âm hộ, âm đạo, cổ tử cung; không phát ban.",
                     cls="- VDRL (−). Siêu âm hôm nay: thai 20 tuần, sinh trắc bách phân vị 50, chưa thấy phù nhau thai.",
                 )),
            dict(so="TH3", dong="990", ten="Tình huống 3: RST", nguon_de="Tình huống trong tài liệu",
                 dap_an={"cd": "990-993"},
                 st=dict(
                     mo_dau="Thai phụ 22 tuổi, thai 18 tuần, sống ở vùng sâu, đến trạm y tế xã khám thai; Rapid syphilis test tại trạm dương tính.",
                     hb="""- Không săng, không phát ban.
- Đi khám thai không đều vì nhà xa, phải đi đò.
- Không dị ứng thuốc.""",
                     kh="- Không thấy săng ở âm hộ, âm đạo, cổ tử cung.",
                     cls="- RST (+). Tại trạm không có VDRL, TPHA.",
                 )),
            dict(so="TH4", dong="995", ten="Tình huống 4: TPPA (+)", nguon_de="Tình huống trong tài liệu",
                 dap_an={"cd": "995-1000"},
                 st=dict(
                     mo_dau="Thai phụ 28 tuổi, PARA 0000, thai 12 tuần, xét nghiệm tầm soát giang mai TPPA (+).",
                     hb="""- Không săng, không phát ban; không nhớ từng có triệu chứng.
- Chưa từng điều trị giang mai.
- Không dị ứng penicillin.""",
                     kh="- Không thấy săng ở âm hộ, âm đạo, cổ tử cung; không phát ban.",
                     cls="- Nếu đề nghị: VDRL (+) 1:4.",
                 )),
        ],
    },
    {
        "id": "lech-boi",
        "ten": "Tầm soát lệch bội",
        "dong": "1012-1136",
        "vung_de": "1016-1074",
        "buoc": ["hb", "cls", "cd", "xt"],
        "dap_an": {
            "hb": "1077-1085",
            "xt": "1087-1135",
        },
        "de": [
            dict(so="2.1", mo_dau="1020", cls_kq="1022", xt_da="1023,1026",
                 dap_an={"xt": "1087-1094,1118-1127"},
                 st=dict(
                     hb="""- Chị 29 tuổi, PARA 0000, thai 12 tuần 5 ngày (kinh chót tin cậy, khớp siêu âm CRL), thai tự nhiên.
- Chưa từng sinh con dị tật; gia đình hai bên không ai bị Down hay dị tật.
- Chồng khỏe, chưa từng xét nghiệm NST. Không dùng thuốc.
- Nếu thai bất thường nặng sẽ cân nhắc chấm dứt thai kỳ; tôn giáo không ảnh hưởng quyết định.""",
                     cls="- Siêu âm hôm nay: CRL 64 mm, NT 3,5 mm, tim thai 158 lần/phút, chưa thấy bất thường cấu trúc khác. Chưa làm double test.",
                     xt_de="Thai phụ hỏi: \"NT là gì? NT dày có ý nghĩa gì?\"",
                 )),
            dict(so="2.2", bo_qua="Trùng đề Thiếu máu 2.1 (Y19 – đợt 1: Thiếu máu + Lệch bội bình thường), tiêu đề trống"),
            dict(so="2.3", mo_dau="1032", tac_vu="1033-1035", hb_da="1036",
                 dap_an={"xt": "1087-1094,1098-1116"},
                 st=dict(
                     hb="""- Chị 30 tuổi, PARA 0000, thai 8 tuần, tự nhiên.
- Em trai ruột 16 tuổi bị hội chứng Down (được chẩn đoán lúc sinh, nhiễm sắc thể đồ: trisomy 21 thuần); mẹ chị sinh em trai năm 44 tuổi. Gia đình nội ngoại không ai khác bị.
- Chồng 32 tuổi, khỏe, chưa từng xét nghiệm NST. Chưa từng sinh con dị tật.
- Nếu con bị Down sẽ cân nhắc chấm dứt thai kỳ.""",
                     cls="- Siêu âm hôm nay: một thai trong tử cung, CRL 16 mm (tương ứng 8 tuần), có tim thai.",
                 )),
            dict(so="2.4", mo_dau="1040", xt_da="1042-1045", buoc=["hb", "cd", "xt"],
                 dap_an={"xt": "1087-1094,1098-1116"},
                 st=dict(
                     hb="""- Chị 25 tuổi, PARA 0000, thai 10 tuần, tự nhiên.
- Chưa từng sinh con lệch bội; gia đình hai bên không ai bị Down.
- Chồng 27 tuổi, khỏe, không biết có chuyển đoạn Robertson.""",
                     xt_de="""Thai phụ hỏi:
1. Tôi còn trẻ, sao phải tầm soát lệch bội?
2. Bây giờ làm xét nghiệm gì để tầm soát?
3. NIPT có giá trị thế nào, tôi có thể chọn không?""",
                 )),
            dict(so="2.5", dap_an={"xt": "1087-1094,1118-1127"},
                 st=dict(
                     mo_dau="Thai phụ 31 tuổi, PARA 1001, thai 13 tuần, đến khám vì siêu âm NT dày; đã làm NIPS cho kết quả nguy cơ thấp, hỏi thai có bình thường không.",
                     hb="""- Thai tự nhiên, kinh chót tin cậy, khớp siêu âm CRL.
- Con đầu 4 tuổi khỏe; gia đình không ai bị dị tật hay Down.
- Không dùng thuốc, không sốt phát ban trong thai kỳ.""",
                     cls="""- Siêu âm: CRL 70 mm, NT 3,9 mm, chưa thấy bất thường cấu trúc khác.
- NIPS: nguy cơ thấp với trisomy 21, 18, 13.""",
                 )),
            dict(so="2.6", dap_an={"xt": "1087-1094,1128-1135"},
                 st=dict(
                     mo_dau="Thai phụ 33 tuổi, thai 12 tuần, có tiền căn sinh con bị hội chứng Down, đến khám tư vấn tầm soát lệch bội.",
                     hb="""- PARA 1001: con đầu 5 tuổi bị hội chứng Down (nhiễm sắc thể đồ: trisomy 21 thuần).
- Thai lần này tự nhiên; chồng 35 tuổi, khỏe.
- Nếu con bị Down, vợ chồng muốn chấm dứt thai kỳ.""",
                     cls="""- Siêu âm: CRL 58 mm, NT 2,6 mm.
- Nếu đề nghị NIPS: nguy cơ cao trisomy 21.""",
                 )),
            dict(so="2.7", mo_dau="1053", buoc=["cls", "cd", "xt"],
                 st=dict(
                     cls="""- Siêu âm hình thái học lúc 20 tuần: một nốt echo sáng 2 mm ở thất trái; không thấy bất thường cấu trúc tim và các cơ quan khác; sinh trắc ở bách phân vị 50.
- Combined test lúc 12 tuần: nguy cơ thấp (T21 1:5.000).""",
                 )),
            dict(so="2.8", mo_dau="1057", tac_vu="1059-1061", hb_da="1063", cls_da="1065-1066", xt_da="1069-1072",
                 dap_an={"xt": "1087-1094,1098-1116"},
                 st=dict(
                     hb="""- Sổ khám thai: PARA 0000; kinh chót và ngày dự sanh theo kinh chót; ghi chú tiền căn: em trai ruột bị bệnh Down.
- Kinh đều 28 ngày, kinh chót tin cậy, không dùng thuốc tránh thai nội tiết.
- Em trai 18 tuổi, được chẩn đoán Down từ nhỏ (mặt dẹt, mắt xếch, chậm phát triển); mẹ sinh em trai năm 40 tuổi. Gia đình nội ngoại không ai khác bị; chồng khỏe.""",
                     cls="- Siêu âm lúc 7 tuần: CRL 10 mm, phù hợp kinh chót. Hôm nay thai 10 tuần.",
                     xt_de="Thai phụ hỏi: \"Em trai tôi bị Down, vậy con của tôi có bị bệnh Down không bác sĩ?\"",
                 )),
        ],
    },
    {
        "id": "hiv",
        "ten": "Xét nghiệm HIV trong thai kỳ",
        "dong": "1137-1147",
        "buoc": ["hb", "xt"],
        "dap_an": {"xt": "1140-1146"},
        "de": [
            dict(so="1", dong="1139", mo_dau="1139", nguon_de="Không ghi năm/đợt",
                 ten="Thai phụ thắc mắc tại sao phải xét nghiệm HIV",
                 st=dict(
                     hb="""- Chị 26 tuổi, PARA 0000, thai 9 tuần, lần khám thai đầu.
- Một vợ một chồng; không truyền máu, không tiêm chích, không xăm mình; chồng khỏe.
- Chưa từng xét nghiệm HIV.""",
                 )),
        ],
    },
    {
        "id": "lich-kham-thai",
        "ten": "Lên lịch khám thai",
        "dong": "1148-1259",
        "buoc": ["hb", "xt"],
        "dap_an": {"xt": "1150-1258"},
        "de": [
            dict(so="1", dong="1148", nguon_de="Đề soạn thêm (tài liệu không có đề)", ten="Lên lịch khám thai",
                 st=dict(
                     mo_dau="Thai phụ 25 tuổi, PARA 0000, thai 8 tuần, vừa siêu âm thấy một thai sống trong tử cung. Chị hỏi: \"Từ giờ đến lúc sinh tôi phải đi khám những lần nào, mỗi lần làm gì?\"",
                     hb="""- Thai tự nhiên, kinh chót tin cậy, phù hợp siêu âm.
- Không bệnh nội khoa, không tiền căn sản phụ khoa đặc biệt; nhà gần bệnh viện, đi khám thuận tiện.""",
                 )),
        ],
    },
]

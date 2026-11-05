"""Chương 6: Cấp cứu sản khoa."""

DA_NTD_TH2 = {"kh": "3233", "cd": "3234", "xt": "3235-3247"}

TRAM = [
    {
        "id": "bhss",
        "ten": "Băng huyết sau sinh",
        "dong": "2734-2813",
        "vung_de": "2736-2744",
        "buoc": ["kh", "cls", "cd", "xt"],
        "dap_an": {
            "kh": "2756-2762",
            "cd": "2764-2766",
            "xt": "2745-2754,2768-2812",
        },
        "de": [
            dict(so="1.1", cd_da="2740,2742", xt_da="2741,2744", xt_de="2743",
                 st=dict(
                     mo_dau="Sản phụ vừa sinh thường được 15 phút, bánh nhau đã sổ. Hộ sinh báo sản phụ chảy máu âm đạo nhiều, không cầm.",
                     kh="""- Túi đo máu: khoảng 700 mL, máu đỏ còn chảy rỉ liên tục.
- Tỉnh, da niêm hồng nhạt; mạch 100 lần/phút, huyết áp 100/60 mmHg.
- Tử cung co hồi tốt, thành khối cầu an toàn.
- Bánh nhau sổ kiểu Duncan, đủ múi, màng đủ; không rách cổ tử cung, âm đạo, tầng sinh môn.""",
                     cls="""- Sổ khám thai: siêu âm ghi nhận nhau bám thấp (nhau loại III).
- Hb trước sinh 12 g/dL, tiểu cầu 250 K/µL, đông máu bình thường.""",
                 )),
        ],
    },
    {
        "id": "tolac",
        "ten": "Tư vấn sinh ngả âm đạo trên vết mổ cũ (TOLAC)",
        "dong": "2814-2978",
        "ly_thuyet": "2816-2857",
        "vung_de": "2859-2885",
        "dap_an": {
            "hb": "2888-2922",
            "kh": "2924-2941",
            "cls": "2943-2946",
            "xt": "2948-2977",
        },
        "de": [
            dict(so="2.1", mo_dau="2863", kh_kq="2864", cls_kq="2865", tac_vu="2866-2867", xt_da="2868",
                 buoc=["kh", "cls", "cd", "xt"], dap_an={"xt": "2950-2971"},
                 st=dict(
                     kh="""- Sinh hiệu ổn. Vết mổ cũ ngang trên vệ lành tốt, ấn không đau, không dính.
- Bề cao tử cung 31 cm; không cơn gò; Leopold: ngôi đầu; tim thai 140 lần/phút.
- Khám trong: cổ tử cung đóng, ối còn; khung chậu bình thường.""",
                     cls="""- Sổ khám thai: thai kỳ nguy cơ thấp, các tầm soát bình thường.
- Siêu âm 39 tuần: ngôi đầu, EFW 3.100 g, AFI 12 cm, nhau mặt sau nhóm I; độ dày đoạn dưới cơ tử cung 3 mm.
- NST có đáp ứng.""",
                 )),
            dict(so="2.2", mo_dau="2872", tac_vu="2873-2875", hb_kq="2879", xt_de="2880,2882", xt_da="2881",
                 buoc=["hb", "cd", "xt"], dap_an={"xt": "2973-2977"},
                 st=dict(
                     hb="""- Chị 33 tuổi, PARA 1001, thai 39 tuần.
- Năm 2020 mổ cấp cứu lúc thai 38 tuần, chị không nhớ rõ lý do.
- Giấy ra viện lần đó (khi được hỏi mượn): "Vỡ tử cung hoàn toàn đoạn dưới – mổ lấy thai, khâu phục hồi tử cung".
- Thai kỳ này khám đều, bình thường; không đau bụng, không ra huyết, không ra nước.""",
                 )),
        ],
    },
    {
        "id": "sa-day-ron",
        "ten": "Sa dây rốn",
        "dong": "2979-3022",
        "ly_thuyet": "2981-2985",
        "vung_de": "2987-3005",
        "buoc": ["kh", "cd", "xt"],
        "dap_an": {"kh": "3008-3013", "xt": "3014-3021"},
        "de": [
            dict(so="2.1", mo_dau="2991", tac_vu="2992-2994",
                 st=dict(
                     kh="""- Tim thai qua Doppler 90 lần/phút, chậm kéo dài.
- Khám trong: sờ thấy quai dây rốn trong âm đạo, còn đập; cổ tử cung mở 3 cm; ối vỡ hoàn toàn, nước ối trong; ngôi đầu cao, độ lọt -3.""",
                 )),
            dict(so="2.2", mo_dau="2998-2999", kh_da="3001,3004", xt_da="3002-3003",
                 st=dict(
                     kh="""- Nhìn thấy dây rốn sa ra ngoài âm hộ, còn đập; tim thai 108 lần/phút.
- Khám trong: cổ tử cung mở 2 cm, xóa 80%; ngôi đầu cao.""",
                 )),
        ],
    },
    {
        "id": "xhad-cap-cuu",
        "ten": "Ra huyết âm đạo nhiều (cấp cứu)",
        "dong": "3023-3064",
        "ly_thuyet": "3025-3031",
        "buoc": ["kh", "hb", "cls", "cd", "xt"],
        "dap_an": {"kh": "3035-3050", "hb": "3051-3063", "cd": "3234", "xt": "3235-3247"},
        "de": [
            dict(so="1", dong="3023", nguon_de="Đề soạn thêm (tài liệu không có đề)",
                 ten="Thai phụ 35 tuần ra huyết âm đạo nhiều",
                 st=dict(
                     mo_dau="Thai phụ 35 tuần được đưa vào phòng cấp cứu vì ra huyết âm đạo đỏ tươi lượng nhiều 1 giờ nay.",
                     kh="""- Mạch 110 lần/phút, huyết áp 90/60 mmHg; da niêm nhạt; ước lượng máu mất khoảng 800 mL.
- Tim thai 150 lần/phút. Tử cung mềm, cơn gò thưa 1–2 cơn/10 phút, không tăng trương lực; bụng không phản ứng.
- Khám mỏ vịt: máu đỏ tươi chảy ra từ lỗ cổ tử cung, cổ tử cung đóng.""",
                     hb="""- Ra huyết đột ngột khi đang ngủ, không đau bụng, không chấn thương.
- Đã 2 lần nhập viện vì ra huyết lúc 30 và 33 tuần.
- PARA 1001: mổ lấy thai năm 2019.
- Siêu âm lúc 32 tuần: nhau tiền đạo trung tâm mặt trước, nghi nhau cài răng lược.""",
                     cls="- Hb 8,5 g/dL, tiểu cầu 220 K/µL, đông máu bình thường, nhóm máu O Rh(+). CTG nhóm I.",
                 )),
        ],
    },
    {
        "id": "ntd",
        "ten": "Nhau tiền đạo",
        "dong": "3065-3248",
        "ly_thuyet": "3148",
        "vung_de": "3069-3145",
        "dap_an": {
            "hb": "3152-3173",
            "kh": "3175-3189",
            "cls": "3191-3194",
            "cd": "3196-3203",
            "xt": "3205-3229",
        },
        "de": [
            dict(so="2.1", mo_dau="3073", tac_vu="3075-3077", cls_da="3079", hb_kq="3081-3082", xt_da="3083", cd_da="3085",
                 st=dict(
                     kh="""- Mạch 84 lần/phút, huyết áp 110/70 mmHg.
- Bề cao tử cung 28 cm; không cơn gò; tim thai 145 lần/phút.
- Khám mỏ vịt: còn ít huyết hồng từ lỗ cổ tử cung, cổ tử cung đóng.""",
                     cls="""- Sổ khám thai: thai 32 tuần, tuổi thai chính xác theo siêu âm TCN1.
- Siêu âm gần nhất: nhau tiền đạo trung tâm, mép dưới bánh nhau phủ qua lỗ trong cổ tử cung.""",
                     xt_de="Thai phụ hỏi: \"Nhau tiền đạo có hết được không bác sĩ?\"",
                 )),
            dict(so="2.2", mo_dau="3089", cls_kq="3090", xt_da="3091", hb_da="3092",
                 st=dict(
                     hb="""- PARA 1001: năm 2021 mổ lấy thai vì ngôi mông, vết mổ ngang đoạn dưới, hậu phẫu không biến chứng.
- Lần này ra huyết lần đầu sáng nay, đỏ tươi, lượng ít, tự cầm; không đau bụng; thai máy tốt.""",
                     kh="""- Sinh hiệu ổn; bề cao tử cung 28 cm; không cơn gò; tim thai 140 lần/phút.
- Khám mỏ vịt: cổ tử cung đóng, không còn ra huyết.""",
                     cls="- CTG nhóm I. Siêu âm hôm nay: nhau tiền đạo trung tâm, sinh trắc phù hợp 32 tuần, AFI 12 cm. Hb 11,5 g/dL.",
                     xt_de="Thai phụ hỏi: \"Tôi từng mổ lấy thai nên lần này mới bị nhau tiền đạo phải không?\"",
                 )),
            dict(so="2.3", mo_dau="3096", tac_vu="3097", cls_da="3100", xt_da="3101", xt_de="3102-3103",
                 st=dict(
                     hb="""- Chị 30 tuổi, PARA 1001 (sinh thường năm 2019), thai 37 tuần.
- Ra huyết âm đạo đỏ tươi từ sáng, lượng ít, hiện còn rỉ; không đau bụng; thai máy tốt.
- Không biết mình có nhau tiền đạo.""",
                     kh="""- Mạch 88 lần/phút, huyết áp 110/70 mmHg; bề cao tử cung 32 cm; cơn gò thưa; tim thai 140 lần/phút.
- Khám mỏ vịt: máu đỏ rỉ ít từ lỗ cổ tử cung, cổ tử cung đóng.""",
                     cls="""- Siêu âm tuần 28 trong sổ: bánh nhau mặt sau, mép dưới phủ qua lỗ trong cổ tử cung.
- Nếu xin xét nghiệm: Hb 11 g/dL, tiểu cầu 230 K/µL, đông máu bình thường; CTG nhóm I.""",
                 )),
            dict(so="2.4", tac_vu="3109", mo_dau="3110", cls_kq="3111", xt_da="3112-3114",
                 st=dict(
                     hb="- Thai 32 tuần, PARA 0000; chưa ra huyết lần nào; không đau bụng, không ra nước; thai máy tốt.",
                     kh="- Sinh hiệu ổn; bề cao tử cung 28 cm; không cơn gò; tim thai 145 lần/phút; khám mỏ vịt: cổ tử cung đóng, không ra huyết.",
                 )),
            dict(so="2.5", buoc=["kh", "cls", "cd", "xt"], dap_an_tu=DA_NTD_TH2,
                 st=dict(
                     mo_dau="Trạm cấp cứu: thai phụ mang thai đủ tháng được đưa vào phòng cấp cứu, ra huyết âm đạo rất nhiều (mô hình đầy máu); có sẵn 1 phiếu siêu âm nhau và 1 sổ khám thai.",
                     kh="""- Mạch 100 lần/phút, huyết áp 110/70 mmHg (chưa sốc).
- Tim thai 140 lần/phút; còn cơn co tử cung 3 cơn/10 phút.
- Khám mỏ vịt: máu đỏ tươi chảy ra từ lỗ cổ tử cung lượng nhiều; cổ tử cung mở 2 cm.""",
                     cls="""- Phiếu siêu âm: nhau tiền đạo trung tâm, không thấy dấu hiệu nhau cài răng lược.
- Sổ khám thai: thai 38 tuần, tuổi thai chính xác.""",
                 )),
            dict(so="2.6", mo_dau="3124", hb_kq="3125", cls_kq="3126",
                 st=dict(
                     hb="""- Chị 32 tuổi, PARA 2002, thai 26 tuần.
- Ra huyết đỏ tươi lượng ít 2 lần từ hôm qua, không đau bụng, không ra nước; thai máy tốt.""",
                     kh="""- Sinh hiệu ổn; bề cao tử cung 24 cm; không cơn gò; tim thai 150 lần/phút.
- Khám mỏ vịt: ít máu đỏ sậm ở âm đạo, cổ tử cung đóng.""",
                 )),
            dict(so="2.7", mo_dau="3130", tac_vu="3132-3133", hb_kq="3134", cls_kq="3135", cd_da="3138", xt_da="3139-3144",
                 buoc=["hb", "cls", "cd", "xt"]),
            dict(so="TH1", dong="3150", ten="Tình huống 1: Tư vấn nhau tiền đạo ra huyết ít/ ổn định – không ra huyết",
                 nguon_de="Tình huống trong tài liệu",
                 st=dict(
                     mo_dau="Thai phụ 31 tuổi, thai 33 tuần, đến khám vì ra huyết âm đạo lượng ít từ tối qua.",
                     hb="""- Ra huyết đỏ tươi khi đang nghỉ, thấm 1 băng vệ sinh, hiện đã ngưng; không đau bụng, không ra nước; thai máy tốt; lần đầu ra huyết.
- PARA 1001: mổ lấy thai năm 2020 vì suy thai.
- Không u xơ tử cung, không hút thuốc lá; không tăng huyết áp, đái tháo đường.""",
                     kh="""- Mạch 82 lần/phút, huyết áp 110/70 mmHg; bề cao tử cung 29 cm; không cơn gò; tim thai 145 lần/phút.
- Khám mỏ vịt: âm đạo ít máu sậm, không còn chảy từ lỗ cổ tử cung, cổ tử cung đóng.""",
                     cls="""- Hb 11,8 g/dL.
- Siêu âm ngả âm đạo: nhau tiền đạo trung tâm mặt trước, phủ lỗ trong cổ tử cung; không thấy khối máu tụ sau nhau; chưa thấy dấu hiệu nhau cài răng lược; sinh trắc phù hợp 33 tuần; AFI 12 cm.""",
                 )),
            dict(so="TH2", dong="3231", ten="Tình huống 2: Nhau tiền đạo ra huyết nhiều",
                 nguon_de="Tình huống trong tài liệu", buoc=["kh", "cls", "cd", "xt"], dap_an_tu=DA_NTD_TH2,
                 st=dict(
                     mo_dau="Thai phụ 35 tuần, đã biết nhau tiền đạo trung tâm, nhập cấp cứu vì ra huyết âm đạo đỏ tươi lượng nhiều.",
                     kh="""- Mạch 120 lần/phút, huyết áp 80/50 mmHg; da niêm nhạt; tim thai 160 lần/phút.
- Khám mỏ vịt: máu đỏ tươi chảy nhiều từ lỗ cổ tử cung.""",
                     cls="- Hb 7,8 g/dL; tiểu cầu 180 K/µL; đông máu bình thường.",
                 )),
        ],
    },
    {
        "id": "dau-bung-tcn3",
        "ten": "Đau bụng 3 tháng cuối (nhau bong non)",
        "dong": "3249-3321",
        "buoc": ["hb", "kh", "cls", "cd", "xt"],
        "dap_an": {},
        "de": [
            dict(so="1", dong="3251-3320", nguon_de="Y18 (Tổng hợp: TNT – tổ 12)",
                 ten="Đau bụng dữ dội ở 3 tháng cuối thai kì",
                 mo_dau="3252-3255", tac_vu="3256",
                 hb_de="3257,3261", hb_da="3258-3259,3262,3269-3275", hb_kq="3260,3263,3265,3267",
                 kh_de="3276", kh_da="3277-3282", kh_kq="3283-3288",
                 cls_de="3289", cls_da="3290", cls_kq="3292",
                 cd_da="3294-3305",
                 xt_de="3306-3307", xt_da="3308-3317"),
        ],
    },
    {
        "id": "nbn",
        "ten": "Nhau bong non",
        "dong": "3322-3359",
        "vung_de": "3326-3332",
        "buoc": ["kh", "cls", "cd", "xt"],
        "dap_an": {"kh": "3335-3343", "cd": "3344", "xt": "3345-3356"},
        "de": [
            dict(so="2.1", mo_dau="3330", cd_da="3331",
                 st=dict(
                     kh="""- Mạch 110 lần/phút, huyết áp 90/60 mmHg; da niêm hồng nhạt.
- Tử cung gò cứng liên tục, ấn đau, không có khoảng nghỉ; bề cao tử cung 32 cm; tim thai 90 lần/phút.
- Ra máu âm đạo đỏ sẫm, không đông.
- Khám trong: cổ tử cung mở 3 cm, ối còn căng, ngôi đầu độ lọt -2, không sa dây rốn.""",
                     cls="""- CTG: tăng trương lực cơ bản, cơn co cường tính 6 cơn/10 phút; nhịp tim thai căn bản 90 lần/phút, dao động nội tại tối thiểu, nhịp giảm kéo dài.
- Sổ khám thai: thai 34 tuần; nhau bám mặt trước đáy tử cung (không nhau tiền đạo).""",
                 )),
        ],
    },
    {
        "id": "vo-tc",
        "ten": "Vỡ tử cung",
        "dong": "3360-3387",
        "buoc": ["kh", "cls", "cd", "xt"],
        "dap_an": {"kh": "3370-3376", "cd": "3377-3380", "xt": "3381-3386"},
        "de": [
            dict(so="1", dong="3366", nguon_de="Không ghi năm/đợt (ảnh đề Trạm 6)", ten="Thai 40 tuần đột ngột đau bụng dữ dội",
                 st=dict(
                     mo_dau="Thai phụ mang thai 40 tuần thì đột ngột đau bụng dữ dội, da xanh, niêm nhạt. Yêu cầu: xử trí (không hỏi bệnh sử, tiền căn). (Chép lại từ ảnh đề trong tài liệu.)",
                     kh="""- Mạch 120 lần/phút, huyết áp 76/55 mmHg; tim thai 86 lần/phút.
- Da xanh, niêm nhạt; bụng chướng, ấn đau khắp bụng, có phản ứng phúc mạc; sờ thấy phần thai ngay dưới da bụng; không còn bắt được cơn gò.
- Khám trong: ra huyết âm đạo ít, ngôi thai cao, đẩy lên dễ.""",
                     cls="- Sổ khám thai: tiền căn mổ lấy thai, vết mổ trên tử cung hình chữ T ngược.",
                 )),
        ],
    },
    {
        "id": "san-giat",
        "ten": "Sản giật – tiền sản giật nặng cấp cứu",
        "dong": "3388-3411",
        "buoc": ["kh", "cls", "cd", "xt"],
        "dap_an": {"xt": "3396-3410"},
        "de": [
            dict(so="1", dong="3392", nguon_de="Không ghi năm/đợt (ảnh đề Trạm 5)",
                 ten="Tiền sản giật dấu hiệu nặng nhập cấp cứu", buoc=["cls", "cd", "xt"],
                 dap_an={"xt": "2077-2089"},
                 st=dict(
                     mo_dau="""Bạn là BS cấp cứu ở BV E, thành phố A. Thai phụ đang nằm cấp cứu, nhập viện với chẩn đoán tiền sản giật có dấu hiệu nặng. Người nhà khai thai phụ nhức đầu và tăng huyết áp nên đi khám ngay. Thai phụ đang được truyền dịch và truyền thuốc.
1. Nhận định tình trạng hiện tại của thai phụ.
2. Tư vấn cách giải quyết và giải đáp thắc mắc cho người nhà thai phụ.
(Trạm không yêu cầu hỏi bệnh sử.) (Chép lại phần đề từ ảnh trong tài liệu.)""",
                     cls="""- Tờ điều trị: thai 34 tuần; huyết áp sau điều trị 150/100 mmHg, mạch 88 lần/phút; đang truyền MgSO4, đã dùng thuốc hạ áp; tỉnh, hết nhức đầu.
- Xét nghiệm: tiểu cầu 85 K/µL; AST 120 U/L, ALT 98 U/L (tăng > 2 lần); bilirubin toàn phần 1,6 mg/dL; LDH 700 U/L; protein niệu (+++).
- CTG mới đo: nhóm I.""",
                     xt_de="""Người nhà hỏi:
1. Em tôi bị gì vậy BS? Tại sao nó lại bị như vậy?
2. Giờ phải giải quyết như thế nào? Có nguy cơ gì cho mẹ và cho bé không?""",
                 )),
            dict(so="2", dong="3388", nguon_de="Đề soạn thêm (tài liệu không có đề sản giật)", ten="Thai phụ co giật",
                 st=dict(
                     mo_dau="Thai phụ 36 tuần đang nằm theo dõi tiền sản giật nặng thì đột ngột co giật toàn thân khoảng 1 phút; người nhà gọi bác sĩ.",
                     kh="""- Thai phụ lơ mơ sau cơn giật, môi tím nhẹ, có đờm dãi; mạch 110 lần/phút, huyết áp 170/115 mmHg, SpO2 90%.
- Tim thai 110–120 lần/phút; tử cung không gò cứng; cổ tử cung đóng.""",
                     cls="- Sau khi ổn định: tiểu cầu 150 K/µL, AST 40 U/L, creatinine 1,0 mg/dL; CTG nhóm II (nhịp giảm kéo dài sau cơn giật, sau đó hồi phục).",
                 )),
        ],
    },
    {
        "id": "kham-chuyen-da",
        "ten": "Khám thai phụ trong chuyển dạ (khám ngoài, khám trong)",
        "dong": "3412-3505",
        "buoc": ["kh", "cd"],
        "dap_an": {"kh": "3427-3505"},
        "de": [
            dict(so="1", dong="3414-3422", nguon_de="Y20 đợt 4", ten="Khám lâm sàng thai phụ 40 tuần chuyển dạ",
                 mo_dau="3415-3416", tac_vu="3417", kh_da="3421", kh_kq="3422",
                 st=dict(
                     kh="""- Sinh hiệu (điều dưỡng đã đo): mạch 82 lần/phút, huyết áp 120/70 mmHg, nhiệt độ 37 °C.
- Bề cao tử cung 32 cm; Leopold: ngôi đầu, lưng trái, chưa lọt (4/5).
- Tim thai (giảng viên đưa): 140 lần/phút, đều; cơn gò 3 cơn/10 phút, mỗi cơn 35 giây.""",
                 )),
            dict(so="2", dong="3423-3425", nguon_de="Y20 đợt 1", ten="Khám thai phụ 37 tuần chảy nước ối",
                 mo_dau="3424", kh_da="3425",
                 st=dict(
                     kh="""- Bề cao tử cung 31 cm; Leopold: ngôi đầu, lưng phải, lọt 3/5; tim thai 145 lần/phút; cơn gò 3 cơn/10 phút mỗi cơn 40 giây.
- Khám trong: âm hộ không sang thương, cổ tử cung mở 4 cm, xóa mỏng, ối vỡ (nước ối trong), ngôi chỏm, độ lọt -2; khung chậu không hẹp.""",
                 )),
        ],
    },
]

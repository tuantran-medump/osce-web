"""Chương 5: Quản lý một cuộc chuyển dạ sanh (sản đồ – CTG).

Tài liệu không chép hình sản đồ/CTG của đa số đề, nên phần mô tả dữ kiện sản đồ/CTG
cho người thi là phần soạn thêm (khớp với lời giải trong tài liệu).
"""

TRAM = [
    {
        "id": "chuyen-da",
        "ten": "Quản lý cuộc chuyển dạ – sản đồ, CTG",
        "dong": "2407-2731",
        "vung_de": "2496-2731",
        "buoc": ["cd", "xt"],
        "dap_an": {
            "cd": "2434-2466,2474-2495",
            "xt": "2411-2432,2467-2473",
        },
        "de": [
            dict(so="2.1", tac_vu="2502-2506", cd_da="2509,2513", xt_da="2517",
                 st=dict(
                     mo_dau="""Trạm giấy: sản phụ đang chuyển dạ giai đoạn hoạt động, cổ tử cung mở 6 cm, ối đã vỡ, nước ối xanh; lâm sàng khá xấu.
Mô tả băng CTG: cơn gò 4 cơn/10 phút; nhịp tim thai căn bản 140 lần/phút; dao động nội tại ≤ 5 nhịp/phút; không nhịp tăng; sau mỗi cơn gò có nhịp giảm bắt đầu muộn, đáy nhịp giảm chậm hơn đỉnh cơn gò, lặp lại.""",
                 )),
            dict(so="2.2", nguon_de="Y18 – đợt 1", ten="Sản đồ lệch phải, cổ tử cung mở 5 cm", xt_da="2523",
                 bo_dong="2525-2527,2529-2532",
                 st=dict(
                     mo_dau="Sản phụ đang chuyển dạ giai đoạn hoạt động: cổ tử cung mở 5 cm, ngôi đầu độ lọt -2, ối còn, cơn gò 2 cơn/10 phút; đường biểu diễn cổ tử cung lệch phải đường báo động; CTG nhóm I. Đánh giá và xử trí tiếp theo.",
                 )),
            dict(so="2.2-d3", dong="2525-2527", nguon_de="Y18 – đợt 3", ten="Sản đồ – CTG: bất xứng đầu chậu",
                 cd_da="2526", xt_da="2527",
                 st=dict(
                     mo_dau="""Sản phụ con so, thai 39 tuần, chuyển dạ giai đoạn hoạt động.
- Sản đồ: cổ tử cung không tiến triển 2 giờ qua, đầu không xuống thêm, độ chồng xương tăng lên (++), kiểu thế chẩm chậu trái ngang.
- CTG: cơn gò 5 cơn/10 phút; nhịp tim thai căn bản 150 lần/phút, dao động nội tại 6–15 nhịp/phút; có nhịp giảm muộn sau các cơn gò.
Đọc sản đồ, CTG và xử trí.""",
                 )),
            dict(so="2.2-d5", dong="2529-2532", nguon_de="Y18 – đợt 5", ten="Sản đồ – CTG: cổ tử cung mở 8 cm",
                 mo_dau="2531", xt_da="2532"),
            dict(so="2.3", mo_dau="2536,2542", tac_vu="2538-2540", kh_kq="2545", cd_da="2544,2549-2551",
                 kh_da="2548", xt_da="2552", buoc=["kh", "cd", "xt"],
                 dap_an={"kh": "3477-3490"},
                 st=dict(
                     mo_dau="Băng EFM lúc 9 giờ: nhịp tim thai căn bản 140 lần/phút, dao động nội tại 5–8 nhịp/phút, không nhịp tăng; các nhịp giảm bắt đầu và kết thúc cùng lúc với cơn gò, lặp lại theo mỗi cơn.",
                     kh="- Khám trong: cổ tử cung mở trọn, ối đã vỡ, nước ối trong, ngôi chỏm, kiểu thế chẩm vệ, độ lọt +3, không chồng xương; khung chậu bình thường.",
                 )),
            dict(so="2.4", mo_dau="2556,2558,2560,2576", cd_da="2562-2574,2578-2579,2583", xt_da="2584-2586"),
            dict(so="2.5", mo_dau="2590-2592,2594", tac_vu="2596,2599,2602", cd_da="2598,2601", xt_da="2604-2606"),
            dict(so="2.6", tac_vu="2610-2612", cd_da="2616-2617",
                 st=dict(
                     mo_dau="""Trạm giấy: sản phụ con so, thai 39 tuần, đang chuyển dạ. Cho băng CTG và kết quả khám ở các thời điểm để vẽ sản đồ.
- CTG: cơn gò 3 cơn/10 phút; nhịp tim thai căn bản 140 lần/phút, dao động nội tại 5–15 nhịp/phút, có nhịp tăng, không nhịp giảm.
- 8 giờ: cổ tử cung mở 4 cm, độ lọt 4/5, cơn gò 3 cơn/10 phút mỗi cơn 30 giây, ối còn.
- 10 giờ: cổ tử cung 6 cm, độ lọt 3/5, cơn gò 3 cơn/10 phút mỗi cơn 40 giây, ối còn.
- 12 giờ: cổ tử cung 8 cm, độ lọt 2/5, kiểu thế chẩm chậu trái trước, cơn gò 4 cơn/10 phút mỗi cơn 45 giây, ối vỡ, nước ối trong; không chồng xương.""",
                 )),
            dict(so="2.7", mo_dau="2621", xt_da="2622-2623",
                 st=dict(mo_dau="Dữ kiện: cổ tử cung mở 6 cm, ối còn, cơn gò 2 cơn/10 phút mỗi cơn 30 giây, không chồng xương, CTG nhóm I.")),
            dict(so="2.8", cd_da="2627-2629", xt_da="2630-2631",
                 st=dict(
                     mo_dau="""Sản phụ chuyển dạ giai đoạn hoạt động giờ thứ 3.
- Sản đồ: cổ tử cung từ 4 cm lên 5 cm trong 3 giờ, ối chưa vỡ, không chồng xương, độ lọt 4/5, cơn gò 2 cơn/10 phút mỗi cơn 40 giây.
- CTG: nhịp tim thai căn bản 150 lần/phút, dao động nội tại khoảng 10 nhịp/phút, có nhịp tăng, có vài nhịp giảm hình dạng thay đổi, không liên quan cơn gò.
Đọc sản đồ, CTG và xử trí.""",
                 )),
            dict(so="2.9", cd_da="2635-2636", xt_da="2637",
                 st=dict(
                     mo_dau="""Trạm vấn đáp: cho sản đồ và CTG.
- Sản đồ: ối vỡ lúc 2 giờ; từ 4 giờ đường biểu diễn cổ tử cung chuyển phải, cổ tử cung dừng ở 7 cm; độ chồng xương tăng dần từ 0 lên +++.
- CTG: cơn gò 4 cơn/10 phút; nhịp tim thai căn bản 150 lần/phút, dao động nội tại 6–25 nhịp/phút; có nhịp giảm muộn lặp lại.""",
                 )),
            dict(so="2.10", cd_da="2641",
                 st=dict(
                     mo_dau="""Sản phụ chuyển dạ kéo dài. Sản đồ: cổ tử cung mở 8 cm không tiến triển 3 giờ, ngôi chưa lọt (3/5), chồng xương (+++), có bướu huyết thanh, đầu ngưng xoay ở kiểu thế chẩm chậu phải sau; cơn gò cường tính 5–6 cơn/10 phút; nước ối xanh. CTG: nhịp tim thai căn bản 160 lần/phút, dao động nội tại 5 nhịp/phút, nhịp giảm muộn lặp lại.
Nhận định và xử trí.""",
                 )),
            dict(so="2.11", tac_vu="2645", cd_da="2646-2649",
                 st=dict(
                     mo_dau="""Bác sĩ đóng vai hộ sinh, đưa sản đồ và CTG.
- Sản đồ: bắt đầu lúc 4 giờ 30 ở pha hoạt động; đầu 3/5, ối chưa vỡ; từ 4 giờ 30 đến 7 giờ ngôi không xuống, đường biểu diễn chuyển phải lúc 7 giờ; cơn gò 2 cơn/10 phút; không chồng xương; thai không to; sản phụ không có chống chỉ định sinh thường.
- CTG: trương lực căn bản 20 mmHg, cường độ cơn gò 40–60 mmHg; nhịp tim thai căn bản 140 lần/phút, có nhịp tăng, không nhịp giảm.""",
                 )),
            dict(so="2.12", mo_dau="2653",
                 st=dict(
                     mo_dau="Dữ kiện: sản phụ con so, thai 39 tuần, chuyển dạ giai đoạn hoạt động; cổ tử cung mở 7 cm, độ lọt 2/5, ối vỡ tự nhiên lúc này, nước ối xanh lẫn phân su; đường biểu diễn cổ tử cung nằm bên trái đường báo động; cơn gò 4 cơn/10 phút; CTG nhóm I.",
                 )),
            dict(so="2.13", mo_dau="2657", kh_kq="2659", cd_da="2660", xt_da="2661", buoc=["kh", "cd", "xt"],
                 dap_an={"kh": "3477-3490"},
                 st=dict(xt_de="Giám thị báo: phòng mổ 30 phút nữa mới trống, có chờ được không?")),
            dict(so="2.14", mo_dau="2665", tac_vu="2666-2670", cd_da="2672",
                 st=dict(
                     mo_dau="""- Khám: không có cơn gò rõ, cổ tử cung xóa 50%, mở 2 cm, ối vỡ, nước ối trong, ngôi đầu cao; nhiệt độ 37,2 °C.
- CTG lúc 20 giờ: cơn gò 1–2 cơn/10 phút, không đều, trương lực căn bản 10 mmHg, cường độ 40–50 mmHg; nhịp tim thai căn bản 140 lần/phút, dao động nội tại 5–10 nhịp/phút; có một đoạn tăng 20 nhịp kéo dài khoảng 10 giây; các nhịp giảm bắt đầu và kết thúc cùng cơn gò, trong đó một nhịp giảm kéo dài khoảng 2 phút.""",
                 )),
            dict(so="2.15", mo_dau="2676-2677", tac_vu="2678-2682", cd_da="2686-2687", xt_da="2688",
                 st=dict(
                     mo_dau="""Sản phụ con so, thai 39 tuần.
- Sản đồ: vào pha hoạt động lúc 2 giờ (cổ tử cung 4 cm, độ lọt 4/5, ối còn, cơn gò 3 cơn/10 phút mỗi cơn 30 giây).
- Diễn tiến sau đó (chưa vẽ): 6 giờ cổ tử cung 5 cm, độ lọt 4/5, ối còn, cơn gò 2 cơn/10 phút mỗi cơn 25 giây, không chồng xương, tim thai 140 lần/phút.""",
                 )),
            dict(so="2.16", mo_dau="2692", tac_vu="2693-2700", cd_da="2703,2705-2711", xt_da="2712-2713",
                 st=dict(
                     mo_dau="""- Sản đồ: vào pha hoạt động lúc 1 giờ (cổ tử cung 4 cm); 4 giờ cổ tử cung 5 cm, ngôi đầu độ lọt -3, ối còn, cơn co 2 cơn/10 phút mỗi cơn dưới 20 giây, không biến dạng ngôi.
- CTG: cơn co 2 cơn/10 phút, trương lực căn bản 10 mmHg, cường độ 60–100 mmHg; nhịp tim thai căn bản 140 lần/phút, dao động nội tại 5–10 nhịp/phút, có nhịp tăng, không nhịp giảm.""",
                 )),
            dict(so="2.17", tac_vu="2719-2724,2727,2730", mo_dau="2725", cd_da="2728-2729",
                 st=dict(
                     mo_dau="""- Sản đồ có thông tin đến 5 giờ: đã vào pha hoạt động, cổ tử cung 4 cm, đầu -3, ối còn, cơn co 2 cơn/10 phút mỗi cơn 20–40 giây.
- Thông tin thêm lúc 7 giờ: cổ tử cung 4 cm, đầu -3, ối còn, cơn co 3 cơn/10 phút mỗi cơn 20–40 giây, không uốn khuôn đầu.""",
                 )),
        ],
    },
]

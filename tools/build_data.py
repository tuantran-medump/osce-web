#!/usr/bin/env python3
"""Sinh data/stations.json (và data/stations.js) từ nguon/TongHop_OSCE_Y21_TungBuoc.md.

Nguyên tắc:
- Chữ của tài liệu được lấy NGUYÊN DÒNG theo số dòng trong file nguồn (không sửa, không tóm tắt).
  Chỉ đổi đường dẫn ảnh "hinh/..." thành "nguon/hinh/..." để web hiển thị được.
- Cách chia dòng của từng trạm / từng đề vào các ô (mở đầu, tác vụ, kết quả, đáp án...)
  nằm trong tools/cau_hinh/*.py.
- Dòng nào của một đề chưa được xếp vào ô nào sẽ tự rơi vào "giai_dap" (giải đáp / ghi chú
  của đề), hiện ra sau khi làm xong trạm, để không mất chữ nào và không lộ đáp án sớm.
- Phần tự soạn thêm nằm ở khóa "st" trong cấu hình, xuất ra các trường *_soan_them và được
  liệt kê trong "soan_them" của đề.

Chạy:  python3 tools/build_data.py
Kết quả: data/stations.json, data/stations.js, kiem_tra/bang_kiem_tra.md, kiem_tra/noi_dung_soan_them.md
"""
import hashlib
import json
import os
import re
import sys

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(GOC, "tools"))

from cau_hinh import CHUONG, HUONG_DAN_CHUNG, SHA256_NGUON  # noqa: E402

NGUON = os.path.join(GOC, "nguon", "TongHop_OSCE_Y21_TungBuoc.md")

BUOC = {
    "hb": ("hoi_benh", "Hỏi bệnh"),
    "kh": ("kham", "Khám"),
    "cls": ("cls", "Cận lâm sàng"),
    "cd": ("chan_doan", "Chẩn đoán – nhận định"),
    "xt": ("xu_tri", "Xử trí – tư vấn"),
}
BUOC_MAC_DINH = ["hb", "kh", "cls", "cd", "xt"]
DE_CHUNG = {
    "hoi_benh": "Hỏi bệnh sử, tiền căn liên quan đến vấn đề của thai phụ.",
    "kham": "Thăm khám phù hợp với tình huống (tổng trạng, sinh hiệu, khám ngoài, khám trong nếu cần).",
    "cls": "Đề nghị và đọc các cận lâm sàng cần thiết (xin sổ khám thai, giấy tờ, kết quả xét nghiệm).",
    "chan_doan": "Nêu chẩn đoán / nhận định tình trạng mẹ và thai, giải thích vì sao.",
    "xu_tri": "Tư vấn, giải đáp thắc mắc và đưa ra hướng xử trí – quản lý tiếp theo.",
}

RE_HEAD = re.compile(r"^(#{2,6})\s+(.*)$")
RE_SO = re.compile(r"^(\d+(?:\.\d+)*)\.?\s*(.*)$")

LOI = []
CANH_BAO = []


def doc_nguon():
    with open(NGUON, encoding="utf-8") as f:
        raw = f.read()
    h = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    if h != SHA256_NGUON:
        CANH_BAO.append(
            "File nguồn đã thay đổi so với lúc lập cấu hình (sha256 khác). "
            "Số dòng trong tools/cau_hinh có thể lệch – cần kiểm tra lại."
        )
    return [None] + raw.split("\n")  # đánh số từ 1


DONG = doc_nguon()
SO_DONG = len(DONG) - 1
TIEU_DE = {}  # số dòng -> (cấp, tiêu đề)
for i in range(1, SO_DONG + 1):
    m = RE_HEAD.match(DONG[i])
    if m:
        TIEU_DE[i] = (len(m.group(1)), m.group(2).strip())


def tach_khoang(s, ngu_canh=""):
    """'25-26,29' -> [25, 26, 29]"""
    if not s:
        return []
    kq = []
    for phan in str(s).split(","):
        phan = phan.strip()
        if not phan:
            continue
        if "-" in phan:
            a, b = phan.split("-")
            a, b = int(a), int(b)
            if a > b:
                LOI.append(f"{ngu_canh}: khoảng ngược {phan}")
            kq.extend(range(a, b + 1))
        else:
            kq.append(int(phan))
    for n in kq:
        if n < 1 or n > SO_DONG:
            LOI.append(f"{ngu_canh}: dòng {n} ngoài file")
    return kq


def sua_anh(dong):
    return re.sub(r"\]\(hinh/", "](nguon/hinh/", dong)


def ghep(dong_so):
    """Ghép các dòng nguồn (giữ nguyên chữ). Bỏ dòng trống đầu/cuối; giữa hai đoạn rời nhau chèn 1 dòng trống."""
    dong_so = sorted(set(dong_so))
    ra = []
    truoc = None
    for n in dong_so:
        if truoc is not None and n != truoc + 1 and ra and ra[-1] != "":
            ra.append("")
        ra.append(sua_anh(DONG[n]))
        truoc = n
    while ra and not ra[0].strip():
        ra.pop(0)
    while ra and not ra[-1].strip():
        ra.pop()
    return "\n".join(ra)


def tieu_de_bao_quanh(n, dau_tram):
    """Tiêu đề gần nhất (cấp >= 4) phía trên dòng n, trong phạm vi trạm."""
    for i in range(n - 1, dau_tram - 1, -1):
        if i in TIEU_DE and TIEU_DE[i][0] >= 4:
            return i
    return None


def ghep_dap_an(chuoi, dau_tram):
    """Đáp án mẫu chung: mỗi khoảng kèm dòng tiêu đề nguồn bao quanh (nếu khoảng không bắt đầu bằng tiêu đề)."""
    if not chuoi:
        return ""
    khoi = []
    for phan in str(chuoi).split(","):
        phan = phan.strip()
        if not phan:
            continue
        so = tach_khoang(phan, "dap_an")
        if not so:
            continue
        dau = so[0]
        them = []
        if dau not in TIEU_DE:
            t = tieu_de_bao_quanh(dau, dau_tram)
            if t is not None and t not in so:
                them = [t]
        khoi.append(ghep(them + so))
    return "\n\n".join(k for k in khoi if k)


def doc_ten_de(tieu_de):
    """'2.3 Y19 – đợt 2 – trạm 1: HBS – tính tuổi thai' -> (so, nguon_de, ten)"""
    m = RE_SO.match(tieu_de)
    so, phan = (m.group(1), m.group(2)) if m else ("", tieu_de)
    phan = phan.strip()
    phan = re.sub(r"^Đề\s+", "", phan)
    if ":" in phan:
        a, b = phan.split(":", 1)
        nguon, ten = a.strip(), b.strip()
    else:
        nguon, ten = phan.strip(), ""
    if not re.search(r"\bY\s?\d{2}", nguon):
        ten = (nguon + (": " + ten if ten else "")).strip()
        nguon = "Không ghi năm/đợt"
    return so, nguon, ten


def tim_de_trong_vung(vung):
    """Các tiêu đề ##### trong vùng đề -> {so: (dong_tieu_de, dau, cuoi)}"""
    a, b = tach_khoang(vung)[0], tach_khoang(vung)[-1]
    heads = [i for i in range(a, b + 1) if i in TIEU_DE and TIEU_DE[i][0] == 5]
    kq = {}
    for k, h in enumerate(heads):
        cuoi = b
        for j in range(h + 1, b + 1):
            if j in TIEU_DE and TIEU_DE[j][0] <= 5:
                cuoi = j - 1
                break
        so = RE_SO.match(TIEU_DE[h][1]).group(1)
        kq[so] = (h, h + 1, cuoi)
    return kq


KHOA_O = ["mo_dau", "tac_vu", "giai_dap"] + [f"{b}_{o}" for b in BUOC for o in ("de", "kq", "da")]


def lam_de(tram, cfg, vung_de, ma_tram):
    so = cfg.get("so", "")
    ngu = f"{ma_tram}/{so}"
    if cfg.get("bo_qua"):
        return None
    # phạm vi dòng của đề
    if "dong" in cfg:
        ds = tach_khoang(cfg["dong"], ngu)
        dau, cuoi, dong_td = ds[0], ds[-1], None
    elif so in vung_de:
        dong_td, dau, cuoi = vung_de[so]
    else:
        LOI.append(f"{ngu}: không tìm thấy đề số {so} trong vùng đề")
        return None
    if dong_td is not None:
        s, nguon_de, ten = doc_ten_de(TIEU_DE[dong_td][1])
    else:
        nguon_de, ten = "", ""
    nguon_de = cfg.get("nguon_de", nguon_de)
    ten = cfg.get("ten", ten)

    da_xep = set()
    o = {}
    for k in KHOA_O:
        if k in cfg:
            ds = tach_khoang(cfg[k], f"{ngu}.{k}")
            for n in ds:
                if n in da_xep:
                    LOI.append(f"{ngu}: dòng {n} bị xếp hai lần ({k})")
                da_xep.add(n)
            o[k] = ds
    # dòng còn lại của đề -> giai_dap
    bo_dong = set(tach_khoang(cfg.get("bo_dong", ""), f"{ngu}.bo_dong"))
    con = [n for n in range(dau, cuoi + 1)
           if n not in da_xep and n not in bo_dong and DONG[n].strip() and n not in TIEU_DE]
    o.setdefault("giai_dap", [])
    o["giai_dap"] = sorted(set(o["giai_dap"]) | set(con))
    ngoai = [n for n in da_xep if not (dau <= n <= cuoi)]
    if ngoai and not cfg.get("cho_phep_ngoai"):
        CANH_BAO.append(f"{ngu}: dùng dòng ngoài phạm vi đề: {sorted(ngoai)[:6]}…")

    st = cfg.get("st", {})
    for k in st:
        hop_le = {"mo_dau", "tac_vu"} | set(BUOC) | {f"{b}_de" for b in BUOC}
        if k not in hop_le:
            LOI.append(f"{ngu}: khóa soạn thêm lạ '{k}'")

    buoc_ma = cfg.get("buoc", tram.get("buoc", BUOC_MAC_DINH))
    da_cfg = dict(tram.get("dap_an", {}))
    if cfg.get("dap_an_tu"):
        da_cfg = dict(cfg["dap_an_tu"])
    da_cfg.update(cfg.get("dap_an", {}))
    dau_tram = tach_khoang(tram["dong"])[0]

    buoc = []
    soan_them = []
    if st.get("mo_dau"):
        soan_them.append("mo_dau")
    if st.get("tac_vu"):
        soan_them.append("tac_vu")
    for b in buoc_ma:
        ma, ten_b = BUOC[b]
        item = {
            "ma": ma,
            "ten": ten_b,
            "de": ghep(o.get(f"{b}_de", [])),
            "de_soan_them": st.get(f"{b}_de", "").strip(),
            "ket_qua": ghep(o.get(f"{b}_kq", [])),
            "ket_qua_soan_them": st.get(b, "").strip(),
            "dap_an": ghep_dap_an(da_cfg.get(b, ""), dau_tram),
            "dap_an_de": ghep(o.get(f"{b}_da", [])),
        }
        if item["ket_qua_soan_them"] or item["de_soan_them"]:
            soan_them.append(ma)
        buoc.append(item)
    for b in BUOC:
        if b not in buoc_ma and (o.get(f"{b}_kq") or o.get(f"{b}_de") or o.get(f"{b}_da") or st.get(b)):
            LOI.append(f"{ngu}: có nội dung cho bước '{b}' nhưng đề không có bước này")

    de = {
        "id": f"{ma_tram}--{so}".replace(".", "-"),
        "so": so,
        "ten": ten,
        "nguon_de": nguon_de,
        "dong": [dau, cuoi],
        "mo_dau": ghep(o.get("mo_dau", [])),
        "mo_dau_soan_them": st.get("mo_dau", "").strip(),
        "tac_vu": ghep(o.get("tac_vu", [])),
        "tac_vu_soan_them": st.get("tac_vu", "").strip(),
        "buoc": buoc,
        "giai_dap": ghep(o.get("giai_dap", [])),
        "soan_them": soan_them,
    }
    if not de["mo_dau"] and not de["mo_dau_soan_them"]:
        LOI.append(f"{ngu}: đề không có mở đầu")
    return de


def main():
    du_lieu = {
        "nguon": "nguon/TongHop_OSCE_Y21_TungBuoc.md",
        "ghi_chu": "Chữ trong các trường không có hậu tố _soan_them được chép nguyên dòng từ tài liệu nguồn. "
        "Trường *_soan_them là phần tự soạn thêm.",
        "buoc_mac_dinh": DE_CHUNG,
        "huong_dan_chung": ghep(tach_khoang(HUONG_DAN_CHUNG)),
        "chuong": [],
    }
    bang = []
    bo_qua = []
    for ch in CHUONG:
        c = {"id": ch["id"], "ten": ch["ten"], "tram": []}
        for tram in ch["tram"]:
            ma = tram["id"]
            vung = tim_de_trong_vung(tram["vung_de"]) if tram.get("vung_de") else {}
            cfg_so = {d.get("so") for d in tram["de"]}
            for so in vung:
                if so not in cfg_so:
                    LOI.append(f"{ma}: đề số {so} chưa có cấu hình")
            ds = []
            for cfg in tram["de"]:
                if cfg.get("bo_qua"):
                    td = TIEU_DE.get(vung.get(cfg["so"], (None,))[0], (0, cfg.get("so")))[1]
                    bo_qua.append((ma, cfg["so"], td, cfg["bo_qua"]))
                    continue
                d = lam_de(tram, cfg, vung, ma)
                if d:
                    ds.append(d)
            t = {
                "id": ma,
                "ten": tram["ten"],
                "ten_goc": TIEU_DE.get(tach_khoang(tram["dong"])[0], (0, tram["ten"]))[1],
                "ly_thuyet": ghep(tach_khoang(tram.get("ly_thuyet", ""))),
                "de": ds,
            }
            c["tram"].append(t)
            bang.append((ch, t))
        du_lieu["chuong"].append(c)

    os.makedirs(os.path.join(GOC, "data"), exist_ok=True)
    js = json.dumps(du_lieu, ensure_ascii=False, indent=1)
    with open(os.path.join(GOC, "data", "stations.json"), "w", encoding="utf-8") as f:
        f.write(js + "\n")
    with open(os.path.join(GOC, "data", "stations.js"), "w", encoding="utf-8") as f:
        f.write("// Sinh tự động bởi tools/build_data.py – không sửa tay.\n")
        f.write("window.OSCE_DATA = " + json.dumps(du_lieu, ensure_ascii=False) + ";\n")

    viet_bao_cao(bang, bo_qua)

    for c in CANH_BAO:
        print("CẢNH BÁO:", c)
    if LOI:
        for e in LOI:
            print("LỖI:", e)
        sys.exit(1)
    tong = sum(len(t["de"]) for _, t in bang)
    print(f"Xong: {len(bang)} trạm, {tong} đề -> data/stations.json, data/stations.js")


def viet_bao_cao(bang, bo_qua):
    thu_muc = os.path.join(GOC, "kiem_tra")
    os.makedirs(thu_muc, exist_ok=True)
    ten_buoc = {v[0]: v[1] for v in BUOC.values()}
    ten_buoc["mo_dau"] = "Mở đầu"
    ten_buoc["tac_vu"] = "Tác vụ"
    L = ["# Bảng kiểm tra dữ liệu đề OSCE", "",
         "Sinh tự động bởi `tools/build_data.py`. Nội dung soạn thêm đầy đủ xem `kiem_tra/noi_dung_soan_them.md`.", ""]
    tong_de = sum(len(t["de"]) for _, t in bang)
    tong_st = sum(1 for _, t in bang for d in t["de"] if d["soan_them"])
    L.append(f"**Tổng: {len(bang)} trạm, {tong_de} đề; {tong_st} đề có phần soạn thêm.**")
    L.append("")
    L.append("## Số đề mỗi trạm")
    L.append("")
    L.append("| Chương | Trạm | Số đề | Đề có soạn thêm |")
    L.append("|---|---|---:|---:|")
    for ch, t in bang:
        n_st = sum(1 for d in t["de"] if d["soan_them"])
        L.append(f"| {ch['ten'].split(':')[0].title()} | {t['ten']} | {len(t['de'])} | {n_st} |")
    L.append("")
    L.append("## Chi tiết từng đề")
    L.append("")
    for ch, t in bang:
        L.append(f"### {t['ten']}")
        L.append("")
        L.append("| Đề | Nguồn đề | Các bước | Soạn thêm |")
        L.append("|---|---|---|---|")
        for d in t["de"]:
            buoc = " → ".join(ten_buoc[b["ma"]] for b in d["buoc"])
            st = ", ".join(ten_buoc[x] for x in d["soan_them"]) or "—"
            ten = (d["so"] + " " + d["ten"]).strip().replace("|", "/")
            L.append(f"| {ten} | {d['nguon_de'].replace('|', '/')} | {buoc} | {st} |")
        L.append("")
    if bo_qua:
        L.append("## Tiêu đề đề bị bỏ qua")
        L.append("")
        L.append("| Trạm | Số | Tiêu đề trong tài liệu | Lý do |")
        L.append("|---|---|---|---|")
        for ma, so, td, ly in bo_qua:
            L.append(f"| {ma} | {so} | {td} | {ly} |")
        L.append("")
    with open(os.path.join(thu_muc, "bang_kiem_tra.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(L) + "\n")

    S = ["# Nội dung soạn thêm (để duyệt)", "",
         "Mọi đoạn dưới đây là phần tự soạn thêm, không có trong tài liệu nguồn; trên web đều gắn nhãn \"soạn thêm\".", ""]
    for ch, t in bang:
        co = [d for d in t["de"] if d["soan_them"]]
        if not co:
            continue
        S.append(f"## {t['ten']}")
        S.append("")
        for d in co:
            S.append(f"### {(d['so'] + ' ' + d['ten']).strip()} — {d['nguon_de']}")
            S.append("")
            if d["mo_dau_soan_them"]:
                S += ["**Mở đầu (soạn thêm):**", "", d["mo_dau_soan_them"], ""]
            if d["tac_vu_soan_them"]:
                S += ["**Tác vụ (soạn thêm):**", "", d["tac_vu_soan_them"], ""]
            for b in d["buoc"]:
                if b["de_soan_them"]:
                    S += [f"**{b['ten']} – yêu cầu (soạn thêm):**", "", b["de_soan_them"], ""]
                if b["ket_qua_soan_them"]:
                    S += [f"**{b['ten']} – kết quả (soạn thêm):**", "", b["ket_qua_soan_them"], ""]
    with open(os.path.join(thu_muc, "noi_dung_soan_them.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(S) + "\n")


if __name__ == "__main__":
    main()

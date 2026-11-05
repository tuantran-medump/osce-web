/* Tách nguon/Rubric_OSCE_TungBuoc.md thành danh sách rubric (giữ nguyên chữ tiêu chí).
   Mỗi rubric: { id, trang, ten, muc: [{ so, ten, nhom, muc_do: [{ khoa, nhan, diem, tinh_diem, ghi_chu, tieu_chi[] }] }], ghi_chu }
   khoa: "F" | "40" | "80" | "100"; diem: số điểm (F = 0); null nếu bảng không ghi điểm. */
"use strict";

const RE_RUBRIC = /^## Trang (\d+)\s*[–-]\s*(.+)$/;
const RE_NHOM = /^### (.+)$/;
const RE_MUC = /^(\d+)\.\s+\*\*(.+?)\*\*\s*$/;
const RE_MUC_DO = /^ {4}- \*\*(.+?)\*\*(.*)$/;
const RE_TIEU_CHI = /^ {8}\+ (.*)$/;

function khoaMucDo(nhan) {
  const m = nhan.match(/\((F|40%|80%|100%)\)/);
  if (m) return m[1].replace("%", "");
  if (/^Không đạt/.test(nhan)) return "F";
  return null;
}

function tachRubric(chu) {
  const dong = chu.replace(/\r\n?/g, "\n").split("\n");
  const ds = [];
  const loi = [];
  let r = null, muc = null, md = null, nhom = "";
  dong.forEach((l, i) => {
    const so = i + 1;
    let m;
    if ((m = l.match(RE_RUBRIC))) {
      r = { id: "trang-" + m[1], trang: +m[1], ten: m[2].trim(), dong: so, muc: [], ghi_chu: [] };
      ds.push(r);
      muc = md = null;
      nhom = "";
      return;
    }
    if (!r) return;
    if ((m = l.match(RE_NHOM))) { nhom = m[1].trim(); muc = md = null; return; }
    if ((m = l.match(RE_MUC))) {
      muc = { so: +m[1], ten: m[2].trim(), nhom, muc_do: [] };
      r.muc.push(muc);
      md = null;
      return;
    }
    if (muc && (m = l.match(RE_MUC_DO))) {
      const nhan = m[1].trim();
      const sau = m[2].trim();
      const khoa = khoaMucDo(nhan);
      if (!khoa) loi.push(`dòng ${so}: không nhận ra mức "${nhan}"`);
      const d = sau.match(/^\[(F|[\d.]+)\]/);
      const ghiChu = sau.replace(/^\[(F|[\d.]+)\]\s*/, "").replace(/^:\s*/, "").trim();
      const khongTinh = /không tính điểm|^\*?N\/A\*?$/i.test(ghiChu);
      md = {
        khoa,
        nhan,
        diem: d ? (d[1] === "F" ? 0 : parseFloat(d[1])) : (khoa === "F" ? 0 : null),
        tinh_diem: !khongTinh,
        ghi_chu: ghiChu,
        tieu_chi: [],
      };
      muc.muc_do.push(md);
      return;
    }
    if (md && (m = l.match(RE_TIEU_CHI))) { md.tieu_chi.push(m[1]); return; }
    if (l.trim()) {
      if (muc && !/^\*\*BÀI/.test(l) && !/^>/.test(l)) loi.push(`dòng ${so}: dòng lạ trong mục: ${l.trim().slice(0, 60)}`);
      else r.ghi_chu.push(l.trim());
    }
  });

  ds.forEach((r) => {
    r.ghi_chu = r.ghi_chu.join("\n");
    r.co_diem = r.muc.some((m) => m.muc_do.some((d) => d.diem !== null && d.diem > 0));
    r.muc.forEach((m) => {
      const khoa = m.muc_do.map((d) => d.khoa).join(",");
      if (khoa !== "F,40,80,100") loi.push(`${r.id} mục ${m.so} "${m.ten}": thứ tự mức ${khoa}`);
      // bảng không ghi điểm (Skillslab): quy ước mỗi mục 1 điểm, mức 40/80/100% = 0,4/0,8/1
      m.muc_do.forEach((d) => {
        if (d.diem === null) d.diem = d.khoa === "F" ? 0 : parseInt(d.khoa, 10) / 100;
      });
      m.diem_toi_da = Math.max(...m.muc_do.filter((d) => d.tinh_diem).map((d) => d.diem));
    });
    r.diem_toi_da = Math.round(r.muc.reduce((s, m) => s + m.diem_toi_da, 0) * 100) / 100;
  });
  return { rubric: ds, loi };
}

module.exports = { tachRubric };

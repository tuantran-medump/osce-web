#!/usr/bin/env node
/* Sinh data/stations.json và data/stations.js từ các file nạp đề mau-nap/tram/*.md
   (nguồn duy nhất của dữ liệu), dùng chung trình đọc js/nap.js với web.

   Chạy:  node tools/build_data.js
   Kết quả: data/stations.json, data/stations.js, kiem_tra/bang_kiem_tra.md, kiem_tra/noi_dung_soan_them.md */
"use strict";
const fs = require("fs");
const path = require("path");
const NapDe = require("../js/nap.js");
const { tachRubric } = require("./rubric.js");

const GOC = path.join(__dirname, "..");
const THU_MUC = path.join(GOC, "mau-nap", "tram");

function main() {
  const files = fs.readdirSync(THU_MUC).filter(f => f.endsWith(".md")).sort();
  const dsTram = [];
  const loi = [];
  for (const f of files) {
    const kq = NapDe.doc(fs.readFileSync(path.join(THU_MUC, f), "utf8"), f);
    kq.loi.forEach(e => loi.push(`${f}:${e.dong}: ${e.thong_bao}`));
    dsTram.push(...kq.tram);
  }
  // trùng mã trạm / mã đề giữa các file
  const maTram = {}, maDe = {};
  for (const t of dsTram) {
    if (maTram[t.id]) loi.push(`Trùng mã trạm "${t.id}"`);
    maTram[t.id] = 1;
    for (const d of t.de) {
      if (maDe[d.id]) loi.push(`Trùng mã đề "${d.id}"`);
      maDe[d.id] = 1;
    }
  }
  // rubric
  const kqRubric = tachRubric(fs.readFileSync(path.join(GOC, "nguon", "Rubric_OSCE_TungBuoc.md"), "utf8"));
  kqRubric.loi.forEach(e => loi.push("Rubric_OSCE_TungBuoc.md " + e));
  const rubricTheoMa = Object.fromEntries(kqRubric.rubric.map(r => [r.id, r]));
  for (const t of dsTram) {
    for (const r of t.rubric) if (!rubricTheoMa[r]) loi.push(`Trạm "${t.id}" gắn rubric lạ "${r}"`);
  }
  if (loi.length) {
    loi.forEach(e => console.error("LỖI: " + e));
    process.exit(1);
  }
  const huongDan = fs.readFileSync(path.join(GOC, "mau-nap", "huong-dan-chung.md"), "utf8").replace(/\s+$/, "");
  const duLieu = NapDe.dungDuLieu(dsTram, huongDan);

  fs.mkdirSync(path.join(GOC, "data"), { recursive: true });
  fs.writeFileSync(path.join(GOC, "data", "stations.json"), JSON.stringify(duLieu, null, 1) + "\n");
  const rubrics = { nguon: "nguon/Rubric_OSCE_TungBuoc.md", rubric: kqRubric.rubric };
  fs.writeFileSync(path.join(GOC, "data", "rubrics.json"), JSON.stringify(rubrics, null, 1) + "\n");
  fs.writeFileSync(path.join(GOC, "data", "stations.js"),
    "// Sinh tự động bởi tools/build_data.js từ mau-nap/tram/*.md và nguon/Rubric_OSCE_TungBuoc.md – không sửa tay.\n" +
    "window.OSCE_DATA = " + JSON.stringify(duLieu) + ";\nwindow.OSCE_RUBRIC = " + JSON.stringify(rubrics) + ";\n");
  baoCao(duLieu);
  baoCaoRubric(duLieu, kqRubric.rubric);
  dungCongCu();
  dungServiceWorker();
  const tong = duLieu.chuong.reduce((s, c) => s + c.tram.reduce((x, t) => x + t.de.length, 0), 0);
  console.log(`Xong: ${dsTram.length} trạm, ${tong} đề, ${kqRubric.rubric.length} rubric -> data/stations.json, data/rubrics.json, data/stations.js`);
}

/* Dữ liệu công cụ luyện tập: CTG (từ nguon/tap-doc-ctg), biểu đồ tăng trưởng (nguon/mau-trong/script/shino.json),
   tình huống sản đồ (mau-nap/cong-cu/san-do.json). */
function dungCongCu() {
  const docJ = (p) => JSON.parse(fs.readFileSync(path.join(GOC, p), "utf8"));
  const ctgGoc = docJ("mau-nap/cong-cu/ctg-ca-goc.json");
  const ctgKhoa = docJ("mau-nap/cong-cu/ctg-khoa.json");
  for (const c of ctgGoc) if (!ctgKhoa.khoa[c.gen]) throw new Error("Thiếu khóa đáp án CTG cho " + c.gen);
  const sanDo = docJ("mau-nap/cong-cu/san-do.json");
  for (const t of sanDo.tinh_huong) {
    if (!t.kham.length || !["trai", "giua", "hanh_dong"].includes(t.vi_tri)) throw new Error("Tình huống sản đồ lỗi: " + t.id);
  }
  const cc = {
    ctg: { nguon: "nguon/tap-doc-ctg/script (data.py, cases.py, ctggen.py)", ca: ctgGoc, khoa: ctgKhoa.khoa, tom_tat: ctgKhoa.tom_tat, ghi_chu: ctgKhoa.ghi_chu },
    shino: { nguon: "nguon/mau-trong/script/shino.json (số hóa biểu đồ Shinozuka, Chương 3)", du_lieu: docJ("nguon/mau-trong/script/shino.json") },
    san_do: sanDo,
  };
  fs.writeFileSync(path.join(GOC, "data", "cong-cu.js"),
    "// Sinh tự động bởi tools/build_data.js – không sửa tay.\nwindow.OSCE_CONGCU = " + JSON.stringify(cc) + ";\n");
}

/* sw.js: danh sách tệp cần lưu để chạy offline + phiên bản theo nội dung (đổi tệp nào là đổi phiên bản). */
function dungServiceWorker() {
  const crypto = require("crypto");
  const ds = ["./", "index.html", "manifest.webmanifest", "css/style.css",
    "js/md.js", "js/nap.js", "js/ctg.js", "js/cong-cu.js", "js/app.js",
    "data/stations.js", "data/cong-cu.js", "mau-nap/MAU_NAP_DE_OSCE.md",
    "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png"];
  for (const f of fs.readdirSync(path.join(GOC, "nguon", "hinh")).sort()) if (/\.(jpe?g|png|svg)$/i.test(f)) ds.push("nguon/hinh/" + f);
  const h = crypto.createHash("sha256");
  for (const f of ds) {
    if (f === "./") continue;
    const p = path.join(GOC, f);
    if (!fs.existsSync(p)) throw new Error("sw.js: thiếu tệp " + f);
    h.update(f).update(fs.readFileSync(p));
  }
  const mau = fs.readFileSync(path.join(__dirname, "sw-mau.js"), "utf8");
  fs.writeFileSync(path.join(GOC, "sw.js"),
    mau.replace("__PHIEN_BAN__", h.digest("hex").slice(0, 12)).replace("__DANH_SACH__", JSON.stringify(ds, null, 1)));
}

function baoCaoRubric(D, rubric) {
  const L = ["# Bảng ghép trạm – rubric", "",
    "Sinh tự động bởi `tools/build_data.js`. Ghép bằng dòng `Rubric:` ở đầu mỗi file `mau-nap/tram/*.md`; trạm không chắc thì để trống (tự chấm bằng checklist đáp án).", "",
    "## Danh sách rubric (nguon/Rubric_OSCE_TungBuoc.md)", "", "| Mã | Rubric | Số mục | Điểm tối đa | Gắn vào trạm |", "|---|---|---:|---:|---|"];
  const tram = [];
  D.chuong.forEach(c => c.tram.forEach(t => tram.push(t)));
  for (const r of rubric) {
    const gan = tram.filter(t => t.rubric.includes(r.id)).map(t => t.ten).join("; ") || "— (chưa gắn)";
    L.push(`| ${r.id} | ${r.ten} | ${r.muc.length} | ${r.diem_toi_da}${r.co_diem ? "" : " (bảng không ghi điểm, quy ước 1 điểm/mục)"} | ${gan} |`);
  }
  L.push("", "## Từng trạm", "", "| Trạm | Rubric |", "|---|---|");
  for (const t of tram) {
    L.push(`| ${t.ten} | ${t.rubric.map(id => id + " – " + rubric.find(r => r.id === id).ten).join("; ") || "(trống – checklist đáp án)"} |`);
  }
  fs.writeFileSync(path.join(GOC, "kiem_tra", "bang_rubric.md"), L.join("\n") + "\n");
}

function baoCao(D) {
  const ten = Object.fromEntries(NapDe.BUOC.map(b => [b.ma, b.ten]));
  ten.mo_dau = "Mở đầu";
  ten.tac_vu = "Tác vụ";
  const bang = [];
  D.chuong.forEach(c => c.tram.forEach(t => bang.push([c, t])));
  const tongDe = bang.reduce((s, [, t]) => s + t.de.length, 0);
  const tongST = bang.reduce((s, [, t]) => s + t.de.filter(d => d.soan_them.length).length, 0);
  const L = ["# Bảng kiểm tra dữ liệu đề OSCE", "",
    "Sinh tự động bởi `tools/build_data.js` từ `mau-nap/tram/*.md`. Nội dung soạn thêm đầy đủ xem `kiem_tra/noi_dung_soan_them.md`.", "",
    `**Tổng: ${bang.length} trạm, ${tongDe} đề; ${tongST} đề có phần soạn thêm.**`, "",
    "## Số đề mỗi trạm", "", "| Chương | Trạm | Số đề | Đề có soạn thêm |", "|---|---|---:|---:|"];
  for (const [c, t] of bang) {
    L.push(`| ${c.ten.split(":")[0].replace(/^CHƯƠNG/, "Chương")} | ${t.ten} | ${t.de.length} | ${t.de.filter(d => d.soan_them.length).length} |`);
  }
  L.push("", "## Chi tiết từng đề", "");
  for (const [, t] of bang) {
    L.push(`### ${t.ten}`, "", "| Đề | Nguồn đề | Các bước | Soạn thêm |", "|---|---|---|---|");
    for (const d of t.de) {
      const st = d.soan_them.map(x => ten[x]).join(", ") || "—";
      L.push(`| ${NapDe.tenHienThi(d).replace(/\|/g, "/")} | ${d.nguon_de.replace(/\|/g, "/")} | ${d.buoc.map(b => b.ten).join(" → ")} | ${st} |`);
    }
    L.push("");
  }
  fs.mkdirSync(path.join(GOC, "kiem_tra"), { recursive: true });
  fs.writeFileSync(path.join(GOC, "kiem_tra", "bang_kiem_tra.md"), L.join("\n") + "\n");

  const S = ["# Nội dung soạn thêm (để duyệt)", "",
    "Mọi đoạn dưới đây là phần tự soạn thêm, không có trong tài liệu nguồn; trên web đều gắn nhãn \"soạn thêm\".", ""];
  for (const [, t] of bang) {
    const co = t.de.filter(d => d.soan_them.length);
    if (!co.length) continue;
    S.push(`## ${t.ten}`, "");
    for (const d of co) {
      S.push(`### ${NapDe.tenHienThi(d)} — ${d.nguon_de}`, "");
      if (d.mo_dau_soan_them) S.push("**Mở đầu (soạn thêm):**", "", d.mo_dau_soan_them, "");
      if (d.tac_vu_soan_them) S.push("**Tác vụ (soạn thêm):**", "", d.tac_vu_soan_them, "");
      for (const b of d.buoc) {
        if (b.de_soan_them) S.push(`**${b.ten} – yêu cầu (soạn thêm):**`, "", b.de_soan_them, "");
        if (b.ket_qua_soan_them) S.push(`**${b.ten} – kết quả (soạn thêm):**`, "", b.ket_qua_soan_them, "");
      }
    }
  }
  fs.writeFileSync(path.join(GOC, "kiem_tra", "noi_dung_soan_them.md"), S.join("\n") + "\n");
}

main();

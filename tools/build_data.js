#!/usr/bin/env node
/* Sinh data/stations.json và data/stations.js từ các file nạp đề mau-nap/tram/*.md
   (nguồn duy nhất của dữ liệu), dùng chung trình đọc js/nap.js với web.

   Chạy:  node tools/build_data.js
   Kết quả: data/stations.json, data/stations.js, kiem_tra/bang_kiem_tra.md, kiem_tra/noi_dung_soan_them.md */
"use strict";
const fs = require("fs");
const path = require("path");
const NapDe = require("../js/nap.js");

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
  if (loi.length) {
    loi.forEach(e => console.error("LỖI: " + e));
    process.exit(1);
  }
  const huongDan = fs.readFileSync(path.join(GOC, "mau-nap", "huong-dan-chung.md"), "utf8").replace(/\s+$/, "");
  const duLieu = NapDe.dungDuLieu(dsTram, huongDan);

  fs.mkdirSync(path.join(GOC, "data"), { recursive: true });
  fs.writeFileSync(path.join(GOC, "data", "stations.json"), JSON.stringify(duLieu, null, 1) + "\n");
  fs.writeFileSync(path.join(GOC, "data", "stations.js"),
    "// Sinh tự động bởi tools/build_data.js từ mau-nap/tram/*.md – không sửa tay.\nwindow.OSCE_DATA = " + JSON.stringify(duLieu) + ";\n");
  baoCao(duLieu);
  const tong = duLieu.chuong.reduce((s, c) => s + c.tram.reduce((x, t) => x + t.de.length, 0), 0);
  console.log(`Xong: ${dsTram.length} trạm, ${tong} đề -> data/stations.json, data/stations.js`);
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

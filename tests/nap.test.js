// Test trình đọc file nạp đề (js/nap.js). Chạy: node --test tests/
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const NapDe = require("../js/nap.js");

const GOC = path.join(__dirname, "..");
const docFile = (p) => fs.readFileSync(path.join(GOC, p), "utf8");
const D = JSON.parse(docFile("data/stations.json"));
const deTheoMa = {};
D.chuong.forEach((c) => c.tram.forEach((t) => t.de.forEach((d) => (deTheoMa[d.id] = d))));

function loiCua(p) {
  return NapDe.doc(docFile(p), p).loi;
}
function coLoi(loi, dong, doan) {
  assert.ok(
    loi.some((e) => e.dong === dong && e.thong_bao.includes(doan)),
    `Mong lỗi dòng ${dong} chứa "${doan}", nhận được:\n` + loi.map((e) => `  ${e.dong}: ${e.thong_bao}`).join("\n")
  );
}

test("file ví dụ trong khuôn đọc không lỗi và đúng cấu trúc stations.json", () => {
  const kq = NapDe.doc(docFile("mau-nap/MAU_NAP_DE_OSCE.md"));
  assert.deepStrictEqual(kq.loi, []);
  assert.strictEqual(kq.tram.length, 1);
  const t = kq.tram[0];
  assert.strictEqual(t.id, "rubella");
  assert.strictEqual(t.chuong_ten, "CHƯƠNG 2: NỬA ĐẦU THAI KÌ");
  assert.strictEqual(t.de.length, 1);
  const d = t.de[0];
  // trùng khớp tuyệt đối với đề trong dữ liệu đã build
  assert.deepStrictEqual(d, deTheoMa["rubella--2-5"]);
  assert.strictEqual(d.nguon_de, "Y21 – đợt 1");
  assert.deepStrictEqual(d.buoc.map((b) => b.ma), ["hoi_benh", "cls", "chan_doan", "xu_tri"]);
  assert.deepStrictEqual(d.soan_them, ["hoi_benh", "cls"]);
  // chữ nguồn được giữ nguyên
  assert.ok(d.mo_dau.includes("Thai phụ đến khám thai nhờ tư vấn kết quả Rubella"));
  assert.ok(d.buoc[0].ket_qua_soan_them.includes("PARA 0000"));
});

test("đọc – xuất – đọc lại toàn bộ mau-nap/tram cho kết quả y hệt", () => {
  const dir = path.join(GOC, "mau-nap", "tram");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    const chu = fs.readFileSync(path.join(dir, f), "utf8");
    const a = NapDe.doc(chu, f);
    assert.deepStrictEqual(a.loi, [], f);
    const xuat = a.tram.map((t) => NapDe.xuat(t)).join("\n");
    assert.strictEqual(xuat, chu, f + ": xuất lại khác file gốc");
    const b = NapDe.doc(xuat, f);
    assert.deepStrictEqual(b.tram, a.tram, f);
  }
});

test("dòng Soạn thêm, Hình, Đáp án (trống) và đáp án mẫu chung", () => {
  const chu = [
    "Giới thiệu tự do trước trạm – bỏ qua.",
    "# TRẠM: Thử",
    "Mã: thu",
    "Chương: CHƯƠNG 9: THỬ",
    "<!-- chú thích bị bỏ qua -->",
    "## ĐÁP ÁN MẪU",
    "### BƯỚC: Khám",
    "- Đáp án mẫu khám",
    "## ĐỀ: Một",
    "### Mở đầu",
    "Soạn thêm:",
    "- Chỉ có soạn thêm",
    "### BƯỚC: Khám",
    "#### Đề",
    "#### Kết quả",
    "- Nguyên văn",
    "Soạn thêm:",
    "- Soạn thêm",
    "#### Hình",
    "nguon/hinh/p096-1.jpg",
    "## ĐỀ: Hai",
    "### Mở đầu",
    "- Mở",
    "### BƯỚC: Khám",
    "#### Đề",
    "#### Đáp án",
    "(trống)",
  ].join("\n");
  const kq = NapDe.doc(chu);
  assert.deepStrictEqual(kq.loi, []);
  const [mot, hai] = kq.tram[0].de;
  assert.strictEqual(mot.mo_dau, "");
  assert.strictEqual(mot.mo_dau_soan_them, "- Chỉ có soạn thêm");
  assert.strictEqual(mot.buoc[0].ket_qua, "- Nguyên văn\n\n![](nguon/hinh/p096-1.jpg)");
  assert.strictEqual(mot.buoc[0].ket_qua_soan_them, "- Soạn thêm");
  assert.strictEqual(mot.buoc[0].dap_an, "- Đáp án mẫu khám");
  assert.strictEqual(hai.buoc[0].dap_an, "");
  assert.deepStrictEqual(mot.soan_them, ["mo_dau", "kham"]);
  const dl = NapDe.dungDuLieu(kq.tram, "");
  assert.strictEqual(dl.chuong[0].id, "c9");
});

test("lỗi: bước thiếu mục Đề", () => {
  const loi = loiCua("tests/mau-loi/thieu-de-buoc.md");
  assert.strictEqual(loi.length, 1);
  coLoi(loi, 12, "thiếu mục \"#### Đề\"");
});

test("lỗi: tên bước lạ", () => {
  const loi = loiCua("tests/mau-loi/ten-buoc-la.md");
  assert.strictEqual(loi.length, 1);
  coLoi(loi, 16, "Tên bước lạ \"Khám bệnh nhân\"");
});

test("lỗi: trùng tên đề", () => {
  const loi = loiCua("tests/mau-loi/trung-ten-de.md");
  assert.strictEqual(loi.length, 1);
  coLoi(loi, 17, "Trùng tên đề \"Đề A\" (đã có ở dòng 5)");
});

test("lỗi: thiếu Chương, thiếu Mở đầu, thông tin lạ", () => {
  const loi = loiCua("tests/mau-loi/thieu-mo-dau-chuong.md");
  coLoi(loi, 1, "thiếu dòng \"Chương: …\"");
  coLoi(loi, 4, "thiếu mục \"### Mở đầu\"");
  coLoi(loi, 6, "Thông tin lạ \"Màu\"");
});

test("lỗi: dòng ngoài mục và không có trạm", () => {
  const kq = NapDe.doc("# TRẠM: X\nChương: CHƯƠNG 1: A\n## ĐỀ: Y\n### Mở đầu\n- a\n### BƯỚC: Khám\nchữ lạc\n#### Đề\n");
  coLoi(kq.loi, 7, "Dòng nằm ngoài mục nào");
  assert.strictEqual(NapDe.doc("chỉ có chữ").tram.length, 0);
});

test("ghép đề nạp tay: thêm vào trạm có sẵn, báo trùng với đề có sẵn", () => {
  const duLieu = JSON.parse(JSON.stringify(D));
  const vd = NapDe.doc(docFile("mau-nap/MAU_NAP_DE_OSCE.md")).tram;
  const loi = NapDe.ghep(duLieu, vd, true);
  assert.strictEqual(loi.length, 1);
  assert.match(loi[0].thong_bao, /Trùng mã đề "rubella--2-5"/);

  const moi = NapDe.doc(
    "# TRẠM: Rubella\nMã: rubella\nChương: CHƯƠNG 2: NỬA ĐẦU THAI KÌ\n## ĐỀ: Y22 đợt 1\nNguồn đề: Y22 – đợt 1\n### Mở đầu\n- a\n### BƯỚC: Hỏi bệnh\n#### Đề\n"
  ).tram;
  assert.deepStrictEqual(NapDe.ghep(duLieu, moi, true), []);
  const rub = duLieu.chuong.find((c) => c.id === "c2").tram.find((t) => t.id === "rubella");
  const cuoi = rub.de[rub.de.length - 1];
  assert.strictEqual(cuoi.nguon_de, "Y22 – đợt 1");
  assert.strictEqual(cuoi.nap_tay, true);
  assert.strictEqual(cuoi.buoc[0].dap_an, "", "đáp án mẫu của file nạp không lấy của trạm có sẵn");
});

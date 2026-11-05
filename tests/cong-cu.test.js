// Test công cụ luyện tập: bộ sinh CTG, biểu đồ tăng trưởng, tình huống sản đồ. Chạy: node --test tests/*.test.js
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const CTG = require("../js/ctg.js");
const GOC = path.join(__dirname, "..");

function napTrinhDuyet() {
  const ctx = { window: {}, self: {} };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(GOC, "data/cong-cu.js"), "utf8"), ctx);
  vm.runInContext(fs.readFileSync(path.join(GOC, "js/cong-cu.js"), "utf8"), ctx);
  return ctx;
}

test("CTG: cùng seed cho cùng băng, khác seed cho băng khác", () => {
  const a = CTG.sinh("c6", 61), b = CTG.sinh("c6", 61), c = CTG.sinh("c6", 999);
  assert.deepStrictEqual(Array.from(a.sig.slice(0, 50)), Array.from(b.sig.slice(0, 50)));
  assert.notDeepStrictEqual(Array.from(a.sig.slice(0, 50)), Array.from(c.sig.slice(0, 50)));
});

test("CTG: 12 ca khớp khóa đáp án (tim thai cơ bản, số cơn co) với cả seed gốc và seed mới", () => {
  const khoa = JSON.parse(fs.readFileSync(path.join(GOC, "mau-nap/cong-cu/ctg-khoa.json"), "utf8")).khoa;
  for (const gen of Object.keys(CTG.CA)) {
    for (const seed of [undefined, 4242]) {
      const s = CTG.sinh(gen, seed);
      // tim thai cơ bản: trung vị đoạn không có nhịp giảm/tăng lớn
      const v = Array.from(s.sig).sort((x, y) => x - y);
      const trungVi = v[Math.floor(v.length * 0.75)];
      if (!["c8", "c6", "c7", "c9", "c2"].includes(gen)) assert.ok(Math.abs(trungVi - khoa[gen].nen) <= 12, `${gen}: ${trungVi} vs ${khoa[gen].nen}`);
      const soCon10 = s.contr.length / (s.minutes / 10);
      const [lo, hi] = khoa[gen].con_co;
      assert.ok(soCon10 >= lo - 1 && soCon10 <= hi + 1, `${gen} seed ${seed}: ${soCon10} cơn/10 phút`);
      const svg = CTG.render(s, { header: "x", times: [8, 0] });
      assert.match(svg, /^<svg class="ctg"/);
      assert.ok(svg.includes("<polyline"));
    }
  }
});

test("Biểu đồ tăng trưởng: đường p50 cho BPV 50, p3 cho BPV 3, p97 cho BPV 97", () => {
  const T = napTrinhDuyet().OSCE_TRANG._tangTruong;
  for (const key of ["BPD", "AC", "FL", "EFW"]) {
    for (const ga of [20, 28, 36]) {
      const b = T.bpvShino(key, ga);
      assert.ok(Math.abs(T.tinhBPV(key, "shino", ga, b.p50) - 50) < 0.5, key + ga);
      assert.ok(Math.abs(T.tinhBPV(key, "shino", ga, b.p3) - 3) < 0.3, key + ga);
      assert.ok(Math.abs(T.tinhBPV(key, "shino", ga, b.p97) - 97) < 0.3, key + ga);
      assert.ok(b.p3 < b.p10 && b.p10 < b.p50 && b.p50 < b.p90 && b.p90 < b.p97);
    }
  }
  assert.ok(Math.abs(T.tinhBPV("EFW", "hadlock", 30, T.bpvHadlock(30).p50) - 50) < 0.5);
  // giá trị tham chiếu Hadlock 1991: EFW 50th lúc 40 tuần ≈ 3619 g
  assert.ok(Math.abs(T.bpvHadlock(40).p50 - 3619) < 5);
});

test("Sản đồ: vị trí đường biểu diễn trong đáp án khớp hình học sản đồ WHO rút gọn", () => {
  const ctx = napTrinhDuyet();
  const ds = ctx.OSCE_CONGCU.san_do.tinh_huong;
  assert.strictEqual(ds.length, 6);
  for (const t of ds) {
    const cot = ctx.OSCE_TRANG._sanDo.cotKham(t);
    const i = t.kham.length - 1, c = cot[i], cm = t.kham[i].cm;
    const baoDong = 4 + c / 2; // đường báo động: 1 cm/giờ, mỗi cột = 30 phút
    const hanhDong = c >= 8 ? 4 + (c - 8) / 2 : -1;
    const viTri = hanhDong >= 0 && cm <= hanhDong ? "hanh_dong" : cm > baoDong ? "trai" : "giua";
    assert.strictEqual(viTri, t.vi_tri, t.id + ` (cột ${c}, ${cm} cm, báo động ${baoDong}, hành động ${hanhDong})`);
    assert.ok(t.nguyen_van.length && t.nguon && t.xu_tri.length, t.id);
    assert.ok(cot.every((x) => x >= 0 && x <= 24), t.id);
  }
});

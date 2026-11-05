const { chromium } = require('playwright');
const { GOC, URL_GOC, ANH } = require('./chung.js');
const OUT = ANH;
const URL = URL_GOC + 'index.html';
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [ten, w, h] of [['dien-thoai-390', 390, 844], ['ipad-820', 820, 1180], ['pc-1440', 1440, 900]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: w < 500 });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(w + ' ' + e.message));
    /* CTG: ca 2 (c6) – điền đúng hết rồi kiểm tra */
    await p.goto(URL + '#/ctg/1'); await p.waitForTimeout(200);
    await p.fill('#ctg-cc', '6'); await p.fill('#ctg-nen', '145');
    for (const [n, v] of [['dao_dong', 'trung_binh'], ['nhip_tang', 'khong'], ['nhip_giam', 'muon'], ['nhom', '2'], ['xu_tri', 'B']])
      await p.click(`input[name="${n}"][value="${v}"] + span`);
    await p.click('#form-ctg button[type=submit]');
    const t = await p.textContent('#ctg-tong');
    if (!/7\/7/.test(t)) errs.push('CTG đúng hết mà ra ' + t);
    // sai 1 ô
    await p.fill('#ctg-nen', '120'); await p.click('#form-ctg button[type=submit]');
    if (!/6\/7/.test(await p.textContent('#ctg-tong')) || !(await p.$('[data-o="nen"].sai'))) errs.push('CTG không tô đỏ ô sai');
    await p.evaluate(() => document.querySelector('[data-o="nen"]').scrollIntoView());
    await p.screenshot({ path: OUT + `tt-${ten}-ctg-kiem.png` });
    await p.goto(URL + '#/ctg/10/12345'); await p.waitForTimeout(300); // băng mới
    if (!(await p.$('.bang-ctg svg'))) errs.push('không sinh được băng mới');
    /* Sản đồ sd6: chấm đúng hết bằng cách chạm toạ độ */
    await p.goto(URL + '#/san-do/sd6'); await p.waitForTimeout(300);
    const kham = [[0, 4, 4, 3], [8, 7, 3, 5], [14, 8, 3, 5], [16, 8, 3, 5]]; // cột, cm, lọt, cơn co
    async function cham(xu, yu) {
      const box = await p.evaluate(([xu, yu]) => {
        const svg = document.querySelector('.bang-sd svg'); const pt = svg.createSVGPoint(); pt.x = xu; pt.y = yu;
        const r = pt.matrixTransform(svg.getScreenCTM()); return [r.x, r.y];
      }, [xu, yu]);
      await p.evaluate(([x, y]) => window.scrollTo(0, 0), box);
      const b2 = await p.evaluate(([xu, yu]) => {
        const svg = document.querySelector('.bang-sd svg'); svg.scrollIntoView({ block: 'center' });
        const c = svg.parentElement; const pt = svg.createSVGPoint(); pt.x = xu; pt.y = yu;
        let r = pt.matrixTransform(svg.getScreenCTM());
        if (r.x > c.getBoundingClientRect().right - 10 || r.x < c.getBoundingClientRect().left) { c.scrollLeft = r.x - c.getBoundingClientRect().left - 100; r = pt.matrixTransform(svg.getScreenCTM()); }
        const yy = Math.min(Math.max(r.y, 60), innerHeight - 60);
        if (yy !== r.y) { window.scrollBy(0, r.y - innerHeight / 2); r = pt.matrixTransform(svg.getScreenCTM()); }
        return [r.x, r.y];
      }, [xu, yu]);
      await p.mouse.click(b2[0], b2[1]);
    }
    const L = 64, cw = 26, rh = 30, top = 34, ccTop = 34 + 300 + 26 + 14, ccRow = 18;
    for (let i = 0; i < kham.length; i++) {
      const [c, cm, lot, cc] = kham[i];
      await p.click(`.nut-kham[data-k="${i}"]`);
      await p.click('input[name="sd-che"][value="x"] + span'); await cham(L + c * cw, top + 300 - cm * rh);
      await p.click('input[name="sd-che"][value="o"] + span'); await cham(L + c * cw, top + 300 - lot * rh);
      await p.click('input[name="sd-che"][value="cc"] + span');
      await p.click(`input[name="sd-loai"][value="${i === 0 ? '20-40' : '>40'}"] + span`);
      await cham(L + c * cw + cw / 2, ccTop + (5 - cc) * ccRow + ccRow / 2);
    }
    await p.click('#sd-kiem');
    const kq = await p.textContent('#sd-ket-qua');
    if (!/12\/12/.test(kq)) errs.push(w + ' sản đồ: ' + kq.slice(0, 60));
    await p.click('input[name="sd-vi-tri"][value="hanh_dong"] + span');
    await p.click('input[name="sd-xu-tri"][value="mo"] + span');
    await p.click('#sd-hoi button[type=submit]');
    if ((await p.$$('#sd-hoi .o-dien.dung')).length !== 2) errs.push('câu hỏi sản đồ chấm sai');
    await p.evaluate(() => document.querySelector('.bang-sd').scrollIntoView());
    await p.screenshot({ path: OUT + `tt-${ten}-sando-kiem.png` });
    /* Tăng trưởng: 28 tuần, EFW 1100, AC 23.5, BPD 72, FL 52 */
    await p.goto(URL + '#/tang-truong'); await p.waitForTimeout(200);
    await p.fill('#tt-tuan', '28'); await p.fill('#tt-EFW', '1100'); await p.fill('#tt-AC', '23.5'); await p.fill('#tt-BPD', '72'); await p.fill('#tt-FL', '52');
    await p.click('#form-tt button[type=submit]');
    const ttkq = await p.textContent('#tt-ket-qua');
    if (!/BPV ≈/.test(ttkq)) errs.push('không ra bách phân vị: ' + ttkq.slice(0, 100));
    await p.fill('#tt-tuan', '32'); await p.fill('#tt-EFW', '1500'); await p.fill('#tt-AC', ''); await p.fill('#tt-BPD', ''); await p.fill('#tt-FL', '');
    await p.click('#form-tt button[type=submit]');
    await p.evaluate(() => document.getElementById('tt-ket-qua').scrollIntoView());
    await p.screenshot({ path: OUT + `tt-${ten}-tang-truong.png` });
    console.log(w, 'tăng trưởng:', ttkq.replace(/\s+/g, ' ').slice(0, 300));
    const sw = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (sw > 0) errs.push(w + ' cuộn ngang');
    /* Thi thử: dùng đồng hồ giả để tua nhanh */
    await ctx.close();
    const ctx2 = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const q = await ctx2.newPage(); q.on('pageerror', e => errs.push('thi thử ' + w + ' ' + e.message));
    await q.clock.install();
    await q.goto(URL + '#/thi-thu'); await q.waitForTimeout(100);
    await q.click('#tt-moi'); await q.waitForTimeout(200);
    if (!(await q.$('.thanh.che-thi-thu'))) errs.push('không vào chế độ thi thử');
    if (await q.$('[data-dap-an]')) errs.push('thi thử lộ nút đáp án');
    await q.click('[data-xong="0"]');
    if (await q.$('[data-dap-an]')) errs.push('thi thử lộ đáp án sau bước 1');
    await q.screenshot({ path: OUT + `tt-${ten}-thi-thu-tram.png` });
    for (let k = 0; k < 6; k++) {
      await q.clock.fastForward('07:05'); await q.waitForTimeout(150);
      if (k < 5) {
        if (!/chuyen/.test(await q.evaluate(() => location.hash))) errs.push('không chuyển trạm sau trạm ' + (k + 1) + ': ' + await q.evaluate(() => location.hash));
        if (k === 0) await q.screenshot({ path: OUT + `tt-${ten}-thi-thu-chuyen.png` });
        await q.clock.fastForward('01:05'); await q.waitForTimeout(150);
      }
    }
    if (!/ket-qua/.test(await q.evaluate(() => location.hash))) errs.push('không tới bảng điểm');
    const rows = await q.$$('.bang-ls tbody tr');
    if (rows.length !== 6) errs.push('bảng điểm có ' + rows.length + ' trạm');
    await q.click('.bang-ls tbody tr:first-child a'); await q.waitForTimeout(200);
    if (!(await q.$('#tu-cham:not([hidden])')) || !(await q.$('[data-dap-an]'))) errs.push('xem lại không có tự chấm / đáp án');
    // chấm checklist hoặc rubric
    if (await q.$('.ds-tick')) { await q.click('[data-chon-het="0"]'); } else {
      const n = await q.$$('.muc-cham'); for (let i = 0; i < n.length; i++) await (await q.$(`#m${i}-100`)).evaluate(x => x.closest('label').click());
    }
    await q.click('#luu-diem'); await q.waitForTimeout(100);
    await q.goto(URL + '#/thi-thu/ket-qua'); await q.waitForTimeout(200);
    if (!/đã chấm 1\/6/.test(await q.textContent('main'))) errs.push('bảng điểm chưa cập nhật điểm');
    await q.screenshot({ path: OUT + `tt-${ten}-bang-diem.png`, fullPage: true });
    await ctx2.close();
  }
  await b.close(); console.log(errs.join('\n') || 'OK – CTG, sản đồ, tăng trưởng, thi thử chạy đúng'); process.exitCode = errs.length ? 1 : 0;
})();

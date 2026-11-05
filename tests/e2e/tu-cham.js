const { chromium } = require('playwright');
const { GOC, URL_GOC, ANH } = require('./chung.js');
const fs = require('fs');
const OUT = ANH;
const URL = URL_GOC + 'index.html';
async function lamHet(p, id) {
  await p.goto('about:blank');
  await p.goto(URL + '#/de/' + id);
  for (let k = 0; k < 6; k++) { const b = await p.$('[data-xong]'); if (!b) break; await b.click(); }
  await p.waitForSelector('#tu-cham:not([hidden])');
}
(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const [ten, w, h] of [['dien-thoai-390', 390, 844], ['pc-1440', 1440, 900]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, acceptDownloads: true });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(w + ' ' + e.message));
    // 1. Trạm có rubric (TSG, 2 rubric)
    await lamHet(p, 'tsg--2-2');
    if (!(await p.$('#chon-rubric'))) errs.push('không có ô chọn rubric cho trạm 2 rubric');
    if (!(await p.isDisabled('#luu-diem'))) errs.push('chưa chấm đủ mà nút Lưu vẫn bật');
    const fs_ = await p.$$('.muc-cham');
    for (let i = 0; i < fs_.length; i++) {
      const lv = i % 2 ? '100' : '80';
      const o = await p.$(`#m${i}-${lv}:not([disabled])`) || await p.$(`#m${i}-100`);
      await o.evaluate(x => x.closest('label').click());
    }
    const diem = await p.textContent('#so-diem');
    await p.evaluate(() => document.getElementById('tu-cham').scrollIntoView());
    await p.waitForTimeout(200);
    await p.screenshot({ path: OUT + ten + '-7-tu-cham-rubric.png' });
    await p.click('#luu-diem');
    if (!/Đã lưu/.test(await p.textContent('#bao-luu'))) errs.push('không báo đã lưu');
    // 2. Trạm không rubric (viêm gan B) -> checklist
    await lamHet(p, 'viem-gan-b--2-1');
    if (await p.$('#chon-rubric') || !(await p.$('.ds-tick'))) errs.push('trạm không rubric không hiện checklist');
    await p.click('[data-chon-het="0"]');
    const ck = await p.$$('.ds-tick input');
    await ck[ck.length - 1].check();
    const diem2 = await p.textContent('#so-diem');
    if (diem2 === '0%') errs.push('checklist không tính điểm');
    await p.evaluate(() => document.getElementById('tu-cham').scrollIntoView());
    await p.screenshot({ path: OUT + ten + '-8-tu-cham-checklist.png' });
    await p.click('#luu-diem');
    // 3. Lịch sử
    await p.goto(URL + '#/lich-su');
    await p.waitForTimeout(200);
    const ls = await p.textContent('main');
    if (!/2 lần/.test(ls) || !ls.includes(diem.replace('%', ''))) errs.push('lịch sử thiếu: ' + ls.slice(0, 200));
    await p.screenshot({ path: OUT + ten + '-9-lich-su.png', fullPage: true });
    const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#xuat-ls')]);
    const file = await dl.path();
    const goi = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (goi.lich_su.length !== 2 || typeof goi.lich_su[0].thoi_gian_ms !== 'number') errs.push('file xuất sai');
    // nhập lại chính file đó -> trùng; xóa hết rồi nhập -> khôi phục
    await p.setInputFiles('#nhap-ls', file);
    await p.waitForTimeout(300);
    if (!/bỏ qua 2 lần trùng/.test(await p.textContent('#bao-ls'))) errs.push('nhập trùng sai: ' + await p.textContent('#bao-ls'));
    p.once('dialog', d => d.accept());
    await p.click('#xoa-het');
    await p.waitForTimeout(200);
    await p.setInputFiles('#nhap-ls', file);
    await p.waitForTimeout(300);
    if (!/Đã nhập 2 lần làm/.test(await p.textContent('#bao-ls'))) errs.push('khôi phục sai: ' + await p.textContent('#bao-ls'));
    // file lỗi
    fs.writeFileSync(ANH + 'loi.json', '{"lich_su":[{"id":1}]}');
    await p.setInputFiles('#nhap-ls', ANH + 'loi.json');
    await p.waitForTimeout(300);
    if (!/bỏ qua 1 bản ghi lỗi/.test(await p.textContent('#bao-ls'))) errs.push('không báo bản ghi lỗi');
    const sw = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (sw > 0) errs.push(w + ' cuộn ngang lịch sử');
    await ctx.close();
  }
  // 4. localStorage bị chặn hoàn toàn
  const ctx = await b.newContext();
  await ctx.addInitScript(() => {
    const nem = () => { throw new DOMException('chặn', 'SecurityError'); };
    Object.defineProperty(window, 'localStorage', { get: nem, configurable: true });
  });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('chặn bộ nhớ: ' + e.message));
  await lamHet(p, 'rubella--2-5');
  const n = await p.$$('.muc-cham');
  for (let i = 0; i < n.length; i++) await (await p.$(`#m${i}-100`)).evaluate(x => x.closest('label').click());
  await p.click('#luu-diem');
  if (!/Không lưu được/.test(await p.textContent('#bao-luu'))) errs.push('chặn bộ nhớ: không báo lỗi lưu');
  await p.goto(URL + '#/lich-su');
  await p.goto(URL + '#/nap');
  await p.waitForTimeout(200);
  await ctx.close();
  await b.close();
  console.log(errs.length ? errs.join('\n') : 'OK – tự chấm, lịch sử, xuất/nhập JSON, chặn localStorage đều đúng'); process.exitCode = errs.length ? 1 : 0;
})();

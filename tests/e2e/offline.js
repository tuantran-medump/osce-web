const { chromium } = require('playwright');
const { GOC, URL_GOC, ANH } = require('./chung.js');
const URL = URL_GOC;
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL);
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload();
  await p.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 30000 });
  const soTep = await p.evaluate(async () => { const ks = await caches.keys(); const c = await caches.open(ks[0]); return (await c.keys()).length; });
  const mf = await p.evaluate(async () => (await fetch('manifest.webmanifest')).json());
  if (!mf.icons || mf.icons.length < 3 || mf.display !== 'standalone') errs.push('manifest thiếu');
  await ctx.setOffline(true);
  for (const h of ['', '#/de/tsg--2-1', '#/ctg/3', '#/san-do/sd1', '#/tang-truong', '#/thi-thu', '#/lich-su', '#/huong-dan']) {
    await p.goto(URL + h);
    await p.waitForTimeout(300);
    const t = await p.textContent('main');
    if (!t || t.length < 50) errs.push('offline trống: ' + h);
  }
  // hình trong đề TSG 2.1 (ảnh đề thi) phải tải được khi offline
  await p.goto(URL + '#/de/tsg--2-1'); await p.waitForTimeout(500);
  const hinh = await p.evaluate(() => [...document.images].filter(i => i.getAttribute('src')).map(i => [i.src.split('/').pop(), i.complete && i.naturalWidth > 0]));
  if (!hinh.length || hinh.some(x => !x[1])) errs.push('hình offline lỗi: ' + JSON.stringify(hinh));
  await ctx.close(); await b.close();
  console.log('Đã lưu ' + soTep + ' tệp trong bộ nhớ offline');
  console.log(errs.join('\n') || 'OK – chạy offline đầy đủ, manifest hợp lệ'); process.exitCode = errs.length ? 1 : 0;
})();

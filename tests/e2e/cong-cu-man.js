const { chromium } = require('playwright');
const { GOC, URL_GOC, ANH } = require('./chung.js');
const OUT = ANH;
const URL = URL_GOC + 'index.html';
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [ten, w, h] of [['dien-thoai-390', 390, 844], ['ipad-820', 820, 1180], ['pc-1440', 1440, 900]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(w + ' ' + e.message));
    for (const hs of ['#/luyen-tap', '#/ctg', '#/ctg/1', '#/san-do', '#/san-do/sd6', '#/tang-truong', '#/thi-thu']) {
      await p.goto('about:blank'); await p.goto(URL + hs); await p.waitForTimeout(250);
      const sw = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (sw > 0) errs.push(`${w} cuộn ngang ${hs}`);
      await p.screenshot({ path: OUT + `cc-${ten}-${hs.replace(/[#/]/g, '_')}.png` });
    }
    await ctx.close();
  }
  await b.close(); console.log(errs.join('\n') || 'OK'); process.exitCode = errs.length ? 1 : 0;
})();

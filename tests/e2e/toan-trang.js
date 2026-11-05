const { chromium } = require('playwright');
const { GOC, URL_GOC, ANH } = require('./chung.js');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  // Mặc định: bản mẫu nhanh (2 cỡ, 1/10 số đề). DAY_DU=1: 6 cỡ, đủ 121 đề ở 360 và 1440px.
  const DAY_DU = process.env.DAY_DU === '1';
  const sizes = DAY_DU ? [[360, 740], [390, 844], [820, 1180], [1180, 820], [1280, 800], [1440, 900]] : [[390, 844], [1440, 900]];
  const data = require(GOC + '/data/stations.json');
  const ids = [];
  data.chuong.forEach(c => c.tram.forEach(t => t.de.forEach(d => ids.push(d.id))));
  for (const [w, h] of sizes) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', e => errs.push(`${w}: ${e.message}`));
    p.on('console', m => { if (m.type() === 'error') errs.push(`${w} console: ${m.text()}`); });
    const pages = ['#/', '#/c/c3', '#/tram/fgr', '#/huong-dan', '#/nap', '#/lich-su', '#/luyen-tap', '#/thi-thu', '#/ctg', ...Array.from({length:12},(_,i)=>'#/ctg/'+i), '#/san-do', '#/san-do/sd1','#/san-do/sd2','#/san-do/sd3','#/san-do/sd4','#/san-do/sd5','#/san-do/sd6', '#/tang-truong'];
    const list = DAY_DU && (w === 360 || w === 1440) ? ids : ids.filter((_, i) => i % 10 === 0);
    for (const hsh of pages.concat(list.map(i => '#/de/' + i))) {
      await p.goto('about:blank'); await p.goto(URL_GOC + 'index.html' + hsh);
      await p.waitForTimeout(30);
      if (hsh.startsWith('#/de/')) {
        for (let k = 0; k < 6; k++) { const btn = await p.$('[data-xong]'); if (!btn) break; await btn.click(); }
        const da = await p.$$('[data-dap-an]'); for (const x of da) await x.click();
        const kt = await p.$('#ket-thuc:not([hidden])');
        if (!kt) errs.push(`${w} ${hsh}: không tới màn kết thúc`);
      }
      const sw = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      if (sw[0] > sw[1]) {
        const wide = await p.evaluate(() => { const W = document.documentElement.clientWidth; return [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > W + 1).slice(0, 3).map(e => e.tagName + '.' + e.className + ':' + Math.round(e.getBoundingClientRect().right)); });
        errs.push(`${w} cuộn ngang ${hsh}: ${sw} ${wide.join(' | ')}`);
      }
    }
    await p.close();
  }
  await b.close();
  console.log(errs.length ? errs.slice(0, 40).join('\n') : 'OK – không lỗi, không cuộn ngang'); process.exitCode = errs.length ? 1 : 0;
})();

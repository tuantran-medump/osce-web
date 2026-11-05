const { chromium } = require('playwright');
const { GOC, URL_GOC, ANH } = require('./chung.js');
const OUT = ANH;
const scheme = process.argv[2] || 'light';
(async () => {
  
  const b = await chromium.launch();
  const cases = [
    ['dien-thoai-390', 390, 844],
    ['ipad-820', 820, 1180],
    ['pc-1440', 1440, 900],
  ];
  const DE = '#/de/tsg--2-2';
  for (const [ten, w, h] of cases) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, colorScheme: scheme, hasTouch: w < 1000, isMobile: w < 500 });
    const p = await ctx.newPage();
    const sfx = scheme === 'dark' ? '-toi' : '';
    await p.goto(URL_GOC + 'index.html#/c/c4');
    await p.waitForTimeout(200);
    await p.screenshot({ path: OUT + ten + sfx + '-1-trang-chu.png' });
    await p.goto(URL_GOC + 'index.html#/tram/tsg');
    await p.waitForTimeout(200);
    await p.screenshot({ path: OUT + ten + sfx + '-2-chon-de.png' });
    await p.goto(URL_GOC + 'index.html' + DE);
    await p.waitForTimeout(300);
    await p.screenshot({ path: OUT + ten + sfx + '-3-vao-tram.png' });
    // làm bước 1, 2 rồi mở đáp án bước 2
    await p.fill('#ghi-chu-0', 'Hỏi triệu chứng TSG nặng, tiền căn THA, PARA');
    await p.click('[data-xong="0"]');
    await p.waitForTimeout(300);
    await p.fill('#ghi-chu-1', 'Đo lại HA, khám phù, PXGX, BCTC, tim thai');
    await p.click('[data-xong="1"]');
    await p.waitForTimeout(400);
    await p.click('[data-dap-an="1"]');
    await p.waitForTimeout(200);
    await p.evaluate(() => document.getElementById('buoc-1').scrollIntoView({ block: 'start' }));
    await p.waitForTimeout(300);
    await p.screenshot({ path: OUT + ten + sfx + '-4-sau-buoc-2.png' });
    await ctx.close();
  }
  await b.close();
  console.log('xong');
})();

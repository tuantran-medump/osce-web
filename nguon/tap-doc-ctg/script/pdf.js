const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const dir = process.argv[2];
  const body = fs.readFileSync(dir + '/TapDocCTG.html', 'utf8');
  fs.writeFileSync(dir + '/full.html', '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + body + '</body></html>');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1024, height: 1366 } });
  await p.goto('file://' + dir + '/full.html', { waitUntil: 'networkidle' });
  await p.screenshot({ path: dir + '/shot-top.png' });
  const el = await p.$('#da2');
  await el.screenshot({ path: dir + '/shot-ans.png' });
  await p.pdf({ path: dir + '/TapDocCTG.pdf', format: 'A4', landscape: true, printBackground: true, preferCSSPageSize: true });
  await b.close();
})();

const { chromium } = require('playwright');
const { GOC, URL_GOC, ANH } = require('./chung.js');
const fs = require('fs');
const OUT = ANH;
const URL = URL_GOC + 'index.html';
const HOP_LE = `# TRẠM: Rubella
Mã: rubella
Chương: CHƯƠNG 2: NỬA ĐẦU THAI KÌ

## ĐỀ: Y22 đợt 1 – thử nạp
Nguồn đề: Y22 – đợt 1
Mã: rubella--y22-1

### Mở đầu

- Thai phụ 8 tuần mang kết quả Rubella IgM (-), IgG (-).

### BƯỚC: Hỏi bệnh

#### Đề

#### Kết quả

Soạn thêm:
- Chưa từng tiêm ngừa Rubella.

### BƯỚC: Xử trí – tư vấn

#### Đề

#### Đáp án riêng

- Lặp lại xét nghiệm mỗi 4 tuần đến 16 tuần.
`;
(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const [ten, w, h] of [['dien-thoai-390', 390, 844], ['pc-1440', 1440, 900]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, acceptDownloads: true });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(w + ' ' + e.message));
    await p.goto(URL + '#/nap');
    // file lỗi
    await p.setInputFiles('#nap-file', GOC + '/tests/mau-loi/thieu-mo-dau-chuong.md'); await p.waitForTimeout(300);
    await p.click('#nap-xem');
    await p.waitForTimeout(200);
    const loi = await p.textContent('#nap-ket-qua');
    if (!/Dòng 4:/.test(loi) || !(await p.isDisabled('#nap-luu'))) errs.push('không báo lỗi đúng: ' + loi);
    await p.screenshot({ path: OUT + ten + '-5-nap-loi.png', fullPage: false });
    // trùng với đề có sẵn: file ví dụ
    await p.fill('#nap-chu', fs.readFileSync(GOC + '/mau-nap/MAU_NAP_DE_OSCE.md', 'utf8'));
    await p.click('#nap-xem');
    const t2 = await p.textContent('#nap-ket-qua');
    if (!/Trùng mã đề/.test(t2) || !/Dòng \d+/.test(t2)) errs.push('không báo trùng: ' + t2.slice(0, 200));
    // hợp lệ -> lưu
    await p.fill('#nap-ten', 'rubella-y22.md');
    await p.fill('#nap-chu', HOP_LE);
    await p.click('#nap-xem');
    await p.waitForTimeout(200);
    if (await p.isDisabled('#nap-luu')) errs.push('hợp lệ mà không cho lưu: ' + (await p.textContent('#nap-ket-qua')));
    await p.click('.xem-de summary');
    await p.screenshot({ path: OUT + ten + '-6-nap-xem-truoc.png' });
    await Promise.all([p.waitForEvent('load'), p.click('#nap-luu')]);
    await p.waitForTimeout(300);
    const ds = await p.textContent('#nap-ds');
    if (!/rubella-y22.md/.test(ds)) errs.push('không thấy file đã lưu');
    const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-xuat="0"]')]);
    const xuat = fs.readFileSync(await dl.path(), 'utf8');
    if (xuat !== HOP_LE) errs.push('xuất .md khác nội dung');
    await p.goto(URL + '#/tram/rubella');
    await p.waitForTimeout(200);
    if (!/Y22 đợt 1 – thử nạp/.test(await p.textContent('main'))) errs.push('đề nạp không hiện trong trạm');
    await p.goto(URL + '#/de/rubella--y22-1');
    await p.click('[data-xong="0"]');
    await p.waitForTimeout(200);
    if (!/Chưa từng tiêm ngừa/.test(await p.textContent('#buoc-0'))) errs.push('kết quả soạn thêm không hiện');
    const sw = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (sw > 0) errs.push(w + ' cuộn ngang ở trang nạp');
    await ctx.close();
  }
  await b.close();
  console.log(errs.length ? errs.join('\n') : 'OK – trang Nạp đề chạy đúng'); process.exitCode = errs.length ? 1 : 0;
})();

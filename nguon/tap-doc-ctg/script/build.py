import cases, ctggen
from data import CASES

CSS = r"""
<title>Tập đọc CTG</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
/* Bố cục: một cột đọc, mỗi ca là một tờ băng CTG đặt trên "bàn" xám lạnh; đáp án tách hẳn phía sau */
:root{
  --bg:#eef1f4; --surface:#ffffff; --fg:#1c2330; --muted:#5a6473; --line:#d8dde4;
  --accent:#b8473c; --c1:#2f7d4f; --c2:#b7791f; --c3:#c0392b;
  --c1bg:#e5f3ea; --c2bg:#fbf1dc; --c3bg:#fbe4e1;
  --body:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#151a21; --surface:#1e252e; --fg:#e6eaf0; --muted:#9aa5b4; --line:#323b47;
  --accent:#e67a6c; --c1:#6cc28f; --c2:#e3b25a; --c3:#f08072;
  --c1bg:#1d3327; --c2bg:#3a2f18; --c3bg:#3d1f1c; color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#151a21; --surface:#1e252e; --fg:#e6eaf0; --muted:#9aa5b4; --line:#323b47;
  --accent:#e67a6c; --c1:#6cc28f; --c2:#e3b25a; --c3:#f08072;
  --c1bg:#1d3327; --c2bg:#3a2f18; --c3bg:#3d1f1c; color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--body);font-size:16px;line-height:1.6;
  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:24px 64px}
.wrap{max-width:1080px;margin:0 auto;display:flex;flex-direction:column;gap:28px}
h1{font-size:2rem;line-height:1.2;margin:0;text-wrap:balance;font-weight:700}
h2{font-size:1.35rem;margin:0;text-wrap:balance}
h3{font-size:1.1rem;margin:0}
.eyebrow{font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);font-weight:600}
p{margin:0}
.lead{color:var(--muted);max-width:68ch}
.intro{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.box{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:16px 18px;min-width:0}
.box ol,.box ul{margin:6px 0 0;padding-left:1.3em}
.case{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:18px;display:flex;flex-direction:column;gap:12px;scroll-margin-top:16px}
.case-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
.case-head a{font-size:.9rem;color:var(--accent);text-decoration:none;font-weight:600}
.ctx{max-width:80ch}
.strip{overflow-x:auto;border-radius:6px;border:1px solid #e3c9c4;background:#fffdf8}
.strip svg{display:block;width:100%;min-width:760px;height:auto}
.strip + .strip{margin-top:6px}
.q{margin:0;padding-left:1.3em}
.ctg .hd{font:600 12px var(--body);fill:#333}
.ctg .sc{font:9px var(--mono);fill:#b04a3f}
.ctg .mid{paint-order:stroke;stroke:#fffdf8;stroke-width:3px}
.ctg .un{font:9px var(--body);fill:#b04a3f}
.ctg .tm{font:600 10px var(--mono);fill:#333}
.ctg .sp{font:9px var(--body);fill:#666}
.ctg .nt{font:700 11px var(--body);fill:#1b5fa8}
.divider{border:0;border-top:2px dashed var(--line);margin:12px 0}
.key{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
.key td,.key th{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
.tbl{overflow-x:auto}
.chip{display:inline-block;padding:1px 10px;border-radius:999px;font-size:.85rem;font-weight:600;white-space:nowrap}
.k1{background:var(--c1bg);color:var(--c1)} .k2{background:var(--c2bg);color:var(--c2)} .k3{background:var(--c3bg);color:var(--c3)}
.ans{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:18px;display:flex;flex-direction:column;gap:12px;scroll-margin-top:16px}
.ans .rows{width:100%;border-collapse:collapse}
.ans .rows th{width:9.5em;text-align:left;vertical-align:top;padding:7px 10px 7px 0;color:var(--muted);font-weight:600;font-size:.92rem;border-bottom:1px solid var(--line)}
.ans .rows td{padding:7px 0;border-bottom:1px solid var(--line);vertical-align:top}
.blk{display:flex;flex-direction:column;gap:4px}
.blk h4{margin:0;font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;color:var(--accent)}
.ket{padding:10px 14px;border-radius:8px}
.trap{border-left:3px solid var(--c2);padding:4px 0 4px 12px}
.src{font-size:.85rem;color:var(--muted)}
a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (max-width:700px){.intro{grid-template-columns:1fr}h1{font-size:1.6rem}.ans .rows th{width:7em}}
@media print{
  @page{size:A4 landscape;margin:10mm}
  body{background:#fff;padding:0;font-size:12px}
  .wrap{max-width:none;gap:14px}
  .case,.ans{break-inside:avoid;page-break-inside:avoid;border:none;padding:0}
  .case{break-before:page}
  .ans{break-before:page}
  .strip svg{min-width:0}
  .case.two .strip svg{width:54%;margin:0 auto}
  .case.two{display:block}
  .case.two>*{margin-bottom:8px}
  .strip{overflow:visible}
  .divider{display:none}
  .case-head a,.ans a.back{display:none}
}
</style>
"""

TOM = {
 "c1": "NST 38 tuần: 5 nhịp tăng 15 × 15, dao động trung bình",
 "c6": "Cơn co nhiều do oxytocin, nhịp giảm muộn lặp lại, dao động trung bình",
 "c2": "Nhịp giảm sớm lặp lại khi ngôi +2",
 "c10": "Nhau bong non: tăng trương lực, nhịp chậm 90, mất dao động",
 "c5": "Dao động tối thiểu đơn độc sau pethidine",
 "c7": "Nhịp giảm bất định lặp lại, dao động trung bình",
 "c3": "Nhịp nhanh 170 do nhiễm trùng ối",
 "c9": "Mất dao động + nhịp giảm muộn lặp lại (TSG, FGR)",
 "c8": "Nhịp giảm kéo dài sau tê ngoài màng cứng, tụt HA",
 "c12": "Dao động tăng (> 25) ở thai phụ ĐTĐ kiểm soát kém",
 "c4": "Nhịp chậm 100 đơn độc, dao động trung bình",
 "c11": "Biểu đồ hình sin thực ≥ 20 phút",
}

def chip(c):
    return f'<span class="chip k{c["catn"]}">{c["cat"]}</span>'

def strips(c, i):
    s = getattr(cases, c["gen"])()
    hd = f"Ca {i} · {'NST' if c['gen']=='c1' else 'CTG'} · Thai phụ {c['ctx'].split(',')[0].replace('Chị ','')}"
    notes = c.get("notes", ())
    if c.get("rows2"):
        return "".join(f'<div class="strip">{ctggen.render(s, header=hd + f" · hàng {k+1}/2", times=c["time"], window=(10*k, 10*k+10))}</div>' for k in range(2))
    return f'<div class="strip">{ctggen.render(s, header=hd, times=c["time"], notes=notes)}</div>'

out = [CSS, '<div class="wrap">']
out.append('''<header style="display:flex;flex-direction:column;gap:10px">
<div class="eyebrow">Sản khoa Y4 · Lượng giá sức khỏe thai</div>
<h1>Tập đọc CTG: 12 băng ghi mô phỏng</h1>
<p class="lead">Mỗi ca gồm bối cảnh lâm sàng, băng ghi và 3 câu hỏi kiểu trạm OSCE. Đọc và tự trả lời trên giấy trước, sau đó mới xem phần đáp án ở cuối trang. Băng ghi được vẽ bằng máy tính để luyện đọc, không phải băng ghi của bệnh nhân thật.</p>
</header>''')
out.append('''<section class="intro">
<div class="box"><h3>Trình tự đọc (ACOG 2009)</h3>
<ol><li><b>Cơn co</b>: tần số/10 phút, co:nghỉ, trương lực căn bản, cường độ, biên độ.</li>
<li><b>Tim thai cơ bản</b>: trung bình 10 phút, làm tròn 5. Bình thường 110–160.</li>
<li><b>Dao động nội tại</b>: mất · tối thiểu ≤ 5 · trung bình 6–25 · tăng &gt; 25.</li>
<li><b>Biến động tức thời</b>: nhịp tăng; nhịp giảm (định danh bằng thời gian, rồi tốc độ, rồi liên hệ cơn co).</li>
<li>Phân loại I / II / III, rồi lí giải và xử trí.</li></ol></div>
<div class="box"><h3>Cách đọc giấy</h3>
<ul><li>Phần trên: tim thai 50–210 nhịp/phút, vạch mảnh 10 nhịp, vạch đậm 30 nhịp.</li>
<li>Phần dưới: áp lực buồng tử cung 0–100 mmHg, vạch mảnh 10 mmHg.</li>
<li>Băng chuyển dạ in ở tốc độ <b>3 cm/phút</b>: ô dọc mảnh = 20 giây, vạch đậm = 1 phút, mỗi băng 10 phút.</li>
<li>Băng NST ca đầu in ở <b>1 cm/phút</b>: ô dọc mảnh = 1 phút, 30 phút.</li>
<li>Giờ in ở giữa băng. Trên điện thoại, kéo ngang để xem hết băng.</li></ul></div>
</section>''')

for i, c in enumerate(CASES, 1):
    qs = "".join(f"<li>{q}</li>" for q in c["q"])
    out.append(f'''<section class="case{' two' if c.get('rows2') else ''}" id="ca{i}"><div class="case-head"><h2>Ca {i}</h2><a href="#da{i}">Xem đáp án ca {i} ↓</a></div>
<p class="ctx">{c["ctx"]}</p>{strips(c, i)}<ol class="q">{qs}</ol></section>''')

out.append('<hr class="divider"><section id="dapan" class="box" style="break-before:page"><div class="eyebrow">Đáp án</div><h2>Bảng tóm tắt</h2><div class="tbl"><table class="key"><tr><th>Ca</th><th>Điểm chính</th><th>Phân loại</th></tr>')
for i, c in enumerate(CASES, 1):
    out.append(f'<tr><td><a href="#da{i}">Ca {i}</a></td><td>{TOM[c["gen"]]}</td><td>{chip(c)}</td></tr>')
out.append('</table></div></section>')

for i, c in enumerate(CASES, 1):
    rows = "".join(f"<tr><th>{k}</th><td>{v}</td></tr>" for k, v in c["rows"])
    out.append(f'''<section class="ans" id="da{i}"><div class="case-head"><h2>Đáp án ca {i} {chip(c)}</h2><a class="back" href="#ca{i}">↑ Về băng ca {i}</a></div>
<table class="rows">{rows}</table>
<div class="ket k{c["catn"]}">{c["ket"]}</div>
<div class="blk"><h4>Lí giải</h4><p>{c["li"]}</p></div>
<div class="blk"><h4>Xử trí</h4><p>{c["xt"]}</p></div>
<div class="trap"><b>Bẫy:</b> {c["bay"]}</div>
<p class="src">Nguồn: {c["src"]}</p></section>''')

out.append('<p class="src">Tiêu chuẩn theo Handout CTG căn bản (Âu Nhựt Luân 2020, danh pháp ACOG 2009), Chương 3 và Chương 5 tài liệu Sản Y4, OSCE Y21. Ý ngoài tài liệu ghi rõ nguồn ACOG.</p></div>')
open("TapDocCTG.html", "w").write("\n".join(out))
print("ok")

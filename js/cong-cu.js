/* Các trang công cụ luyện tập: Tập đọc CTG, Tập sản đồ WHO, Biểu đồ tăng trưởng.
   Đăng ký vào window.OSCE_TRANG; dùng hàm chung từ window.OSCE_APP (js/app.js) lúc chạy. */
(function () {
  "use strict";
  var CC = window.OSCE_CONGCU || {};
  var T = (window.OSCE_TRANG = window.OSCE_TRANG || {});
  function A() { return window.OSCE_APP; }
  function esc(s) { return A().esc(s); }
  function $(id) { return document.getElementById(id); }
  function radio(ten, ds, kieu) {
    return '<div class="lua-chon' + (kieu ? " " + kieu : "") + '" role="radiogroup">' + ds.map(function (x) {
      return '<label class="o-chon"><input type="radio" name="' + ten + '" value="' + x[0] + '"><span>' + x[1] + "</span></label>";
    }).join("") + "</div>";
  }
  function giaTri(ten) { var x = document.querySelector('input[name="' + ten + '"]:checked'); return x ? x.value : null; }
  function soVN(x, le) { return Number(x).toLocaleString("vi-VN", { maximumFractionDigits: le === undefined ? 1 : le }); }

  /* =====================================================================
     1. TẬP ĐỌC CTG
     ===================================================================== */
  var DAO_DONG = [["mat", "Mất (< 2)"], ["toi_thieu", "Tối thiểu (≤ 5)"], ["trung_binh", "Trung bình (6–25)"], ["tang", "Tăng (> 25)"], ["hinh_sin", "Hình sin"]];
  var NHIP_GIAM = [["khong", "Không có"], ["som", "Sớm"], ["muon", "Muộn"], ["bat_dinh", "Bất định"], ["keo_dai", "Kéo dài"]];
  var XU_TRI = [
    ["A", "Theo dõi thường quy (thai kì / chuyển dạ)"],
    ["B", "Hồi sức trong tử cung, xử trí nguyên nhân, theo dõi EFM liên tục"],
    ["C", "Chấm dứt chuyển dạ / thai kì ngay (thường mổ lấy thai cấp cứu)"]
  ];
  function nhanCua(ds, v) { for (var i = 0; i < ds.length; i++) if (ds[i][0] === v) return ds[i][1]; return v; }

  T.ctg = function (p) {
    var ds = (CC.ctg && CC.ctg.ca) || [];
    if (p[0] !== undefined && p[0] !== "") return trangCaCTG(parseInt(p[0], 10), p[1] ? parseInt(p[1], 10) : null);
    A().datTieuDe("Tập đọc CTG");
    var h = '<div class="trang-hep"><nav class="dieu-huong"><a href="#/luyen-tap">‹ Luyện tập</a></nav><h1>Tập đọc CTG</h1>';
    h += '<p class="phu">12 băng ghi mô phỏng kèm bối cảnh và đáp án lấy từ <code>nguon/tap-doc-ctg</code> (Handout CTG, danh pháp ACOG 2009). ' +
      "Băng được vẽ bằng máy tính để luyện đọc, không phải băng ghi của bệnh nhân thật. Nút <strong>Băng mới</strong> sinh băng khác cùng kiểu ca (dao động, thời điểm cơn co thay đổi).</p>";
    h += '<div class="hang-boc"><button type="button" class="nut nut-chinh nut-to" id="ctg-moi">🎲 Băng mới ngẫu nhiên</button></div>';
    h += '<details class="the ly-thuyet"><summary>Trình tự đọc (ACOG 2009)</summary><ol>' +
      "<li><b>Cơn co</b>: tần số/10 phút, co:nghỉ, trương lực căn bản, cường độ, biên độ.</li>" +
      "<li><b>Tim thai cơ bản</b>: trung bình 10 phút, làm tròn 5. Bình thường 110–160.</li>" +
      "<li><b>Dao động nội tại</b>: mất · tối thiểu ≤ 5 · trung bình 6–25 · tăng &gt; 25.</li>" +
      "<li><b>Biến động tức thời</b>: nhịp tăng; nhịp giảm (định danh bằng thời gian, rồi tốc độ, rồi liên hệ cơn co).</li>" +
      "<li>Phân loại I / II / III, rồi lí giải và xử trí.</li></ol><p class=\"phu\">Theo phần giới thiệu của Tập đọc CTG (nguon/tap-doc-ctg).</p></details>";
    h += '<ul class="danh-sach">';
    ds.forEach(function (c, i) {
      h += '<li><a class="the the-lien-ket" href="#/ctg/' + i + '"><span class="noi-dung"><span class="ten">Ca ' + (i + 1) + "</span><span class=\"phu\">" +
        c.ctx.replace(/<[^>]+>/g, "").slice(0, 140) + "…</span></span><span class=\"mui-ten\" aria-hidden=\"true\">›</span></a></li>";
    });
    h += "</ul></div>";
    A().veLai(h);
    $("ctg-moi").addEventListener("click", function () {
      location.hash = "#/ctg/" + Math.floor(Math.random() * ds.length) + "/" + (1000 + Math.floor(Math.random() * 900000));
    });
  };

  function trangCaCTG(i, seed) {
    var c = CC.ctg.ca[i];
    if (!c) return T.ctg([]);
    var khoa = CC.ctg.khoa[c.gen];
    var moi = seed !== null && !isNaN(seed);
    A().datTieuDe("Tập đọc CTG – ca " + (i + 1));
    var strip = window.CTG.sinh(c.gen, moi ? seed : undefined);
    var hd = "Ca " + (i + 1) + " · " + (c.gen === "c1" ? "NST" : "CTG") + " · Thai phụ " + c.ctx.split(",")[0].replace("Chị ", "");
    var bang = c.rows2
      ? [0, 1].map(function (k) { return window.CTG.render(strip, { header: hd + " · hàng " + (k + 1) + "/2", times: c.time, window: [10 * k, 10 * k + 10] }); })
      : [window.CTG.render(strip, { header: hd, times: c.time, notes: c.notes || [] })];
    var h = '<div class="trang-hep"><nav class="dieu-huong"><a href="#/ctg">‹ Tập đọc CTG</a></nav>';
    h += "<h1>Ca " + (i + 1) + (moi ? ' <span class="chip">băng mới · mã ' + seed + "</span>" : "") + "</h1>";
    h += '<p class="ctg-ctx">' + c.ctx + "</p>";
    if (moi) h += '<p class="phu">Băng sinh mới cùng kiểu với ca ' + (i + 1) + ": hình dạng, thời điểm cơn co và nhịp biến động có thể khác băng gốc; tiêu chí và đáp án giữ nguyên.</p>";
    h += "</div>";
    h += '<div class="khung-ctg"><div class="hang-nut"><button type="button" class="nut nut-nho" id="ctg-thu" aria-pressed="false">Thu vừa khung</button>' +
      '<button type="button" class="nut nut-nho" id="ctg-khac">🎲 Băng mới cùng kiểu</button></div>' +
      bang.map(function (b) { return '<div class="bang-ctg">' + b + "</div>"; }).join("") + "</div>";
    h += '<div class="trang-hep"><ol class="cau-hoi">' + c.q.map(function (q) { return "<li>" + q + "</li>"; }).join("") + "</ol>";
    h += '<form class="the form-ctg" id="form-ctg" novalidate>' +
      '<div class="o-dien" data-o="con_co"><label for="ctg-cc">Cơn co (số cơn / 10 phút)</label><input id="ctg-cc" class="o-chu o-so" type="number" inputmode="numeric" min="0" max="10" step="1"><p class="giai-thich" hidden></p></div>' +
      '<div class="o-dien" data-o="nen"><label for="ctg-nen">Tim thai cơ bản (nhịp/phút)</label><input id="ctg-nen" class="o-chu o-so" type="number" inputmode="numeric" min="50" max="210" step="5"><p class="giai-thich" hidden></p></div>' +
      '<fieldset class="o-dien" data-o="dao_dong"><legend>Dao động nội tại</legend>' + radio("dao_dong", DAO_DONG) + '<p class="giai-thich" hidden></p></fieldset>' +
      '<fieldset class="o-dien" data-o="nhip_tang"><legend>Nhịp tăng</legend>' + radio("nhip_tang", [["co", "Có"], ["khong", "Không"]]) + '<p class="giai-thich" hidden></p></fieldset>' +
      '<fieldset class="o-dien" data-o="nhip_giam"><legend>Nhịp giảm (loại)</legend>' + radio("nhip_giam", NHIP_GIAM) + '<p class="giai-thich" hidden></p></fieldset>' +
      '<fieldset class="o-dien" data-o="nhom"><legend>Phân nhóm (ACOG 2009)</legend>' + radio("nhom", [["1", "Nhóm I"], ["2", "Nhóm II"], ["3", "Nhóm III"]]) + '<p class="giai-thich" hidden></p></fieldset>' +
      '<fieldset class="o-dien" data-o="xu_tri"><legend>Xử trí</legend>' + radio("xu_tri", XU_TRI, "doc") + '<p class="giai-thich" hidden></p></fieldset>' +
      '<div class="hang-nut"><button type="submit" class="nut nut-chinh">Kiểm tra</button><button type="button" class="nut" id="ctg-lai">Làm lại</button></div>' +
      '<p id="ctg-tong" class="tong-ctg" role="status"></p></form>';
    h += '<section id="ctg-dap-an" class="the" hidden></section></div>';
    A().veLai(h);

    $("ctg-thu").addEventListener("click", function () {
      var on = this.getAttribute("aria-pressed") !== "true";
      this.setAttribute("aria-pressed", String(on));
      this.textContent = on ? "Phóng to (kéo ngang)" : "Thu vừa khung";
      document.querySelector(".khung-ctg").classList.toggle("vua-khung", on);
    });
    $("ctg-khac").addEventListener("click", function () { location.hash = "#/ctg/" + i + "/" + (1000 + Math.floor(Math.random() * 900000)); });
    $("ctg-lai").addEventListener("click", function () { trangCaCTG(i, moi ? seed : null); });
    $("form-ctg").addEventListener("submit", function (e) {
      e.preventDefault();
      kiemTraCTG(c, khoa);
    });
  }

  function hangGoc(c, ten) {
    for (var k = 0; k < c.rows.length; k++) if (c.rows[k][0] === ten) return c.rows[k][1];
    return "";
  }

  function kiemTraCTG(c, khoa) {
    var dung = 0, tong = 0;
    function dat(o, ok, chu) {
      tong++;
      if (ok) dung++;
      var el = document.querySelector('[data-o="' + o + '"]');
      el.classList.remove("dung", "sai");
      el.classList.add(ok ? "dung" : "sai");
      var g = el.querySelector(".giai-thich");
      g.hidden = false;
      g.innerHTML = (ok ? "✓ Đúng. " : "✗ Chưa đúng. ") + chu;
    }
    var cc = $("ctg-cc").value === "" ? null : parseInt($("ctg-cc").value, 10);
    dat("con_co", cc !== null && cc >= khoa.con_co[0] && cc <= khoa.con_co[1],
      "Đáp án: " + (khoa.con_co[0] === khoa.con_co[1] ? khoa.con_co[0] : khoa.con_co[0] + "–" + khoa.con_co[1]) + " cơn/10 phút. " + hangGoc(c, "Cơn co"));
    var nen = $("ctg-nen").value === "" ? null : parseInt($("ctg-nen").value, 10);
    dat("nen", nen !== null && Math.abs(nen - khoa.nen) <= 5, "Đáp án: " + khoa.nen + " nhịp/phút (chấp nhận ±5). " + hangGoc(c, "Tim thai cơ bản"));
    var v = giaTri("dao_dong");
    dat("dao_dong", v === khoa.dao_dong, "Đáp án: " + nhanCua(DAO_DONG, khoa.dao_dong) + ". " + hangGoc(c, "Dao động nội tại"));
    v = giaTri("nhip_tang");
    dat("nhip_tang", v === khoa.nhip_tang, "Đáp án: " + (khoa.nhip_tang === "co" ? "Có" : "Không") + ". " + hangGoc(c, "Nhịp tăng"));
    v = giaTri("nhip_giam");
    dat("nhip_giam", v === khoa.nhip_giam, "Đáp án: " + nhanCua(NHIP_GIAM, khoa.nhip_giam) + ". " + hangGoc(c, "Nhịp giảm"));
    v = giaTri("nhom");
    dat("nhom", v === String(khoa.nhom), "Đáp án: nhóm " + ["", "I", "II", "III"][khoa.nhom] + ". " + c.ket);
    v = giaTri("xu_tri");
    dat("xu_tri", v === khoa.xu_tri, "Đáp án: " + nhanCua(XU_TRI, khoa.xu_tri) + ".<br>" + c.xt);
    $("ctg-tong").innerHTML = "<strong>" + dung + "/" + tong + "</strong> ô đúng.";
    var da = $("ctg-dap-an");
    da.hidden = false;
    da.innerHTML = "<h2>Đáp án đầy đủ</h2><table class=\"bang-ctg-da\">" + c.rows.map(function (r) { return "<tr><th>" + r[0] + "</th><td>" + r[1] + "</td></tr>"; }).join("") +
      "</table><div class=\"khoi-nguon\">" + c.ket + "</div><h3>Lí giải</h3><p>" + c.li + "</p><h3>Xử trí</h3><p>" + c.xt + "</p>" +
      '<p class="bay"><b>Bẫy:</b> ' + c.bay + '</p><p class="phu">Nguồn: ' + c.src + ". Đáp án lấy nguyên văn từ nguon/tap-doc-ctg; ô chọn Xử trí A/B/C là cách gom nhóm của trang này.</p>";
  }

  /* =====================================================================
     2. TẬP SẢN ĐỒ WHO (bản rút gọn: bắt đầu 4 cm, đường hành động cách 4 giờ)
     ===================================================================== */
  var SD = { L: 64, cw: 26, rh: 30, top: 34, gioRow: 26, ccTop: 0, ccRow: 18, cot: 24 };
  SD.H1 = 10 * SD.rh;
  SD.ccTop = SD.top + SD.H1 + SD.gioRow + 14;
  SD.W = SD.L + SD.cot * SD.cw + 16;
  SD.H = SD.ccTop + 5 * SD.ccRow + 30;
  var XU_TRI_SD = [["theo_doi", "Tiếp tục theo dõi"], ["pha_oi", "Phá ối"], ["tang_co", "Tăng co (oxytocin)"], ["pha_oi_tang_co", "Phá ối + tăng co"], ["mo", "Mổ lấy thai"]];
  var VI_TRI = [["trai", "Bên trái đường báo động"], ["giua", "Đã qua phải đường báo động, chưa chạm đường hành động"], ["hanh_dong", "Chạm / cắt đường hành động"]];
  var LOAI_CC = [["<20", "< 20 giây"], ["20-40", "20–40 giây"], [">40", "> 40 giây"]];

  function phut(g) { var a = g.split(":"); return +a[0] * 60 + +a[1]; }
  function cotKham(th) {
    // cột (nửa giờ) của từng lần khám; lần đầu nằm trên đường báo động (x = cm - 4 giờ)
    var t0 = phut(th.kham[0].gio), c0 = (th.kham[0].cm - 4) * 2;
    return th.kham.map(function (k) {
      var d = phut(k.gio) - t0;
      if (d < 0) d += 1440;
      return c0 + Math.round(d / 30);
    });
  }

  T["san-do"] = function (p) {
    var ds = (CC.san_do && CC.san_do.tinh_huong) || [];
    if (p[0]) {
      for (var i = 0; i < ds.length; i++) if (ds[i].id === p[0]) return trangSanDo(ds[i], i);
    }
    A().datTieuDe("Tập sản đồ");
    var h = '<div class="trang-hep"><nav class="dieu-huong"><a href="#/luyen-tap">‹ Luyện tập</a></nav><h1>Tập sản đồ WHO</h1>';
    h += '<p class="phu">Sản đồ WHO bản rút gọn: pha hoạt động bắt đầu từ 4 cm, điểm X đầu tiên ghi trên đường báo động, đường hành động cách 4 giờ. ' +
      "Chạm vào sản đồ để chấm độ mở cổ tử cung (X), độ lọt (O) và cơn co của từng lần khám, rồi bấm Kiểm tra. 6 tình huống dựa trên Chương 5 tài liệu OSCE Y21; nguồn ghi ở từng tình huống.</p>";
    h += '<ul class="danh-sach">';
    ds.forEach(function (t, i) {
      h += '<li><a class="the the-lien-ket" href="#/san-do/' + t.id + '"><span class="noi-dung"><span class="ten">' + (i + 1) + ". " + esc(t.ten) + '</span><span class="phu">' + esc(t.nguon) +
        "</span>" + (t.soan_them ? '<span class="dong-chip"><span class="chip chip-st">có dữ kiện soạn thêm</span></span>' : "") + '</span><span class="mui-ten" aria-hidden="true">›</span></a></li>';
    });
    h += "</ul></div>";
    A().veLai(h);
  };

  function trangSanDo(th, idx) {
    A().datTieuDe("Tập sản đồ – " + th.ten);
    var cot = cotKham(th);
    var S = { k: 0, che: "x", loai: "20-40", ve: th.kham.map(function () { return { x: null, o: null, cc: null }; }), daKiem: false };
    var h = '<div class="trang-hep"><nav class="dieu-huong"><a href="#/san-do">‹ Tập sản đồ</a></nav>';
    h += "<h1>" + (idx + 1) + ". " + esc(th.ten) + '</h1><p class="phu">Nguồn: ' + esc(th.nguon) + "</p>";
    h += '<div class="' + (th.soan_them ? "khoi-st" : "khoi-nguon") + '">' + (th.soan_them ? '<span class="nhan nhan-st">dữ kiện có soạn thêm</span>' : "") +
      "<p>" + esc(th.boi_canh) + '</p><ol class="ds-kham" id="ds-kham"></ol></div>';
    h += '<div class="cong-cu-sd"><div class="lua-chon" role="radiogroup" aria-label="Chấm gì">' +
      [["x", "✕ Độ mở CTC"], ["o", "◯ Độ lọt"], ["cc", "▦ Cơn co"]].map(function (x) {
        return '<label class="o-chon"><input type="radio" name="sd-che" value="' + x[0] + '"' + (x[0] === "x" ? " checked" : "") + "><span>" + x[1] + "</span></label>";
      }).join("") + '</div><div class="lua-chon" id="sd-loai" role="radiogroup" aria-label="Thời gian mỗi cơn co" hidden>' +
      LOAI_CC.map(function (x) {
        return '<label class="o-chon"><input type="radio" name="sd-loai" value="' + x[0] + '"' + (x[0] === "20-40" ? " checked" : "") + "><span>" + x[1] + "</span></label>";
      }).join("") + "</div>" +
      '<p class="phu" id="sd-goi-y" role="status"></p></div></div>';
    h += '<div class="khung-sd"><div class="bang-sd" id="bang-sd"></div></div>';
    h += '<div class="trang-hep"><div class="hang-nut"><button type="button" class="nut" id="sd-xoa">Xóa điểm lần khám đang chọn</button>' +
      '<button type="button" class="nut nut-chinh" id="sd-kiem">Kiểm tra sản đồ</button></div><p id="sd-ket-qua" class="tong-ctg" role="status"></p>';
    h += '<form class="the" id="sd-hoi" hidden novalidate><fieldset class="o-dien" data-o="vi_tri"><legend>Đường biểu diễn độ mở cổ tử cung ở lần khám cuối</legend>' + radio("sd-vi-tri", VI_TRI, "doc") +
      '<p class="giai-thich" hidden></p></fieldset><fieldset class="o-dien" data-o="xu_tri"><legend>Xử trí</legend>' + radio("sd-xu-tri", XU_TRI_SD, "doc") +
      '<p class="giai-thich" hidden></p></fieldset><div class="hang-nut"><button type="submit" class="nut nut-chinh">Kiểm tra câu trả lời</button></div></form>' +
      '<section class="the" id="sd-giai" hidden></section></div>';
    A().veLai(h);

    function veDsKham() {
      $("ds-kham").innerHTML = th.kham.map(function (k, i) {
        var v = S.ve[i];
        return '<li><button type="button" class="nut-kham' + (i === S.k ? " dang" : "") + '" data-k="' + i + '" aria-pressed="' + (i === S.k) + '"><strong>' + k.gio + "</strong> · CTC " + k.cm + " cm · đầu " +
          esc(k.lot_chu) + " (" + k.lot + "/5) · cơn co " + k.con_co + "/10 phút, " + nhanCua(LOAI_CC, k.loai) + " · ối " + k.oi + " · chồng xương " + esc(k.chong) +
          '<span class="trang-thai-kham" aria-label="Đã chấm: ' + [v.x ? "độ mở" : "", v.o ? "độ lọt" : "", v.cc ? "cơn co" : ""].filter(Boolean).join(", ") + '">' +
          '<span class="' + (v.x ? "co" : "chua") + '">✕</span><span class="' + (v.o ? "co" : "chua") + '">◯</span><span class="' + (v.cc ? "co" : "chua") + '">▦</span></span></button></li>';
      }).join("");
      document.querySelectorAll(".nut-kham").forEach(function (b) {
        b.addEventListener("click", function () { S.k = +b.getAttribute("data-k"); veDsKham(); goiY(); });
      });
    }
    function goiY() {
      var k = th.kham[S.k];
      $("sd-goi-y").textContent = "Lần khám " + (S.k + 1) + " (" + k.gio + "): " +
        (S.che === "x" ? "chạm vào ô độ mở cổ tử cung." : S.che === "o" ? "chạm vào ô độ lọt (thang 5→0 bên trái)." : "chạm vào cột cơn co, chọn số ô (1–5) và thời gian mỗi cơn.");
    }
    document.querySelectorAll('input[name="sd-che"]').forEach(function (x) {
      x.addEventListener("change", function () { S.che = x.value; $("sd-loai").hidden = S.che !== "cc"; goiY(); });
    });
    document.querySelectorAll('input[name="sd-loai"]').forEach(function (x) { x.addEventListener("change", function () { S.loai = x.value; }); });
    $("sd-xoa").addEventListener("click", function () { S.ve[S.k] = { x: null, o: null, cc: null }; S.daKiem = false; ve(); veDsKham(); });
    $("sd-kiem").addEventListener("click", kiem);
    $("sd-hoi").addEventListener("submit", function (e) { e.preventDefault(); kiemHoi(); });

    function ve() { $("bang-sd").innerHTML = veSVG(th, S, cot); gan(); }
    function gan() {
      var svg = $("bang-sd").querySelector("svg");
      svg.addEventListener("click", function (e) {
        var pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        var m = svg.getScreenCTM();
        if (!m) return;
        var q = pt.matrixTransform(m.inverse());
        cham(q.x, q.y);
      });
    }
    function cham(x, y) {
      var c = Math.round((x - SD.L) / SD.cw);
      if (S.che === "cc") {
        var cell = Math.floor((x - SD.L) / SD.cw);
        if (cell < 0 || cell >= SD.cot || y < SD.ccTop || y > SD.ccTop + 5 * SD.ccRow) return;
        var so = 5 - Math.floor((y - SD.ccTop) / SD.ccRow);
        S.ve[S.k].cc = { col: cell, so: Math.max(1, Math.min(5, so)), loai: S.loai };
      } else {
        if (c < 0 || c > SD.cot || y < SD.top - 6 || y > SD.top + SD.H1 + 6) return;
        var v = Math.round((SD.top + SD.H1 - y) / SD.rh);
        if (S.che === "x") S.ve[S.k].x = { col: c, cm: Math.max(0, Math.min(10, v)) };
        else S.ve[S.k].o = { col: c, lot: Math.max(0, Math.min(5, v)) };
      }
      S.daKiem = false;
      ve();
      veDsKham();
      // tự chuyển sang lần khám chưa chấm đủ
    }
    function kiem() {
      S.daKiem = true;
      var dung = 0, tong = 0, thieu = 0;
      th.kham.forEach(function (k, i) {
        var v = S.ve[i];
        S.ve[i].dung = {
          x: !!v.x && v.x.col === cot[i] && v.x.cm === k.cm,
          o: !!v.o && v.o.col === cot[i] && v.o.lot === k.lot,
          cc: !!v.cc && v.cc.col === cot[i] && v.cc.so === k.con_co && v.cc.loai === k.loai
        };
        ["x", "o", "cc"].forEach(function (z) { tong++; if (S.ve[i].dung[z]) dung++; if (!v[z]) thieu++; });
      });
      ve();
      $("sd-ket-qua").innerHTML = "<strong>" + dung + "/" + tong + "</strong> điểm chấm đúng" + (thieu ? " · còn " + thieu + " điểm chưa chấm" : "") +
        ". Điểm sai tô đỏ; vị trí đúng vẽ nét đứt xanh. Mỗi điểm X/O nằm trên vạch giờ của lần khám (ô nhỏ = 30 phút); cơn co tô ở cột nửa giờ bắt đầu từ giờ khám.";
      $("sd-hoi").hidden = false;
    }
    function kiemHoi() {
      var vt = giaTri("sd-vi-tri"), xt = giaTri("sd-xu-tri");
      function dat(o, ok, chu) {
        var el = document.querySelector('#sd-hoi [data-o="' + o + '"]');
        el.classList.remove("dung", "sai");
        el.classList.add(ok ? "dung" : "sai");
        var g = el.querySelector(".giai-thich");
        g.hidden = false;
        g.innerHTML = (ok ? "✓ Đúng. " : "✗ Chưa đúng. ") + chu;
      }
      dat("vi_tri", vt === th.vi_tri, "Đáp án: " + nhanCua(VI_TRI, th.vi_tri) + ".");
      dat("xu_tri", th.xu_tri.indexOf(xt) >= 0, "Đáp án: " + th.xu_tri.map(function (x) { return nhanCua(XU_TRI_SD, x); }).join(" hoặc ") + ".");
      var g = $("sd-giai");
      g.hidden = false;
      g.innerHTML = "<h2>Giải thích theo tài liệu</h2><ul class=\"trich\">" + th.nguyen_van.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        '<p class="phu">' + esc(th.ghi_chu_dap_an) + " Số trong ngoặc là số dòng trong nguon/TongHop_OSCE_Y21_TungBuoc.md.</p>";
    }
    ve();
    veDsKham();
    goiY();
  }

  function veSVG(th, S, cot) {
    var L = SD.L, cw = SD.cw, rh = SD.rh, top = SD.top, H1 = SD.H1, o = [];
    function X(c) { return L + c * cw; }
    function Y(v) { return top + H1 - v * rh; }
    o.push('<svg class="sd" viewBox="0 0 ' + SD.W + " " + SD.H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sản đồ WHO – chạm để chấm điểm">');
    o.push('<rect width="' + SD.W + '" height="' + SD.H + '" fill="#fff"/>');
    o.push('<text x="' + L + '" y="18" class="sd-t">Cổ tử cung (cm) – ghi bằng X · Độ lọt (/5) – ghi bằng O</text>');
    var i;
    for (i = 0; i <= 10; i++) {
      o.push('<line x1="' + L + '" y1="' + Y(i) + '" x2="' + X(SD.cot) + '" y2="' + Y(i) + '" class="' + (i === 0 || i === 10 ? "sd-dam" : "sd-mong") + '"/>');
      o.push('<text x="' + (L - 6) + '" y="' + (Y(i) + 4) + '" class="sd-so" text-anchor="end">' + i + "</text>");
      if (i <= 5) o.push('<text x="' + (L - 30) + '" y="' + (Y(i) + 4) + '" class="sd-lot" text-anchor="end">' + i + "</text>");
    }
    for (i = 0; i <= SD.cot; i++) o.push('<line x1="' + X(i) + '" y1="' + top + '" x2="' + X(i) + '" y2="' + (top + H1) + '" class="' + (i % 2 === 0 ? "sd-gio" : "sd-mong") + '"/>');
    o.push('<line x1="' + (L - 26) + '" y1="' + Y(5) + '" x2="' + (L - 26) + '" y2="' + Y(0) + '" class="sd-lot-truc"/>');
    // đường báo động: (0, 4) → (6 giờ, 10); hành động: (4 giờ, 4) → (10 giờ, 10)
    o.push('<line x1="' + X(0) + '" y1="' + Y(4) + '" x2="' + X(12) + '" y2="' + Y(10) + '" class="sd-duong"/>');
    o.push('<line x1="' + X(8) + '" y1="' + Y(4) + '" x2="' + X(20) + '" y2="' + Y(10) + '" class="sd-duong"/>');
    o.push('<text x="' + (X(7) - 8) + '" y="' + (Y(7.6) - 2) + '" class="sd-nhan" transform="rotate(-45 ' + (X(7) - 8) + " " + (Y(7.6) - 2) + ')">Đường báo động</text>');
    o.push('<text x="' + (X(15) - 8) + '" y="' + (Y(7.6) - 2) + '" class="sd-nhan" transform="rotate(-45 ' + (X(15) - 8) + " " + (Y(7.6) - 2) + ')">Đường hành động</text>');
    // hàng giờ
    var gy = top + H1 + 17, t0 = phut(th.kham[0].gio) - cot[0] * 30;
    for (i = 0; i <= SD.cot; i += 2) {
      var tm = ((t0 + i * 30) % 1440 + 1440) % 1440;
      o.push('<text x="' + X(i) + '" y="' + gy + '" class="sd-gio-chu" text-anchor="middle">' + pad(Math.floor(tm / 60)) + ":" + pad(tm % 60) + "</text>");
    }
    o.push('<text x="4" y="' + gy + '" class="sd-so">Giờ</text>');
    // cơn co
    var ct = SD.ccTop, cr = SD.ccRow;
    o.push('<text x="4" y="' + (ct + 2.5 * cr) + '" class="sd-so">Cơn co</text><text x="4" y="' + (ct + 2.5 * cr + 13) + '" class="sd-so">/10 phút</text>');
    for (i = 0; i <= 5; i++) o.push('<line x1="' + L + '" y1="' + (ct + i * cr) + '" x2="' + X(SD.cot) + '" y2="' + (ct + i * cr) + '" class="sd-mong"/>');
    for (i = 0; i <= SD.cot; i++) o.push('<line x1="' + X(i) + '" y1="' + ct + '" x2="' + X(i) + '" y2="' + (ct + 5 * cr) + '" class="' + (i % 2 === 0 ? "sd-gio" : "sd-mong") + '"/>');
    for (i = 1; i <= 5; i++) o.push('<text x="' + (L - 6) + '" y="' + (ct + (5 - i) * cr + 13) + '" class="sd-so" text-anchor="end">' + i + "</text>");
    o.push('<defs><pattern id="gach" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#333" stroke-width="2"/></pattern>' +
      '<pattern id="cham" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.2" fill="#333"/></pattern></defs>');
    function oCC(col, so, loai, cls) {
      var fill = loai === ">40" ? "#333" : loai === "20-40" ? "url(#gach)" : "url(#cham)", r = "";
      for (var j = 0; j < so; j++) r += '<rect x="' + (X(col) + 1) + '" y="' + (ct + (4 - j) * cr + 1) + '" width="' + (cw - 2) + '" height="' + (cr - 2) + '" fill="' + fill + '" class="' + cls + '"/>';
      return r;
    }
    // điểm người dùng
    var px = [], po = [];
    S.ve.forEach(function (v, k) {
      var d = S.daKiem ? v.dung : null;
      if (v.cc) o.push(oCC(v.cc.col, v.cc.so, v.cc.loai, d ? (d.cc ? "sd-dung" : "sd-sai") : ""));
      if (v.x) px.push([X(v.x.col), Y(v.x.cm), d ? d.x : null, k]);
      if (v.o) po.push([X(v.o.col), Y(v.o.lot), d ? d.o : null, k]);
    });
    if (px.length > 1) o.push('<polyline points="' + px.map(function (q) { return q[0] + "," + q[1]; }).join(" ") + '" class="sd-noi-x"/>');
    if (po.length > 1) o.push('<polyline points="' + po.map(function (q) { return q[0] + "," + q[1]; }).join(" ") + '" class="sd-noi-o"/>');
    px.forEach(function (q) {
      var c = q[2] === null ? "sd-x" : q[2] ? "sd-x sd-dung" : "sd-x sd-sai";
      o.push('<path d="M' + (q[0] - 7) + " " + (q[1] - 7) + "L" + (q[0] + 7) + " " + (q[1] + 7) + "M" + (q[0] + 7) + " " + (q[1] - 7) + "L" + (q[0] - 7) + " " + (q[1] + 7) + '" class="' + c + '"/>');
    });
    po.forEach(function (q) {
      var c = q[2] === null ? "sd-o" : q[2] ? "sd-o sd-dung" : "sd-o sd-sai";
      o.push('<circle cx="' + q[0] + '" cy="' + q[1] + '" r="7" class="' + c + '"/>');
    });
    // đáp án đúng (nét đứt) sau khi kiểm tra
    if (S.daKiem) {
      th.kham.forEach(function (k, i2) {
        var d = S.ve[i2].dung;
        if (!d.x) { var x = X(cot[i2]), y = Y(k.cm); o.push('<path d="M' + (x - 7) + " " + (y - 7) + "L" + (x + 7) + " " + (y + 7) + "M" + (x + 7) + " " + (y - 7) + "L" + (x - 7) + " " + (y + 7) + '" class="sd-x sd-goi-y"/>'); }
        if (!d.o) o.push('<circle cx="' + X(cot[i2]) + '" cy="' + Y(k.lot) + '" r="7" class="sd-o sd-goi-y"/>');
        if (!d.cc) o.push('<rect x="' + (X(cot[i2]) + 1) + '" y="' + (ct + (5 - k.con_co) * cr + 1) + '" width="' + (cw - 2) + '" height="' + (k.con_co * cr - 2) + '" class="sd-goi-y-o"/>');
      });
    }
    // lần khám đang chọn
    o.push('<line x1="' + X(cot[S.k]) + '" y1="' + top + '" x2="' + X(cot[S.k]) + '" y2="' + (ct + 5 * cr) + '" class="sd-chon"/>');
    o.push("</svg>");
    return o.join("");
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* =====================================================================
     3. BIỂU ĐỒ TĂNG TRƯỞNG (Shinozuka – số hóa trong nguon/mau-trong/script/shino.json; Hadlock 1991)
     ===================================================================== */
  var Z97 = 1.8808, Z90 = 1.2816;
  var CHI_SO = [
    { key: "BPD", ten: "Đường kính lưỡng đỉnh (BPD)", dv: "mm", y: [20, 110], ymaj: 10, chuan: "shino" },
    { key: "AC", ten: "Chu vi vòng bụng (AC)", dv: "cm", y: [5, 40], ymaj: 5, chuan: "shino" },
    { key: "FL", ten: "Chiều dài xương đùi (FL)", dv: "mm", y: [10, 80], ymaj: 10, chuan: "shino" },
    { key: "EFW", ten: "Cân nặng thai ước tính (EFW)", dv: "g", y: [0, 4500], ymaj: 500, chuan: "shino" }
  ];
  function polyval(c, x) { var v = 0; for (var i = 0; i < c.length; i++) v = v * x + c[i]; return v; }
  function phamVi(key) {
    var d = CC.shino.du_lieu[key];
    return [Math.max(d.p3.range[0], d.p50.range[0], d.p97.range[0]), Math.min(d.p3.range[1], d.p50.range[1], d.p97.range[1])];
  }
  function bpvShino(key, ga) {
    var d = CC.shino.du_lieu[key];
    var p3 = polyval(d.p3.coef, ga), p50 = polyval(d.p50.coef, ga), p97 = polyval(d.p97.coef, ga);
    return { p3: p3, p50: p50, p97: p97, p10: p50 - (p50 - p3) * Z90 / Z97, p90: p50 + (p97 - p50) * Z90 / Z97 };
  }
  function bpvHadlock(ga) {
    var m = Math.exp(0.578 + 0.332 * ga - 0.00354 * ga * ga);
    return { p3: m * 0.7486, p10: m * 0.83, p50: m, p90: m * 1.17, p97: m * 1.2514 };
  }
  function phi(z) { // hàm phân phối chuẩn tích lũy
    var t = 1 / (1 + 0.2316419 * Math.abs(z));
    var d = 0.3989423 * Math.exp(-z * z / 2);
    var p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }
  function tinhBPV(key, chuan, ga, v) {
    var z;
    if (chuan === "hadlock") {
      var m = bpvHadlock(ga).p50;
      z = v >= m ? Math.log(v / m) / (Math.log(1.2514) / Z97) : Math.log(v / m) / (-Math.log(0.7486) / Z97);
    } else {
      var b = bpvShino(key, ga);
      z = v >= b.p50 ? (v - b.p50) / ((b.p97 - b.p50) / Z97) : (v - b.p50) / ((b.p50 - b.p3) / Z97);
    }
    return Math.max(0.1, Math.min(99.9, phi(z) * 100));
  }
  function nhanBPV(p) {
    if (p < 3) return ["sai", "dưới BPV 3"];
    if (p < 10) return ["canh", "BPV 3–10"];
    if (p <= 90) return ["ok", "BPV 10–90"];
    if (p <= 97) return ["canh", "BPV 90–97"];
    return ["sai", "trên BPV 97"];
  }
  var KHOA_TTR = "osce.tang_truong";

  T["tang-truong"] = function () {
    var LT = A().LuuTru;
    var ds = LT.docJSON(KHOA_TTR, []);
    if (!Array.isArray(ds)) ds = [];
    var chuanEFW = LT.doc("osce.tang_truong_chuan", "shino") === "hadlock" ? "hadlock" : "shino";
    A().datTieuDe("Biểu đồ tăng trưởng");
    var h = '<div class="trang-hep"><nav class="dieu-huong"><a href="#/luyen-tap">‹ Luyện tập</a></nav><h1>Biểu đồ tăng trưởng thai</h1>';
    h += '<form class="the" id="form-tt" novalidate><div class="luoi-nhap">' +
      '<div><label class="nhan-o" for="tt-tuan">Tuổi thai – tuần</label><input id="tt-tuan" class="o-chu" type="number" inputmode="numeric" min="14" max="42" required></div>' +
      '<div><label class="nhan-o" for="tt-ngay">ngày</label><input id="tt-ngay" class="o-chu" type="number" inputmode="numeric" min="0" max="6" value="0"></div>' +
      '<div><label class="nhan-o" for="tt-EFW">EFW (g)</label><input id="tt-EFW" class="o-chu" type="number" inputmode="decimal" min="0" step="1"></div>' +
      '<div><label class="nhan-o" for="tt-AC">AC (cm)</label><input id="tt-AC" class="o-chu" type="number" inputmode="decimal" min="0" step="0.1"></div>' +
      '<div><label class="nhan-o" for="tt-BPD">BPD (mm)</label><input id="tt-BPD" class="o-chu" type="number" inputmode="decimal" min="0" step="0.1"></div>' +
      '<div><label class="nhan-o" for="tt-FL">FL (mm)</label><input id="tt-FL" class="o-chu" type="number" inputmode="decimal" min="0" step="0.1"></div></div>' +
      '<fieldset class="o-dien"><legend>Chuẩn EFW</legend>' + radio("tt-chuan", [["shino", "Shinozuka"], ["hadlock", "Hadlock"]]) + "</fieldset>" +
      '<div class="hang-nut"><button type="submit" class="nut nut-chinh">Chấm lên biểu đồ</button><button type="button" class="nut" id="tt-xoa-het">Xóa hết điểm</button></div>' +
      '<p class="phu" id="tt-bao" role="status"></p></form>';
    h += '<section id="tt-ket-qua"></section><div class="luoi-bieu-do" id="tt-bieu-do"></div>';
    h += '<p class="phu">BPV 3, 50, 97 Shinozuka: số hóa từ biểu đồ Chương 3 (nguon/mau-trong/script/shino.json); BPV 10, 90 nội suy theo phân phối chuẩn (z = 1,28) – gần đúng. ' +
      "Bách phân vị của một số đo tính gần đúng theo cùng giả định. Hadlock: ln(EFW) = 0,578 + 0,332·TT − 0,00354·TT² (Hadlock 1991), BPV 10/90 = ±17 %, BPV 3/97 ≈ ±25 %. " +
      "Nguồn: Shinozuka N và cs., Acta Neonatologica Japonica 1994;30(3):433-441; Hadlock FP và cs., Radiology 1991;181:129-133.</p></div>";
    A().veLai(h);
    document.querySelector('input[name="tt-chuan"][value="' + chuanEFW + '"]').checked = true;

    function veHet() {
      var chuan = giaTri("tt-chuan") || "shino";
      var kq = "";
      if (ds.length) {
        kq = '<table class="bang-ls"><thead><tr><th>Tuổi thai</th>' + CHI_SO.map(function (c) { return "<th>" + c.key + "</th>"; }).join("") + "<th><span class=\"an-chu\">Xóa</span></th></tr></thead><tbody>";
        ds.slice().sort(function (a, b) { return a.ga - b.ga; }).forEach(function (m) {
          kq += '<tr><td data-nhan="Tuổi thai"><span>' + Math.floor(m.ga) + " tuần " + Math.round((m.ga % 1) * 7) + " ngày</span></td>";
          CHI_SO.forEach(function (c) {
            var v = m[c.key];
            if (v === undefined || v === null) { kq += '<td data-nhan="' + c.key + '"><span>—</span></td>'; return; }
            var ch = c.key === "EFW" ? chuan : "shino";
            var pv = ch === "hadlock" ? [14, 40] : phamVi(c.key);
            if (m.ga < pv[0] || m.ga > pv[1]) { kq += '<td data-nhan="' + c.key + '"><span>' + soVN(v) + " " + c.dv + " · ngoài khoảng chuẩn</span></td>"; return; }
            var b = tinhBPV(c.key, ch, m.ga, v), n = nhanBPV(b);
            kq += '<td data-nhan="' + c.key + '"><span>' + soVN(v) + " " + c.dv + ' · <strong class="bpv-' + n[0] + '">BPV ≈ ' + soVN(b, 0) + "</strong> (" + n[1] + ")</span></td>";
          });
          kq += '<td><button type="button" class="nut nut-nho nut-xoa" data-xoa-tt="' + m.id + '">Xóa</button></td></tr>';
        });
        kq += "</tbody></table>";
      } else kq = '<p class="trong">Chưa có điểm nào. Nhập tuổi thai và ít nhất một chỉ số rồi bấm Chấm lên biểu đồ.</p>';
      $("tt-ket-qua").innerHTML = kq;
      $("tt-bieu-do").innerHTML = CHI_SO.map(function (c) { return '<figure class="the bieu-do">' + veBieuDo(c, c.key === "EFW" ? chuan : "shino", ds) + "</figure>"; }).join("");
      document.querySelectorAll("[data-xoa-tt]").forEach(function (b) {
        b.addEventListener("click", function () {
          var id = b.getAttribute("data-xoa-tt");
          ds = ds.filter(function (m) { return String(m.id) !== id; });
          LT.ghiJSON(KHOA_TTR, ds);
          veHet();
        });
      });
    }
    document.querySelectorAll('input[name="tt-chuan"]').forEach(function (x) {
      x.addEventListener("change", function () { LT.ghi("osce.tang_truong_chuan", x.value); veHet(); });
    });
    $("form-tt").addEventListener("submit", function (e) {
      e.preventDefault();
      var tuan = parseInt($("tt-tuan").value, 10), ngay = parseInt($("tt-ngay").value || "0", 10);
      var bao = $("tt-bao");
      if (isNaN(tuan) || tuan < 14 || tuan > 42 || isNaN(ngay) || ngay < 0 || ngay > 6) { bao.textContent = "Nhập tuổi thai từ 14 đến 42 tuần, ngày từ 0 đến 6."; return; }
      var m = { id: Date.now(), ga: tuan + ngay / 7 }, co = false, ghiChu = "";
      CHI_SO.forEach(function (c) {
        var s = $("tt-" + c.key).value;
        if (s === "") return;
        var v = parseFloat(String(s).replace(",", "."));
        if (isNaN(v) || v <= 0) return;
        if (c.key === "AC" && v > 60) { v = v / 10; ghiChu = "AC nhập lớn hơn 60 nên được hiểu là mm và đổi sang cm. "; }
        m[c.key] = v;
        co = true;
      });
      if (!co) { bao.textContent = "Nhập ít nhất một chỉ số (EFW, AC, BPD hoặc FL)."; return; }
      ds.push(m);
      if (!LT.ghiJSON(KHOA_TTR, ds)) ghiChu += "Không lưu được vào trình duyệt; điểm chỉ giữ đến khi rời trang.";
      bao.textContent = ghiChu || "Đã chấm thêm 1 lần đo.";
      veHet();
    });
    $("tt-xoa-het").addEventListener("click", function () {
      if (!ds.length || !confirm("Xóa hết các điểm đã chấm?")) return;
      ds = [];
      LT.ghiJSON(KHOA_TTR, ds);
      veHet();
    });
    veHet();
  };

  function veBieuDo(c, chuan, ds) {
    var W = 420, H = 300, PX = 46, PY = 26, PW = 350, PH = 230;
    var x0 = chuan === "hadlock" ? 14 : 16, x1 = 42, y0 = c.y[0], y1 = c.y[1];
    if (chuan === "hadlock") { y0 = 0; y1 = 5000; }
    function X(g) { return PX + (g - x0) / (x1 - x0) * PW; }
    function Y(v) { return PY + PH - (v - y0) / (y1 - y0) * PH; }
    var o = ['<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Biểu đồ ' + esc(c.ten) + '">'];
    o.push('<rect width="' + W + '" height="' + H + '" fill="#fff"/>');
    o.push('<text x="' + PX + '" y="16" class="bd-t">' + esc(c.ten) + " (" + c.dv + ") – " + (chuan === "hadlock" ? "Hadlock" : "Shinozuka") + "</text>");
    var v, g;
    for (v = y0; v <= y1 + 1e-9; v += c.ymaj / (c.key === "EFW" ? 1 : 2)) {
      var maj = Math.abs((v - y0) % c.ymaj) < 1e-6;
      o.push('<line x1="' + PX + '" y1="' + Y(v) + '" x2="' + (PX + PW) + '" y2="' + Y(v) + '" class="' + (maj ? "bd-dam" : "bd-mong") + '"/>');
      if (maj) o.push('<text x="' + (PX - 4) + '" y="' + (Y(v) + 3.5) + '" class="bd-so" text-anchor="end">' + v + "</text>");
    }
    for (g = x0; g <= x1; g++) {
      o.push('<line x1="' + X(g) + '" y1="' + PY + '" x2="' + X(g) + '" y2="' + (PY + PH) + '" class="' + (g % 2 === 0 ? "bd-dam" : "bd-mong") + '"/>');
      if (g % 2 === 0) o.push('<text x="' + X(g) + '" y="' + (PY + PH + 14) + '" class="bd-so" text-anchor="middle">' + g + "</text>");
    }
    o.push('<text x="' + (PX + PW / 2) + '" y="' + (H - 4) + '" class="bd-so" text-anchor="middle">Tuổi thai (tuần)</text>');
    var pv = chuan === "hadlock" ? [14, 40] : phamVi(c.key);
    var mau = { p3: "#c0392b", p10: "#d68910", p50: "#1e8449", p90: "#d68910", p97: "#c0392b" };
    ["p3", "p10", "p50", "p90", "p97"].forEach(function (p) {
      var pts = [];
      for (g = Math.ceil(pv[0] * 10) / 10; g <= pv[1] + 1e-9; g += 0.2) {
        var b = chuan === "hadlock" ? bpvHadlock(g) : bpvShino(c.key, g);
        if (b[p] >= y0 && b[p] <= y1) pts.push(X(g).toFixed(1) + "," + Y(b[p]).toFixed(1));
      }
      o.push('<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + mau[p] + '" stroke-width="' + (p === "p50" ? 2 : 1.4) + '"' + (p === "p10" || p === "p90" ? ' stroke-dasharray="5 3"' : "") + "/>");
      var cuoi = pts[pts.length - 1];
      if (cuoi) { var xy = cuoi.split(","); o.push('<text x="' + (+xy[0] + 3) + '" y="' + (+xy[1] + 3) + '" class="bd-p" fill="' + mau[p] + '">' + p.slice(1) + "</text>"); }
    });
    var diem = ds.filter(function (m) { return typeof m[c.key] === "number"; }).sort(function (a, b) { return a.ga - b.ga; });
    if (diem.length > 1) o.push('<polyline points="' + diem.map(function (m) { return X(m.ga).toFixed(1) + "," + Y(m[c.key]).toFixed(1); }).join(" ") + '" class="bd-noi"/>');
    diem.forEach(function (m) {
      o.push('<circle cx="' + X(m.ga).toFixed(1) + '" cy="' + Y(Math.max(y0, Math.min(y1, m[c.key]))).toFixed(1) + '" r="4.5" class="bd-diem"/>');
    });
    o.push("</svg>");
    return o.join("");
  }

  // xuất cho test
  T._tangTruong = { tinhBPV: tinhBPV, bpvShino: bpvShino, bpvHadlock: bpvHadlock, phamVi: phamVi };
  T._sanDo = { cotKham: cotKham };
})();

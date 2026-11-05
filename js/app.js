/* Ôn OSCE Sản khoa Y4 – logic giao diện (JS thuần, không cần build). */
(function () {
  "use strict";

  var D = window.OSCE_DATA;
  var app = document.getElementById("app");
  var hopHinh = document.getElementById("xem-hinh");
  var thongBao = document.getElementById("thong-bao");

  if (!D) {
    app.innerHTML = '<p class="trong">Không tải được dữ liệu (data/stations.js). Hãy chạy <code>node tools/build_data.js</code>.</p>';
    return;
  }

  /* ---------- Lưu trữ: mọi truy cập localStorage đi qua đây, đều bọc try/catch ---------- */
  var LuuTru = {
    doc: function (k, mac) {
      try { var v = window.localStorage.getItem(k); return v === null ? mac : v; } catch (e) { return mac; }
    },
    ghi: function (k, v) {
      try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; }
    },
    docJSON: function (k, mac) {
      try { var v = window.localStorage.getItem(k); return v === null ? mac : JSON.parse(v); } catch (e) { return mac; }
    },
    ghiJSON: function (k, v) {
      try { window.localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
    }
  };
  var RUBRIC = {};
  ((window.OSCE_RUBRIC && window.OSCE_RUBRIC.rubric) || []).forEach(function (r) { RUBRIC[r.id] = r; });

  /* ---------- Đề nạp tay (localStorage) ghép vào dữ liệu ---------- */
  var D0 = JSON.parse(JSON.stringify(D)); // bản gốc, để kiểm tra trùng khi nạp
  var KHOA_NAP = "osce.nap";
  function docNap() {
    var v = LuuTru.docJSON(KHOA_NAP, []);
    return Array.isArray(v) ? v : [];
  }
  var NAP = docNap();
  NAP.forEach(function (f) {
    var kq = window.NapDe.doc(f.noi_dung, f.ten);
    f.loi = kq.loi.concat(kq.loi.length ? [] : window.NapDe.ghep(D, kq.tram, true));
    f.soDe = kq.tram.reduce(function (s, t) { return s + t.de.length; }, 0);
  });

  /* ---------- Chỉ mục ---------- */
  var CHUONG = {}, TRAM = {}, DE = {};
  var tongDe = 0, tongTram = 0;
  D.chuong.forEach(function (c) {
    CHUONG[c.id] = c;
    c.soDe = 0;
    c.tram.forEach(function (t) {
      TRAM[t.id] = t;
      t.chuong = c;
      tongTram++;
      t.de.forEach(function (d) {
        DE[d.id] = d;
        d.tram = t;
        c.soDe++;
        tongDe++;
      });
    });
  });

  /* ---------- Lưu cài đặt (an toàn khi bị chặn bộ nhớ) ---------- */
  function doc(k, mac) { return LuuTru.doc(k, mac); }
  function ghi(k, v) { return LuuTru.ghi(k, v); }
  var CAI = { phut: Math.min(30, Math.max(1, parseInt(doc("osce.phut", "7"), 10) || 7)) };

  /* ---------- Tiện ích ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function md(s) { return '<div class="md">' + window.MD.render(s) + "</div>"; }
  function khoiNguon(s) { return s ? '<div class="khoi-nguon">' + md(s) + "</div>" : ""; }
  function khoiST(s) {
    return s ? '<div class="khoi-st"><span class="nhan nhan-st">soạn thêm</span>' + md(s) + "</div>" : "";
  }
  function mmss(ms) {
    var am = ms < 0;
    var s = Math.round(Math.abs(ms) / 1000);
    var m = Math.floor(s / 60);
    var r = s % 60;
    return (am ? "+" : "") + (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }
  function ngauNhien(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function tenDe(d) { return (/^\d+(\.\d+)+$/.test(d.so || "") ? d.so + " " : "") + (d.ten || d.nguon_de); }
  function chipNguon(d) {
    var h = '<span class="chip" title="Nguồn đề">' + esc(d.nguon_de) + "</span>";
    if (d.soan_them && d.soan_them.length) h += ' <span class="chip chip-st">có phần soạn thêm</span>';
    if (d.nap_tay) h += ' <span class="chip chip-nap">nạp tay</span>';
    return h;
  }
  function veLai(html) {
    dungTram();
    app.innerHTML = html;
    window.scrollTo(0, 0);
  }
  function datTieuDe(t) { document.title = t ? t + " – Ôn OSCE Sản khoa Y4" : "Ôn OSCE Sản khoa Y4"; }

  /* ---------- Trang chủ ---------- */
  function trangChu(maChuong) {
    var c = maChuong && CHUONG[maChuong];
    datTieuDe("");
    var h = '<div class="trang-hep">';
    h += '<section class="gioi-thieu"><h1>Ôn OSCE Sản khoa Y4</h1><p>' + tongTram + " trạm · " + tongDe +
      " đề · nguồn: Tổng hợp OSCE Y21 (viết lại từng bước). Phần tự soạn thêm luôn gắn nhãn <span class=\"chip chip-st\">soạn thêm</span>.</p></section>";
    h += '<h2 class="muc">1. Chọn chương</h2><div class="luoi-chuong">';
    h += '<button type="button" class="nut nut-chuong" data-chuong="" aria-pressed="' + (!c) + '"><span class="ten">Tất cả chương</span><span class="so">' + tongTram + " trạm · " + tongDe + " đề</span></button>";
    D.chuong.forEach(function (x) {
      var ten = x.ten.replace(/^CHƯƠNG\s*\d+:\s*/, "");
      var so = x.ten.match(/^CHƯƠNG\s*(\d+)/);
      h += '<button type="button" class="nut nut-chuong" data-chuong="' + x.id + '" aria-pressed="' + (c === x) + '">' +
        '<span class="ten">' + (so ? "Chương " + so[1] + ": " : "") + esc(viethoa(ten)) + "</span>" +
        '<span class="so">' + x.tram.length + " trạm · " + x.soDe + " đề</span></button>";
    });
    h += "</div>";
    h += '<h2 class="muc">2. Bốc đề ' + (c ? "trong " + esc(tenChuongNgan(c)) : "trong tất cả chương") + "</h2>";
    h += '<div class="hang-boc"><button type="button" class="nut nut-chinh nut-to" id="boc">🎲 Bốc ngẫu nhiên</button>' +
      '<p class="phu" style="margin:0">hoặc chọn trạm bên dưới rồi chọn đề cụ thể.</p></div>';
    h += '<h2 class="muc">Trạm' + (c ? " – " + esc(tenChuongNgan(c)) : "") + "</h2><ul class=\"danh-sach\">";
    (c ? [c] : D.chuong).forEach(function (x) {
      x.tram.forEach(function (t) {
        h += '<li><a class="the the-lien-ket" href="#/tram/' + t.id + '"><span class="noi-dung"><span class="ten">' + esc(t.ten) +
          '</span><span class="phu">' + t.de.length + " đề" + (c ? "" : " · " + esc(tenChuongNgan(x))) +
          '</span></span><span class="mui-ten" aria-hidden="true">›</span></a></li>';
      });
    });
    h += "</ul>";
    h += '<details class="the cai-dat"><summary>Cài đặt thời gian mỗi trạm</summary>' + oChinhGio() + "</details>";
    h += "</div>";
    veLai(h);

    app.querySelectorAll(".nut-chuong").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-chuong");
        location.hash = id ? "#/c/" + id : "#/";
      });
    });
    document.getElementById("boc").addEventListener("click", function () {
      var ds = [];
      (c ? [c] : D.chuong).forEach(function (x) { x.tram.forEach(function (t) { ds = ds.concat(t.de); }); });
      location.hash = "#/de/" + ngauNhien(ds).id;
    });
    ganChinhGio();
  }
  function viethoa(s) {
    s = s.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function tenChuongNgan(c) {
    var so = c.ten.match(/^CHƯƠNG\s*(\d+)/);
    return so ? "Chương " + so[1] : c.ten;
  }
  function oChinhGio() {
    return '<div class="chinh-gio"><button type="button" class="nut nut-nho" data-gio="-1" aria-label="Giảm 1 phút">−1</button>' +
      '<output id="so-phut" aria-live="polite">' + CAI.phut + " phút</output>" +
      '<button type="button" class="nut nut-nho" data-gio="1" aria-label="Tăng 1 phút">+1</button>' +
      '<span class="phu">Mặc định 7 phút; đồng hồ chạy suốt trạm, báo khi còn 1 phút và khi hết giờ.</span></div>';
  }
  function ganChinhGio() {
    app.querySelectorAll("[data-gio]").forEach(function (b) {
      b.addEventListener("click", function () {
        CAI.phut = Math.min(30, Math.max(1, CAI.phut + parseInt(b.getAttribute("data-gio"), 10)));
        ghi("osce.phut", String(CAI.phut));
        document.getElementById("so-phut").textContent = CAI.phut + " phút";
      });
    });
  }

  /* ---------- Trang trạm ---------- */
  function trangTram(id) {
    var t = TRAM[id];
    if (!t) return trangChu();
    datTieuDe(t.ten);
    var h = '<div class="trang-hep"><nav class="dieu-huong" aria-label="Đường dẫn"><a href="#/c/' + t.chuong.id + '">‹ ' +
      esc(tenChuongNgan(t.chuong)) + "</a></nav>";
    h += "<h1>" + esc(t.ten) + '</h1><p class="phu">' + esc(viethoa(t.chuong.ten.replace(/^CHƯƠNG\s*\d+:\s*/, ""))) + " · " + t.de.length + " đề</p>";
    h += '<div class="hang-boc"><button type="button" class="nut nut-chinh nut-to" id="boc">🎲 Bốc ngẫu nhiên trong trạm</button></div>';
    if (t.ly_thuyet) {
      h += '<details class="the ly-thuyet"><summary>Lý thuyết cần nhớ (theo tài liệu)</summary>' + md(t.ly_thuyet) + "</details>";
    }
    h += '<h2 class="muc">Chọn đề</h2><ul class="danh-sach">';
    t.de.forEach(function (d) {
      h += '<li><a class="the the-lien-ket" href="#/de/' + d.id + '"><span class="noi-dung"><span class="ten">' + esc(tenDe(d)) +
        '</span><span class="dong-chip">' + chipNguon(d) + '</span><span class="phu">' + d.buoc.length + " bước: " +
        d.buoc.map(function (b) { return esc(b.ten); }).join(" → ") + '</span></span><span class="mui-ten" aria-hidden="true">›</span></a></li>';
    });
    h += "</ul></div>";
    veLai(h);
    document.getElementById("boc").addEventListener("click", function () {
      location.hash = "#/de/" + ngauNhien(t.de).id;
    });
  }

  /* ---------- Trang hướng dẫn ---------- */
  function trangHuongDan() {
    datTieuDe("Hướng dẫn");
    var h = '<div class="trang-hep"><h1>Hướng dẫn</h1>';
    h += '<section class="the"><h2>Cách dùng</h2><ul>' +
      "<li>Chọn chương → bốc ngẫu nhiên hoặc chọn trạm → chọn đề.</li>" +
      "<li>Màn trạm: đọc mở đầu và tác vụ; đồng hồ (mặc định 7 phút) chạy suốt trạm, báo khi còn 1 phút và khi hết giờ.</li>" +
      "<li>Làm lần lượt từng bước: ghi chú → bấm <strong>Hoàn thành bước</strong> → đọc kết quả mở ra → bấm <strong>Xem đáp án bước này</strong> nếu muốn.</li>" +
      "<li>Làm xong trạm: phần <strong>Tự chấm</strong> hiện ra – trạm có rubric thì chọn mức F/40/80/100% cho từng mục, trạm chưa có rubric thì tick các ý đáp án. Điểm % và thời gian được lưu ở trang <strong>Lịch sử</strong> (có Xuất/Nhập file JSON để sao lưu).</li>" +
      "<li>Phím tắt: <strong>Enter</strong> = Hoàn thành bước (khi không gõ trong ô ghi chú; trong ô ghi chú dùng Ctrl/⌘ + Enter), <strong>Space</strong> = tạm dừng/tiếp tục đồng hồ.</li>" +
      '<li>Chữ trong khung xám là nguyên văn tài liệu; khung viền đứt màu vàng có nhãn <span class="nhan nhan-st">soạn thêm</span> là phần tự soạn thêm cho đủ dữ kiện luyện tập.</li>' +
      "</ul></section>";
    h += '<h2 class="muc">Hướng dẫn thi OSCE (theo tài liệu)</h2><section class="the">' + md(D.huong_dan_chung) + "</section></div>";
    veLai(h);
  }

  /* ---------- Trang nạp đề ---------- */
  var choLuu = null; // { ten, noi_dung } đã xem trước, hợp lệ

  function trangNap() {
    datTieuDe("Nạp đề");
    choLuu = null;
    var h = '<div class="trang-hep"><h1>Nạp đề</h1>';
    h += '<p class="phu">Nạp thêm đề bằng file Markdown theo khuôn <a href="mau-nap/MAU_NAP_DE_OSCE.md" download>MAU_NAP_DE_OSCE.md</a> ' +
      "(trạm / đề / bước; mỗi bước có Đề, Kết quả, Hình, Đáp án; dòng <code>Soạn thêm:</code>). Đề nạp tay chỉ lưu trên trình duyệt này – nhớ <strong>Xuất ra .md</strong> để sao lưu hoặc đưa vào repo (thư mục <code>mau-nap/tram/</code>).</p>";
    h += '<section class="the nap-nhap"><div class="chon-file"><input type="file" id="nap-file" class="an-file" accept=".md,.markdown,.txt,text/markdown,text/plain">' +
      '<label class="nut" for="nap-file">📄 Chọn file .md</label><span class="phu" id="nap-file-ten">Chưa chọn file</span></div>' +
      '<label class="nhan-o" for="nap-ten">Tên file</label><input type="text" id="nap-ten" class="o-chu" value="de-nap-tay.md" autocomplete="off">' +
      '<label class="nhan-o" for="nap-chu">Hoặc dán chữ Markdown</label>' +
      '<textarea id="nap-chu" class="o-chu" rows="12" spellcheck="false" placeholder="# TRẠM: …&#10;Chương: CHƯƠNG 2: NỬA ĐẦU THAI KÌ&#10;&#10;## ĐỀ: …"></textarea>' +
      '<div class="hang-nut"><button type="button" class="nut" id="nap-xem">Xem trước</button>' +
      '<button type="button" class="nut nut-chinh" id="nap-luu" disabled>Lưu</button></div></section>';
    h += '<section id="nap-ket-qua" aria-live="polite"></section>';
    h += '<h2 class="muc">Đề đã nạp trên trình duyệt này</h2><div id="nap-ds"></div></div>';
    veLai(h);

    var oChu = document.getElementById("nap-chu");
    var oTen = document.getElementById("nap-ten");
    var nutLuu = document.getElementById("nap-luu");
    function doiNoiDung() { choLuu = null; nutLuu.disabled = true; }
    oChu.addEventListener("input", doiNoiDung);
    oTen.addEventListener("input", doiNoiDung);
    document.getElementById("nap-file").addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        oChu.value = String(r.result);
        oTen.value = f.name;
        document.getElementById("nap-file-ten").textContent = f.name;
        doiNoiDung();
        xemTruoc();
      };
      r.readAsText(f, "utf-8");
    });
    document.getElementById("nap-xem").addEventListener("click", xemTruoc);
    nutLuu.addEventListener("click", luuNap);
    veDanhSachNap();
  }

  function xemTruoc() {
    var chu = document.getElementById("nap-chu").value;
    var ten = (document.getElementById("nap-ten").value || "de-nap-tay.md").trim();
    var o = document.getElementById("nap-ket-qua");
    var kq = window.NapDe.doc(chu, ten);
    var loi = kq.loi.slice();
    if (!chu.trim()) loi = [{ dong: 1, thong_bao: "Chưa có nội dung." }];
    if (!loi.length && !kq.tram.length) loi.push({ dong: 1, thong_bao: "Không thấy dòng \"# TRẠM: …\" nào." });
    if (!loi.length) {
      // kiểm tra trùng với đề có sẵn và đề đã nạp khác (trừ file cùng tên sẽ bị thay)
      var thu = JSON.parse(JSON.stringify(D0));
      NAP.forEach(function (f) {
        if (f.ten === ten) return;
        var k = window.NapDe.doc(f.noi_dung, f.ten);
        if (!k.loi.length) window.NapDe.ghep(thu, k.tram, true);
      });
      var tramMoi = {};
      kq.tram.forEach(function (t) { tramMoi[t.id] = !thu.chuong.some(function (c) { return c.tram.some(function (x) { return x.id === t.id; }); }); });
      window.NapDe.ghep(thu, JSON.parse(JSON.stringify(kq.tram)), true).forEach(function (e) {
        e.dong = timDong(chu, e);
        loi.push(e);
      });
    }
    var nutLuu = document.getElementById("nap-luu");
    if (loi.length) {
      choLuu = null;
      nutLuu.disabled = true;
      o.innerHTML = '<div class="the bao-loi" role="alert"><h2>Có ' + loi.length + " lỗi – chưa lưu được</h2><ul>" +
        loi.map(function (e) { return "<li><strong>Dòng " + (e.dong || "?") + ":</strong> " + esc(e.thong_bao) + "</li>"; }).join("") + "</ul></div>";
      return;
    }
    choLuu = { ten: ten, noi_dung: chu };
    nutLuu.disabled = false;
    var h = '<div class="the bao-ok"><h2>Xem trước – hợp lệ</h2><p class="phu">' + kq.tram.length + " trạm, " +
      kq.tram.reduce(function (s, t) { return s + t.de.length; }, 0) + " đề. Bấm <strong>Lưu</strong> để thêm vào web.</p>";
    kq.tram.forEach(function (t) {
      h += "<h3>" + esc(t.ten) + ' <span class="chip">' + (tramMoi[t.id] ? "trạm mới" : "thêm vào trạm có sẵn") + "</span></h3>" +
        '<p class="phu">' + esc(t.chuong_ten) + "</p>";
      t.de.forEach(function (d) {
        h += '<details class="xem-de"><summary>' + esc(window.NapDe.tenHienThi(d)) + " · " + esc(d.nguon_de) +
          (d.soan_them.length ? ' <span class="chip chip-st">có phần soạn thêm</span>' : "") + "</summary>";
        h += "<h4>Mở đầu</h4>" + khoiNguon(d.mo_dau) + khoiST(d.mo_dau_soan_them);
        if (d.tac_vu || d.tac_vu_soan_them) h += "<h4>Tác vụ</h4>" + khoiNguon(d.tac_vu) + khoiST(d.tac_vu_soan_them);
        d.buoc.forEach(function (b, i) {
          h += "<h4>Bước " + (i + 1) + ": " + esc(b.ten) + "</h4>" + (b.de || b.de_soan_them ? khoiNguon(b.de) + khoiST(b.de_soan_them) : '<p class="trong">(yêu cầu chung)</p>');
          if (b.ket_qua || b.ket_qua_soan_them) h += '<p class="phu">Kết quả:</p>' + khoiNguon(b.ket_qua) + khoiST(b.ket_qua_soan_them);
          h += '<p class="phu">Đáp án: ' + (b.dap_an || b.dap_an_de ? "có" : "không có") + "</p>";
        });
        h += "</details>";
      });
    });
    o.innerHTML = h + "</div>";
  }

  function timDong(chu, e) {
    var ds = chu.replace(/\r\n?/g, "\n").split("\n");
    for (var i = 0; i < ds.length; i++) if (e.ma_de && ds[i].trim() === "Mã: " + e.ma_de) return i + 1;
    for (var j = 0; j < ds.length; j++) if (e.ten_de && /^## ĐỀ:/.test(ds[j]) && ds[j].indexOf(e.ten_de) >= 0) return j + 1;
    return e.dong || 0;
  }

  function luuNap() {
    if (!choLuu) return;
    var moi = docNap().filter(function (f) { return f.ten !== choLuu.ten; });
    moi.push({ ten: choLuu.ten, noi_dung: choLuu.noi_dung, luu_luc: new Date().toISOString() });
    if (!LuuTru.ghiJSON(KHOA_NAP, moi)) {
      document.getElementById("nap-ket-qua").innerHTML = '<div class="the bao-loi" role="alert">Trình duyệt không cho lưu (bộ nhớ bị chặn hoặc đầy). Hãy dùng Xuất ra .md để giữ file.</div>';
      return;
    }
    location.hash = "#/nap";
    location.reload();
  }

  function taiXuong(ten, chu) {
    var blob = new Blob([chu], { type: "text/markdown;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = /\.md$/i.test(ten) ? ten : ten + ".md";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function veDanhSachNap() {
    var o = document.getElementById("nap-ds");
    if (!NAP.length) { o.innerHTML = '<p class="trong">Chưa có đề nạp tay.</p>'; return; }
    var h = '<ul class="danh-sach">';
    NAP.forEach(function (f, i) {
      h += '<li class="the nap-muc"><div class="noi-dung"><strong>' + esc(f.ten) + '</strong><span class="phu">' + f.soDe + " đề · lưu lúc " +
        esc(new Date(f.luu_luc).toLocaleString("vi-VN")) + "</span>" +
        (f.loi.length ? '<span class="loi-nho">Có ' + f.loi.length + " lỗi khi ghép (đề lỗi không hiện): " + esc(f.loi[0].thong_bao) + "</span>" : "") +
        '</div><div class="hang-nut"><button type="button" class="nut nut-nho" data-xuat="' + i + '">Xuất ra .md</button>' +
        '<button type="button" class="nut nut-nho" data-sua="' + i + '">Sửa</button>' +
        '<button type="button" class="nut nut-nho nut-xoa" data-xoa="' + i + '">Xóa</button></div></li>';
    });
    h += '</ul><div class="hang-nut"><button type="button" class="nut" id="xuat-het">Xuất tất cả ra một file .md</button></div>';
    o.innerHTML = h;
    o.querySelectorAll("[data-xuat]").forEach(function (b) {
      b.addEventListener("click", function () { var f = NAP[+b.getAttribute("data-xuat")]; taiXuong(f.ten, f.noi_dung); });
    });
    o.querySelectorAll("[data-sua]").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = NAP[+b.getAttribute("data-sua")];
        document.getElementById("nap-chu").value = f.noi_dung;
        document.getElementById("nap-ten").value = f.ten;
        xemTruoc();
        document.getElementById("nap-chu").scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
    o.querySelectorAll("[data-xoa]").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = NAP[+b.getAttribute("data-xoa")];
        if (!confirm("Xóa \"" + f.ten + "\" khỏi trình duyệt? Nên xuất ra .md trước nếu cần giữ.")) return;
        LuuTru.ghiJSON(KHOA_NAP, docNap().filter(function (x) { return x.ten !== f.ten; }));
        location.reload();
      });
    });
    document.getElementById("xuat-het").addEventListener("click", function () {
      taiXuong("de-nap-tay-tat-ca.md", NAP.map(function (f) { return f.noi_dung.replace(/\s+$/, ""); }).join("\n\n"));
    });
  }

  /* ---------- Màn trạm thi ---------- */
  var TT = null; // trạng thái trạm đang làm
  var thanh = null;

  function trangThi(id) {
    var d = DE[id];
    if (!d) return trangChu();
    datTieuDe(tenDe(d));
    var t = d.tram;
    var h = '<nav class="dieu-huong" aria-label="Đường dẫn"><a href="#/tram/' + t.id + '" data-thoat>‹ ' + esc(t.ten) + "</a></nav>";
    h += '<header class="dau-thi"><h1>' + esc(tenDe(d)) + '</h1><div class="dong-chip">' + chipNguon(d) +
      '</div><p class="phu" style="margin:0">' + esc(t.ten) + "</p></header>";

    // Mở đầu + tác vụ
    h += '<section class="khoi" aria-label="Mở đầu"><div class="cot-trai the">';
    h += '<h2>Mở đầu</h2>' + khoiNguon(d.mo_dau) + khoiST(d.mo_dau_soan_them);
    if (d.tac_vu || d.tac_vu_soan_them) h += "<h2 style=\"margin-top:14px\">Tác vụ</h2>" + khoiNguon(d.tac_vu) + khoiST(d.tac_vu_soan_them);
    h += '</div><div class="cot-phai"><p class="goi-y-phai">Kết quả và đáp án của từng bước sẽ hiện ở cột này sau khi bạn bấm <strong>Hoàn thành bước</strong>.</p></div></section>';

    d.buoc.forEach(function (b, i) {
      h += '<section class="khoi buoc" id="buoc-' + i + '" data-tt="khoa" aria-labelledby="tieu-de-buoc-' + i + '"></section>';
    });
    h += '<section class="khoi ket-thuc" id="ket-thuc" hidden></section>';
    h += '<section class="tu-cham the" id="tu-cham" aria-labelledby="tieu-de-tu-cham" hidden></section>';
    veLai(h);

    TT = {
      de: d,
      tong: CAI.phut * 60000,
      daChay: 0,
      moc: null,
      dung: false,
      canh1: false,
      het: false,
      hienTai: 0,
      xong: false,
      buoc: d.buoc.map(function () { return { batDau: 0, thoiGian: null, ghiChu: "" }; })
    };
    d.buoc.forEach(function (b, i) { veBuoc(i); });
    taoThanh();
    batDau();

    app.querySelector("[data-thoat]").addEventListener("click", function (e) {
      if (TT && !TT.xong && !confirm("Thoát trạm đang làm? Ghi chú và thời gian sẽ không được lưu.")) e.preventDefault();
    });
  }

  function veBuoc(i) {
    var d = TT.de, b = d.buoc[i], st = TT.buoc[i];
    var el = document.getElementById("buoc-" + i);
    var tt = i < TT.hienTai || (TT.xong && i <= TT.hienTai) ? "xong" : i === TT.hienTai ? "dang" : "khoa";
    if (st.thoiGian !== null) tt = "xong";
    el.setAttribute("data-tt", tt);
    var dau = '<div class="dau-buoc"><span class="so-buoc" aria-hidden="true">' + (i + 1) + '</span><h2 id="tieu-de-buoc-' + i + '">Bước ' +
      (i + 1) + "/" + d.buoc.length + " · " + esc(b.ten) + "</h2>" +
      (st.thoiGian !== null ? '<span class="thoi-gian-buoc" title="Thời gian làm bước">⏱ ' + mmss(st.thoiGian) + "</span>" : "") + "</div>";
    if (tt === "khoa") {
      el.innerHTML = '<div class="cot-trai">' + dau + '<p class="phu" style="margin:0">Hoàn thành bước trước để mở bước này.</p></div><div class="cot-phai"></div>';
      return;
    }
    var trai = dau;
    if (b.de || b.de_soan_them) {
      trai += khoiNguon(b.de) + khoiST(b.de_soan_them);
    } else {
      trai += '<div class="de-chung"><span class="nhan nhan-chung">yêu cầu chung</span><div>' + esc(D.buoc_mac_dinh[b.ma] || "") + "</div></div>";
    }
    trai += '<div class="ghi-chu"><label for="ghi-chu-' + i + '">Ghi chú của bạn</label><textarea id="ghi-chu-' + i +
      '" placeholder="Ghi ý định làm / câu hỏi / nhận định…"' + (tt === "xong" ? " readonly" : "") + ">" + esc(st.ghiChu) + "</textarea></div>";
    if (tt === "dang") {
      trai += '<div class="hang-nut"><button type="button" class="nut nut-chinh" data-xong="' + i + '">✓ Hoàn thành bước</button></div>';
    }
    var phai = "";
    if (tt === "xong") {
      phai += '<p class="tieu-de-phai">Kết quả sau bước ' + esc(b.ten.toLowerCase()) + "</p>";
      if (b.ket_qua || b.ket_qua_soan_them) {
        phai += khoiNguon(b.ket_qua) + khoiST(b.ket_qua_soan_them);
      } else {
        phai += '<p class="trong">Bước này không có thông tin mở thêm.</p>';
      }
      phai += '<div class="hang-nut"><button type="button" class="nut" data-dap-an="' + i + '" aria-expanded="false" aria-controls="dap-an-' + i +
        '">Xem đáp án bước này</button></div><div class="dap-an" id="dap-an-' + i + '" hidden>';
      if (b.dap_an_de) phai += "<h3>Đáp án / ghi chú riêng của đề (theo tài liệu)</h3>" + khoiNguon(b.dap_an_de);
      if (b.dap_an) phai += "<h3>Đáp án mẫu – các bước tiếp cận (theo tài liệu)</h3>" + khoiNguon(b.dap_an);
      if (!b.dap_an && !b.dap_an_de) phai += '<p class="trong">Tài liệu không có đáp án mẫu riêng cho bước này.</p>';
      phai += "</div>";
    }
    el.innerHTML = '<div class="cot-trai">' + trai + '</div><div class="cot-phai">' + phai + "</div>";

    var ta = el.querySelector("textarea");
    if (ta && tt === "dang") ta.addEventListener("input", function () { st.ghiChu = ta.value; });
    var nx = el.querySelector("[data-xong]");
    if (nx) nx.addEventListener("click", function () { hoanThanhBuoc(); });
    var nd = el.querySelector("[data-dap-an]");
    if (nd) nd.addEventListener("click", function () {
      var p = document.getElementById("dap-an-" + i);
      var mo = p.hidden;
      p.hidden = !mo;
      nd.setAttribute("aria-expanded", String(mo));
      nd.textContent = mo ? "Ẩn đáp án bước này" : "Xem đáp án bước này";
    });
  }

  function hoanThanhBuoc() {
    if (!TT || TT.xong) return;
    var i = TT.hienTai;
    var st = TT.buoc[i];
    var ta = document.getElementById("ghi-chu-" + i);
    if (ta) st.ghiChu = ta.value;
    var bayGio = daChay();
    st.thoiGian = bayGio - st.batDau;
    var cuoi = i === TT.de.buoc.length - 1;
    if (cuoi) {
      TT.xong = true;
      dungDongHo();
    } else {
      TT.hienTai = i + 1;
      TT.buoc[i + 1].batDau = bayGio;
    }
    veBuoc(i);
    if (!cuoi) veBuoc(i + 1);
    capNhatThanh();
    var el = document.getElementById("buoc-" + i);
    var phai = el.querySelector(".cot-phai");
    if (window.matchMedia("(min-width: 1280px)").matches) {
      el.scrollIntoView({ block: "start", behavior: "smooth" });
    } else if (phai) {
      phai.scrollIntoView({ block: "start", behavior: "smooth" });
    }
    if (cuoi) veKetThuc();
  }

  function veKetThuc() {
    var d = TT.de;
    var el = document.getElementById("ket-thuc");
    var h = '<div class="cot-trai the"><h2>Hoàn thành trạm</h2><table><thead><tr><th>Bước</th><th>Thời gian</th></tr></thead><tbody>';
    d.buoc.forEach(function (b, i) {
      h += "<tr><td>" + (i + 1) + ". " + esc(b.ten) + "</td><td>" + mmss(TT.buoc[i].thoiGian) + "</td></tr>";
    });
    h += '</tbody><tfoot><tr><th>Tổng</th><th>' + mmss(TT.daChay) + " / " + mmss(TT.tong) + "</th></tr></tfoot></table>";
    h += '<div class="hang-nut"><button type="button" class="nut nut-chinh" id="lam-lai">↻ Làm lại đề này</button>' +
      '<button type="button" class="nut" id="de-khac">🎲 Đề khác cùng trạm</button>' +
      '<a class="nut" href="#/tram/' + d.tram.id + '">Về danh sách đề</a></div></div>';
    h += '<div class="cot-phai">';
    if (d.giai_dap) {
      h += '<details class="gap" open><summary>Giải đáp / ghi chú của đề (theo tài liệu)</summary>' + khoiNguon(d.giai_dap) + "</details>";
    } else {
      h += '<p class="trong">Tài liệu không có thêm giải đáp riêng cho đề này.</p>';
    }
    h += "</div>";
    el.innerHTML = h;
    el.hidden = false;
    document.getElementById("lam-lai").addEventListener("click", function () { trangThi(d.id); });
    document.getElementById("de-khac").addEventListener("click", function () {
      var ds = d.tram.de.filter(function (x) { return x.id !== d.id; });
      location.hash = "#/de/" + (ds.length ? ngauNhien(ds) : d).id;
    });
    veTuCham();
  }

  /* ---------- Tự chấm ---------- */
  var KHOA_LS = "osce.lich_su";
  var TC = null; // trạng thái tự chấm của lần làm hiện tại

  function docLichSu() {
    var v = LuuTru.docJSON(KHOA_LS, []);
    return Array.isArray(v) ? v : [];
  }
  function soVN(x, le) {
    return Number(x).toLocaleString("vi-VN", { maximumFractionDigits: le === undefined ? 1 : le });
  }
  function boTheP(html) { return html.replace(/^<p>|<\/p>$/g, ""); }

  // checklist: các ý cấp 1 (gạch đầu dòng / số thứ tự ở đầu dòng) trong đáp án riêng + đáp án mẫu của bước
  function mucChecklist(b) {
    var ra = [], daCo = {};
    [b.dap_an_de, b.dap_an].forEach(function (chu) {
      (chu || "").split("\n").forEach(function (l) {
        var m = l.match(/^(?:-|\d+\.)\s+(.*)$/);
        if (!m) return;
        var t = m[1].trim();
        if (!t || t === "(trống)" || daCo[t]) return;
        daCo[t] = true;
        ra.push(t);
      });
    });
    return ra;
  }

  function veTuCham() {
    var d = TT.de, t = d.tram;
    var el = document.getElementById("tu-cham");
    var dsRubric = (t.rubric || []).filter(function (id) { return RUBRIC[id]; });
    TC = {
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      cach: dsRubric.length ? "rubric" : "checklist",
      rubric_id: dsRubric[0] || null,
      chon: {},
      tick: {},
      da_luu: false,
      thoi_gian_ms: Math.round(TT.daChay),
      gio_quy_dinh_ms: TT.tong
    };
    var h = '<h2 id="tieu-de-tu-cham">Tự chấm</h2>';
    h += '<p class="phu">Xem lại đáp án từng bước ở trên rồi tự chấm. Điểm được lưu vào <a href="#/lich-su">Lịch sử</a> trên trình duyệt này.</p>';
    if (dsRubric.length > 1) {
      h += '<label class="nhan-o" for="chon-rubric">Rubric</label><select id="chon-rubric" class="o-chu">' +
        dsRubric.map(function (id) { return '<option value="' + id + '">' + esc(RUBRIC[id].ten) + "</option>"; }).join("") + "</select>";
    }
    h += '<div id="bang-cham"></div>';
    h += '<div class="tong-diem" aria-live="polite"><div><span class="so-diem" id="so-diem">0%</span> <span class="phu" id="chi-tiet-diem"></span></div>' +
      '<div class="hang-nut"><button type="button" class="nut nut-chinh" id="luu-diem">Lưu kết quả</button></div>' +
      '<p class="phu" id="bao-luu" role="status"></p></div>';
    el.innerHTML = h;
    el.hidden = false;
    var sel = document.getElementById("chon-rubric");
    if (sel) sel.addEventListener("change", function () { TC.rubric_id = sel.value; TC.chon = {}; veBangCham(); });
    document.getElementById("luu-diem").addEventListener("click", luuDiem);
    veBangCham();
  }

  function veBangCham() {
    var o = document.getElementById("bang-cham");
    var h = "";
    if (TC.cach === "rubric") {
      var r = RUBRIC[TC.rubric_id];
      h += '<p class="phu">Rubric: <strong>' + esc(r.ten) + "</strong> (trang " + r.trang + " tài liệu rubric" +
        (r.co_diem ? ", tổng " + soVN(r.diem_toi_da, 2) + " điểm" : "; bảng gốc không ghi điểm, tính mỗi mục 1 điểm") +
        "). Rubric gốc viết cho một đề cụ thể; áp dụng tương tự cho đề đang làm. Mỗi mục chọn 1 mức.</p>";
      var nhomTruoc = "";
      r.muc.forEach(function (m, i) {
        if (m.nhom && m.nhom !== nhomTruoc) { h += '<h3 class="nhom-muc">' + esc(m.nhom) + "</h3>"; nhomTruoc = m.nhom; }
        h += '<fieldset class="muc-cham"><legend>' + m.so + ". " + esc(m.ten) + ' <span class="phu">(tối đa ' + soVN(m.diem_toi_da, 2) + " đ)</span></legend><div class=\"luoi-muc\">";
        m.muc_do.forEach(function (md) {
          var id = "m" + i + "-" + md.khoa;
          var tat = !md.tinh_diem;
          h += '<label class="o-muc' + (tat ? " o-tat" : "") + '" for="' + id + '"><input type="radio" name="m' + i + '" id="' + id + '" value="' + md.khoa + '"' +
            (tat ? " disabled" : "") + (TC.chon[i] === md.khoa ? " checked" : "") + ">" +
            '<span class="dau-muc"><strong>' + esc(md.nhan) + "</strong> · " + (tat ? "không tính điểm" : soVN(md.diem, 2) + " đ") + "</span>";
          if (md.ghi_chu && tat) h += '<span class="phu">' + boTheP(window.MD.inline(md.ghi_chu)) + "</span>";
          if (md.tieu_chi.length) h += "<ul>" + md.tieu_chi.map(function (x) { return "<li>" + window.MD.inline(x) + "</li>"; }).join("") + "</ul>";
          h += "</label>";
        });
        h += "</div></fieldset>";
      });
      o.innerHTML = h;
      o.querySelectorAll("input[type=radio]").forEach(function (x) {
        x.addEventListener("change", function () {
          TC.chon[+x.name.slice(1)] = x.value;
          capNhatDiem();
        });
      });
    } else {
      h += '<p class="phu">Trạm này chưa có rubric. Tick các ý đáp án bạn đã làm được (lấy từ đáp án riêng và đáp án mẫu của từng bước).</p>';
      TT.de.buoc.forEach(function (b, i) {
        var ds = mucChecklist(b);
        if (!ds.length) ds = ["Làm đạt yêu cầu bước " + b.ten.toLowerCase() + " theo đáp án"];
        h += '<fieldset class="muc-cham"><legend>Bước ' + (i + 1) + ": " + esc(b.ten) + ' <span class="phu">(' + ds.length + " ý)</span></legend>" +
          '<div class="hang-nut"><button type="button" class="nut nut-nho" data-chon-het="' + i + '">Chọn tất cả</button>' +
          '<button type="button" class="nut nut-nho" data-bo-het="' + i + '">Bỏ chọn</button></div><ul class="ds-tick">';
        ds.forEach(function (x, k) {
          var id = "t" + i + "-" + k;
          h += '<li><label for="' + id + '"><input type="checkbox" id="' + id + '" data-khoa="' + i + "-" + k + '">' +
            "<span>" + window.MD.inline(x) + "</span></label></li>";
        });
        h += "</ul></fieldset>";
      });
      o.innerHTML = h;
      var cap = function () {
        TC.tick = {};
        o.querySelectorAll("input[type=checkbox]").forEach(function (x) { TC.tick[x.getAttribute("data-khoa")] = x.checked; });
        capNhatDiem();
      };
      o.querySelectorAll("input[type=checkbox]").forEach(function (x) { x.addEventListener("change", cap); });
      o.querySelectorAll("[data-chon-het],[data-bo-het]").forEach(function (b) {
        b.addEventListener("click", function () {
          var i = b.getAttribute("data-chon-het") || b.getAttribute("data-bo-het");
          var bat = b.hasAttribute("data-chon-het");
          o.querySelectorAll('input[data-khoa^="' + i + '-"]').forEach(function (x) { x.checked = bat; });
          cap();
        });
      });
      cap();
    }
    capNhatDiem();
  }

  function tinhDiem() {
    if (TC.cach === "rubric") {
      var r = RUBRIC[TC.rubric_id];
      var dat = 0, xong = 0;
      r.muc.forEach(function (m, i) {
        var k = TC.chon[i];
        if (!k) return;
        xong++;
        m.muc_do.forEach(function (md) { if (md.khoa === k) dat += md.diem; });
      });
      return { dat: Math.round(dat * 100) / 100, toi_da: r.diem_toi_da, xong: xong, tong: r.muc.length,
        phan_tram: r.diem_toi_da ? Math.round(dat / r.diem_toi_da * 1000) / 10 : 0 };
    }
    var keys = Object.keys(TC.tick);
    var co = keys.filter(function (k) { return TC.tick[k]; }).length;
    return { dat: co, toi_da: keys.length, xong: keys.length, tong: keys.length,
      phan_tram: keys.length ? Math.round(co / keys.length * 1000) / 10 : 0 };
  }

  function capNhatDiem() {
    var k = tinhDiem();
    document.getElementById("so-diem").textContent = soVN(k.phan_tram) + "%";
    document.getElementById("chi-tiet-diem").textContent = TC.cach === "rubric"
      ? soVN(k.dat, 2) + "/" + soVN(k.toi_da, 2) + " điểm · đã chấm " + k.xong + "/" + k.tong + " mục"
      : k.dat + "/" + k.toi_da + " ý đạt";
    var nut = document.getElementById("luu-diem");
    var thieu = TC.cach === "rubric" && k.xong < k.tong;
    nut.disabled = thieu;
    document.getElementById("bao-luu").textContent = thieu ? "Chọn mức cho đủ " + k.tong + " mục để lưu." :
      TC.da_luu ? "Đã lưu. Sửa lựa chọn rồi bấm Lưu lại để cập nhật." : "";
  }

  function luuDiem() {
    var d = TT ? TT.de : null;
    if (!d || !TC) return;
    var k = tinhDiem();
    var ban = {
      id: TC.id,
      ngay: new Date().toISOString(),
      tram_id: d.tram.id,
      tram_ten: d.tram.ten,
      de_id: d.id,
      de_ten: tenDe(d),
      nguon_de: d.nguon_de,
      diem: k.phan_tram,
      diem_dat: k.dat,
      diem_toi_da: k.toi_da,
      cach_cham: TC.cach,
      rubric_id: TC.cach === "rubric" ? TC.rubric_id : null,
      chi_tiet: TC.cach === "rubric" ? TC.chon : TC.tick,
      thoi_gian_ms: TC.thoi_gian_ms,
      gio_quy_dinh_ms: TC.gio_quy_dinh_ms
    };
    var ds = docLichSu().filter(function (x) { return x.id !== ban.id; });
    ds.push(ban);
    var ok = LuuTru.ghiJSON(KHOA_LS, ds);
    var bao = document.getElementById("bao-luu");
    if (ok) {
      TC.da_luu = true;
      document.getElementById("luu-diem").textContent = "Lưu lại";
      bao.innerHTML = "Đã lưu " + soVN(k.phan_tram) + "% vào <a href=\"#/lich-su\">Lịch sử</a>.";
    } else {
      bao.textContent = "Không lưu được: trình duyệt chặn hoặc hết bộ nhớ lưu trữ.";
    }
  }

  /* ---------- Trang lịch sử ---------- */
  function hopLeBanGhi(x) {
    return x && typeof x === "object" && typeof x.id === "string" && typeof x.de_id === "string" &&
      typeof x.ngay === "string" && !isNaN(Date.parse(x.ngay)) && typeof x.diem === "number" && isFinite(x.diem);
  }

  function trangLichSu() {
    datTieuDe("Lịch sử");
    var ds = docLichSu().filter(hopLeBanGhi).sort(function (a, b) { return b.ngay < a.ngay ? -1 : 1; });
    var h = '<div class="trang-hep"><h1>Lịch sử tự chấm</h1>';
    h += '<div class="hang-nut"><button type="button" class="nut" id="xuat-ls"' + (ds.length ? "" : " disabled") + ">⬇ Xuất file JSON</button>" +
      '<input type="file" id="nhap-ls" class="an-file" accept=".json,application/json"><label class="nut" for="nhap-ls">⬆ Nhập file JSON</label>' +
      (ds.length ? '<button type="button" class="nut nut-xoa" id="xoa-het">Xóa tất cả</button>' : "") + "</div>";
    h += '<p class="phu" id="bao-ls" role="status"></p>';
    if (!ds.length) {
      h += '<p class="trong">Chưa có lần tự chấm nào. Làm xong một trạm rồi bấm <strong>Lưu kết quả</strong> ở phần Tự chấm.</p></div>';
      veLai(h);
      ganLichSu([]);
      return;
    }
    var tb = ds.reduce(function (s, x) { return s + x.diem; }, 0) / ds.length;
    h += '<p class="phu">' + ds.length + " lần · điểm trung bình <strong>" + soVN(tb) + "%</strong></p>";
    // tổng hợp theo trạm
    var theoTram = {};
    ds.forEach(function (x) {
      var t = theoTram[x.tram_id] || (theoTram[x.tram_id] = { ten: x.tram_ten, n: 0, tong: 0, cao: 0, gan: null });
      t.n++; t.tong += x.diem; t.cao = Math.max(t.cao, x.diem);
      if (!t.gan || x.ngay > t.gan.ngay) t.gan = x;
    });
    h += '<h2 class="muc">Theo trạm</h2><table class="bang-ls"><thead><tr><th>Trạm</th><th>Số lần</th><th>TB</th><th>Cao nhất</th><th>Gần nhất</th></tr></thead><tbody>';
    Object.keys(theoTram).forEach(function (id) {
      var t = theoTram[id];
      h += "<tr><td data-nhan=\"Trạm\"><span>" + (TRAM[id] ? '<a href="#/tram/' + esc(id) + '">' + esc(t.ten) + "</a>" : esc(t.ten)) + "</span></td><td data-nhan=\"Số lần\">" + t.n +
        "</td><td data-nhan=\"Trung bình\">" + soVN(t.tong / t.n) + "%</td><td data-nhan=\"Cao nhất\">" + soVN(t.cao) + "%</td><td data-nhan=\"Gần nhất\">" + soVN(t.gan.diem) + "%</td></tr>";
    });
    h += "</tbody></table>";
    h += '<h2 class="muc">Từng lần làm</h2><table class="bang-ls"><thead><tr><th>Ngày</th><th>Trạm · đề</th><th>Điểm</th><th>Thời gian</th><th>Cách chấm</th><th><span class="an-chu">Thao tác</span></th></tr></thead><tbody>';
    ds.forEach(function (x) {
      var cach = x.cach_cham === "rubric" ? "Rubric" + (RUBRIC[x.rubric_id] ? ": " + esc(RUBRIC[x.rubric_id].ten) : "") : "Checklist đáp án";
      h += "<tr><td data-nhan=\"Ngày\">" + esc(new Date(x.ngay).toLocaleString("vi-VN")) + "</td>" +
        '<td data-nhan="Trạm · đề"><span>' + esc(x.tram_ten || "") + "<br>" + (DE[x.de_id] ? '<a href="#/de/' + esc(x.de_id) + '">' + esc(x.de_ten || x.de_id) + "</a>" : esc(x.de_ten || x.de_id)) + "</span></td>" +
        '<td data-nhan="Điểm"><strong>' + soVN(x.diem) + "%</strong></td>" +
        '<td data-nhan="Thời gian"><span>' + (typeof x.thoi_gian_ms === "number" ? mmss(x.thoi_gian_ms) : "—") +
        (typeof x.gio_quy_dinh_ms === "number" ? " / " + mmss(x.gio_quy_dinh_ms) : "") + "</span></td>" +
        '<td data-nhan="Cách chấm"><span>' + cach + "</span></td>" +
        '<td><button type="button" class="nut nut-nho nut-xoa" data-xoa-ls="' + esc(x.id) + '" aria-label="Xóa lần làm này">Xóa</button></td></tr>';
    });
    h += "</tbody></table></div>";
    veLai(h);
    ganLichSu(ds);
  }

  function ganLichSu(ds) {
    var bao = document.getElementById("bao-ls");
    var nx = document.getElementById("xuat-ls");
    if (nx) nx.addEventListener("click", function () {
      var goi = { loai: "osce-lich-su", phien_ban: 1, xuat_luc: new Date().toISOString(), lich_su: docLichSu() };
      var blob = new Blob([JSON.stringify(goi, null, 1)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "osce-lich-su-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    });
    document.getElementById("nhap-ls").addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var goi;
        try { goi = JSON.parse(String(r.result)); } catch (er) { bao.textContent = "File không phải JSON hợp lệ."; return; }
        var moi = Array.isArray(goi) ? goi : goi && Array.isArray(goi.lich_su) ? goi.lich_su : null;
        if (!moi) { bao.textContent = "File JSON không có danh sách \"lich_su\"."; return; }
        var hienCo = docLichSu();
        var daCo = {};
        hienCo.forEach(function (x) { daCo[x.id] = true; });
        var them = 0, trung = 0, hong = 0;
        moi.forEach(function (x) {
          if (!hopLeBanGhi(x)) { hong++; return; }
          if (daCo[x.id]) { trung++; return; }
          daCo[x.id] = true;
          hienCo.push(x);
          them++;
        });
        if (!LuuTru.ghiJSON(KHOA_LS, hienCo)) { bao.textContent = "Không lưu được: trình duyệt chặn hoặc hết bộ nhớ lưu trữ."; return; }
        trangLichSu();
        document.getElementById("bao-ls").textContent = "Đã nhập " + them + " lần làm" + (trung ? ", bỏ qua " + trung + " lần trùng" : "") +
          (hong ? ", bỏ qua " + hong + " bản ghi lỗi" : "") + ".";
      };
      r.readAsText(f, "utf-8");
    });
    var xh = document.getElementById("xoa-het");
    if (xh) xh.addEventListener("click", function () {
      if (!confirm("Xóa toàn bộ lịch sử tự chấm? Nên Xuất file JSON trước để sao lưu.")) return;
      LuuTru.ghiJSON(KHOA_LS, []);
      trangLichSu();
    });
    app.querySelectorAll("[data-xoa-ls]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!confirm("Xóa lần làm này khỏi lịch sử?")) return;
        var id = b.getAttribute("data-xoa-ls");
        LuuTru.ghiJSON(KHOA_LS, docLichSu().filter(function (x) { return x.id !== id; }));
        trangLichSu();
      });
    });
  }

  /* ---------- Đồng hồ ---------- */
  var hen = null;
  function daChay() {
    if (!TT) return 0;
    return TT.daChay + (TT.moc !== null ? performance.now() - TT.moc : 0);
  }
  function batDau() {
    TT.moc = performance.now();
    TT.dung = false;
    hen = setInterval(tick, 250);
    tick();
  }
  function dungDongHo() {
    if (!TT) return;
    TT.daChay = daChay();
    TT.moc = null;
    clearInterval(hen);
    hen = null;
  }
  function tamDung() {
    if (!TT || TT.xong) return;
    if (TT.dung) {
      TT.dung = false;
      TT.moc = performance.now();
      hen = setInterval(tick, 250);
    } else {
      TT.dung = true;
      TT.daChay = daChay();
      TT.moc = null;
      clearInterval(hen);
      hen = null;
    }
    capNhatThanh();
  }
  function tick() {
    if (!TT) return;
    var con = TT.tong - daChay();
    if (!TT.canh1 && con <= 60000 && con > 0) {
      TT.canh1 = true;
      bao("Còn 1 phút!", false);
      tiengBip(1);
    }
    if (!TT.het && con <= 0) {
      TT.het = true;
      bao("Hết giờ! Đồng hồ tiếp tục đếm thời gian vượt.", true);
      tiengBip(3);
    }
    capNhatThanh();
  }
  function chinhTong(phut) {
    if (!TT || TT.xong) return;
    TT.tong = Math.max(60000, TT.tong + phut * 60000);
    var con = TT.tong - daChay();
    TT.canh1 = con <= 60000;
    TT.het = con <= 0;
    capNhatThanh();
  }

  function taoThanh() {
    if (!thanh) {
      thanh = document.createElement("div");
      thanh.className = "thanh";
      thanh.setAttribute("role", "region");
      thanh.setAttribute("aria-label", "Đồng hồ và điều khiển trạm");
      thanh.innerHTML =
        '<button type="button" class="nut nut-nho" id="nut-dung" aria-pressed="false" aria-label="Tạm dừng đồng hồ (Space)"></button>' +
        '<div class="dong-ho" role="timer" aria-live="off"><span class="so" id="so-dong-ho">07:00</span><span class="nhan-dh" id="nhan-dong-ho">còn lại</span></div>' +
        '<div class="chinh-nhanh"><button type="button" class="nut nut-nho" data-tong="-1" aria-label="Bớt 1 phút">−1′</button>' +
        '<button type="button" class="nut nut-nho" data-tong="1" aria-label="Thêm 1 phút">+1′</button></div>' +
        '<span class="phim-tat">Enter = Hoàn thành bước · Space = Tạm dừng</span>' +
        '<button type="button" class="nut nut-chinh" id="nut-xong"><span id="chu-nut-xong">✓ Hoàn thành bước</span></button>';
      document.body.insertBefore(thanh, app);
      document.getElementById("nut-dung").addEventListener("click", tamDung);
      document.getElementById("nut-xong").addEventListener("click", function () {
        if (TT && TT.xong) {
          var k = document.getElementById("tu-cham");
          if (k) k.scrollIntoView({ behavior: "smooth", block: "start" });
        } else hoanThanhBuoc();
      });
      thanh.querySelectorAll("[data-tong]").forEach(function (b) {
        b.addEventListener("click", function () { chinhTong(parseInt(b.getAttribute("data-tong"), 10)); });
      });
    }
    thanh.hidden = false;
    document.body.classList.add("co-thanh");
    capNhatThanh();
  }
  function capNhatThanh() {
    if (!thanh || !TT) return;
    var con = TT.tong - daChay();
    document.getElementById("so-dong-ho").textContent = mmss(con);
    document.getElementById("nhan-dong-ho").textContent = TT.xong ? "đã xong" : TT.dung ? "tạm dừng" : con < 0 ? "vượt giờ" : "còn lại";
    thanh.setAttribute("data-canh", con <= 60000 ? "1" : "0");
    thanh.setAttribute("data-het", con <= 0 ? "1" : "0");
    var nd = document.getElementById("nut-dung");
    nd.innerHTML = TT.dung
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
    nd.setAttribute("aria-pressed", String(TT.dung));
    nd.setAttribute("aria-label", TT.dung ? "Tiếp tục đồng hồ (Space)" : "Tạm dừng đồng hồ (Space)");
    nd.disabled = TT.xong;
    var b = TT.de.buoc[TT.hienTai];
    document.getElementById("chu-nut-xong").innerHTML = TT.xong ? "Tự chấm điểm" :
      "✓ Hoàn thành bước" + '<span class="chu-dai"> ' + (TT.hienTai + 1) + (b ? ": " + esc(b.ten) : "") + "</span>";
  }
  function dungTram() {
    if (hen) { clearInterval(hen); hen = null; }
    TT = null;
    if (thanh) thanh.hidden = true;
    document.body.classList.remove("co-thanh");
    thongBao.hidden = true;
  }

  var henBao = null;
  function bao(chu, nguy) {
    thongBao.textContent = chu;
    thongBao.className = "thong-bao" + (nguy ? " nguy" : "");
    thongBao.hidden = false;
    clearTimeout(henBao);
    henBao = setTimeout(function () { thongBao.hidden = true; }, nguy ? 6000 : 4000);
    try { if (navigator.vibrate) navigator.vibrate(nguy ? [300, 150, 300, 150, 300] : 250); } catch (e) { /* bỏ qua */ }
  }
  var amThanh = null;
  function moAmThanh() {
    try {
      if (!amThanh) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) amThanh = new AC();
      }
      if (amThanh && amThanh.state === "suspended") amThanh.resume();
    } catch (e) { amThanh = null; }
  }
  function tiengBip(lan) {
    if (!amThanh) return;
    try {
      for (var k = 0; k < lan; k++) {
        var o = amThanh.createOscillator(), g = amThanh.createGain();
        var t0 = amThanh.currentTime + k * 0.35;
        o.frequency.value = 880;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
        o.connect(g); g.connect(amThanh.destination);
        o.start(t0); o.stop(t0 + 0.27);
      }
    } catch (e) { /* bỏ qua */ }
  }
  document.addEventListener("pointerdown", moAmThanh, { passive: true });
  document.addEventListener("keydown", moAmThanh);

  /* ---------- Phím tắt ---------- */
  document.addEventListener("keydown", function (e) {
    if (!TT || hopHinh.open) return;
    var dich = e.target;
    var tag = dich && dich.tagName;
    var dangGo = tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT" || (dich && dich.isContentEditable);
    if (e.key === "Enter") {
      if (dangGo) {
        if (tag === "TEXTAREA" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); hoanThanhBuoc(); }
        return;
      }
      if (tag === "BUTTON" || tag === "A" || tag === "SUMMARY") return; // Enter bấm nút đang chọn
      e.preventDefault();
      hoanThanhBuoc();
    } else if (e.key === " " || e.code === "Space") {
      if (dangGo || e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      tamDung();
    }
  });

  /* ---------- Xem hình ---------- */
  app.addEventListener("click", function (e) {
    var nut = e.target.closest && e.target.closest(".md-img");
    if (!nut) return;
    var src = nut.getAttribute("data-src");
    if (hopHinh.showModal) {
      hopHinh.querySelector("img").src = src;
      hopHinh.showModal();
    } else {
      window.open(src, "_blank");
    }
  });
  hopHinh.addEventListener("click", function (e) { if (e.target === hopHinh) hopHinh.close(); });

  /* ---------- Định tuyến ---------- */
  function dinhTuyen() {
    var h = location.hash.replace(/^#\/?/, "");
    var p = h.split("/");
    if (p[0] === "tram" && p[1]) trangTram(decodeURIComponent(p[1]));
    else if (p[0] === "de" && p[1]) trangThi(decodeURIComponent(p[1]));
    else if (p[0] === "c" && p[1]) trangChu(decodeURIComponent(p[1]));
    else if (p[0] === "huong-dan") trangHuongDan();
    else if (p[0] === "nap") trangNap();
    else if (p[0] === "lich-su") trangLichSu();
    else trangChu();
    app.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", dinhTuyen);
  dinhTuyen();
})();

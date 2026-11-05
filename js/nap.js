/* Trình đọc / xuất file nạp đề OSCE (Markdown) – dùng chung cho web và Node (tools/build_data.js).
   Khuôn: xem mau-nap/MAU_NAP_DE_OSCE.md.

   API:
     NapDe.doc(chu, tenFile)      -> { tram: [ ... ], loi: [{dong, thong_bao}] }
     NapDe.xuat(tram)             -> chuỗi Markdown đúng khuôn (đọc lại ra y hệt)
     NapDe.dungDuLieu(dsTram, huongDan) -> đối tượng giống data/stations.json
     NapDe.ghep(duLieu, dsTram)   -> danh sách lỗi; ghép trạm/đề nạp tay vào dữ liệu
*/
(function (goc, tao) {
  if (typeof module === "object" && module.exports) module.exports = tao();
  else goc.NapDe = tao();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var BUOC = [
    { ma: "hoi_benh", ten: "Hỏi bệnh", ten_khac: ["hỏi bệnh", "hỏi bệnh sử"] },
    { ma: "kham", ten: "Khám", ten_khac: ["khám", "thăm khám"] },
    { ma: "cls", ten: "Cận lâm sàng", ten_khac: ["cận lâm sàng", "cls"] },
    { ma: "chan_doan", ten: "Chẩn đoán – nhận định", ten_khac: ["chẩn đoán – nhận định", "chẩn đoán - nhận định", "chẩn đoán", "nhận định"] },
    { ma: "xu_tri", ten: "Xử trí – tư vấn", ten_khac: ["xử trí – tư vấn", "xử trí - tư vấn", "xử trí", "tư vấn"] },
  ];
  var BUOC_THEO_MA = {};
  BUOC.forEach(function (b) { BUOC_THEO_MA[b.ma] = b; });

  var DE_CHUNG = {
    hoi_benh: "Hỏi bệnh sử, tiền căn liên quan đến vấn đề của thai phụ.",
    kham: "Thăm khám phù hợp với tình huống (tổng trạng, sinh hiệu, khám ngoài, khám trong nếu cần).",
    cls: "Đề nghị và đọc các cận lâm sàng cần thiết (xin sổ khám thai, giấy tờ, kết quả xét nghiệm).",
    chan_doan: "Nêu chẩn đoán / nhận định tình trạng mẹ và thai, giải thích vì sao.",
    xu_tri: "Tư vấn, giải đáp thắc mắc và đưa ra hướng xử trí – quản lý tiếp theo.",
  };

  var TRONG = "(trống)";
  var RE_SOAN_THEM = /^\s*(\*\*)?Soạn thêm:?(\*\*)?\s*$/i;
  var RE_META = /^([^:]{1,30}):\s*(.*)$/;

  function chuanTen(s) { return String(s || "").trim().toLowerCase().replace(/\s+/g, " "); }
  function timBuoc(ten) {
    var t = chuanTen(ten);
    for (var i = 0; i < BUOC.length; i++) if (BUOC[i].ten_khac.indexOf(t) >= 0) return BUOC[i];
    return null;
  }
  function slug(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "x";
  }
  function catDong(arr) {
    var a = arr.slice();
    while (a.length && !a[0].trim()) a.shift();
    while (a.length && !a[a.length - 1].trim()) a.pop();
    return a.join("\n");
  }
  function tachSoanThem(dongs) {
    // trả về [phần nguồn, phần soạn thêm]
    for (var i = 0; i < dongs.length; i++) {
      if (RE_SOAN_THEM.test(dongs[i].text)) {
        return [catDong(dongs.slice(0, i).map(t)), catDong(dongs.slice(i + 1).map(t))];
      }
    }
    return [catDong(dongs.map(t)), ""];
    function t(x) { return x.text; }
  }
  function soChuong(ten) { var m = String(ten).match(/CHƯƠNG\s*(\d+)/i); return m ? parseInt(m[1], 10) : null; }
  function maChuong(ten) { var n = soChuong(ten); return n !== null ? "c" + n : "c-" + slug(ten); }
  function tenHienThi(de) {
    return (/^\d+(\.\d+)+$/.test(de.so || "") ? de.so + " " : "") + (de.ten || de.nguon_de || "");
  }

  /* ---------------- ĐỌC ---------------- */
  function doc(chu, tenFile) {
    var loi = [];
    function baoLoi(dong, tb) { loi.push({ dong: dong, thong_bao: tb, file: tenFile || "" }); }

    // bỏ chú thích <!-- ... --> (giữ số dòng)
    var dong = String(chu).replace(/\r\n?/g, "\n").split("\n");
    var gocDong = dong.slice();
    var trongCT = false;
    dong = dong.map(function (l) {
      var ra = "";
      var i = 0;
      while (i < l.length) {
        if (trongCT) {
          var k = l.indexOf("-->", i);
          if (k < 0) { i = l.length; break; }
          trongCT = false; i = k + 3;
        } else {
          var m = l.indexOf("<!--", i);
          if (m < 0) { ra += l.slice(i); break; }
          ra += l.slice(i, m); trongCT = true; i = m + 4;
        }
      }
      return ra;
    });
    var chiCoChuThich = dong.map(function (l, i) { return l.trim() === "" && gocDong[i].trim() !== ""; });

    var dsTram = [];
    var tram = null, de = null, buoc = null;
    var muc = null; // { loai, dongs: [], dong }
    var vungMeta = null; // "tram" | "de"
    var trongRao = false;

    function dongMuc() {
      if (!muc) return;
      var m = muc;
      muc = null;
      var phan = tachSoanThem(m.dongs);
      var coST = m.dongs.some(function (x) { return RE_SOAN_THEM.test(x.text); });
      if (coST && ["mo_dau", "tac_vu", "de", "ket_qua"].indexOf(m.loai) < 0) {
        baoLoi(m.dong, "Mục \"" + m.ten + "\" không dùng dòng \"Soạn thêm:\" (chỉ dùng trong Mở đầu, Tác vụ, Đề, Kết quả).");
      }
      if (m.loai === "ly_thuyet") tram.ly_thuyet = catDong(m.dongs.map(function (x) { return x.text; }));
      else if (m.loai === "da_mau") tram._dap_an[m.buoc] = catDong(m.dongs.map(function (x) { return x.text; }));
      else if (m.loai === "mo_dau") { de.mo_dau = phan[0]; de.mo_dau_soan_them = phan[1]; de._coMoDau = true; }
      else if (m.loai === "tac_vu") { de.tac_vu = phan[0]; de.tac_vu_soan_them = phan[1]; }
      else if (m.loai === "giai_dap") { de.giai_dap = phan[0]; }
      else if (m.loai === "de") { buoc.de = phan[0]; buoc.de_soan_them = phan[1]; buoc._coDe = true; }
      else if (m.loai === "ket_qua") {
        buoc.ket_qua = [buoc.ket_qua, phan[0]].filter(Boolean).join("\n\n");
        buoc.ket_qua_soan_them = phan[1];
      } else if (m.loai === "hinh") {
        var hinh = m.dongs.map(function (x) { return x.text.trim(); }).filter(Boolean).map(function (s) {
          return /^!\[/.test(s) ? s : "![](" + s.replace(/^[-*+]\s+/, "") + ")";
        });
        buoc._hinh = (buoc._hinh || []).concat(hinh);
      } else if (m.loai === "dap_an") {
        var v = catDong(m.dongs.map(function (x) { return x.text; }));
        buoc._dapAn = v.trim() === TRONG ? "" : v;
        buoc._coDapAn = true;
      } else if (m.loai === "dap_an_de") buoc.dap_an_de = catDong(m.dongs.map(function (x) { return x.text; }));
    }
    function moMuc(loai, ten, dongSo, extra) {
      dongMuc();
      vungMeta = null;
      muc = { loai: loai, ten: ten, dongs: [], dong: dongSo };
      if (extra) for (var k in extra) muc[k] = extra[k];
    }
    function dongBuoc() { dongMuc(); buoc = null; }
    function dongDe() {
      dongBuoc();
      if (!de) return;
      if (!de._coMoDau || (!de.mo_dau && !de.mo_dau_soan_them)) baoLoi(de._dong, "Đề \"" + de._tieuDe + "\" thiếu mục \"### Mở đầu\" (hoặc mục này trống).");
      if (!de.buoc.length) baoLoi(de._dong, "Đề \"" + de._tieuDe + "\" chưa có bước nào (### BƯỚC: …).");
      de = null;
    }
    function dongTram() { dongDe(); dongMuc(); tram = null; }

    for (var i = 0; i < dong.length; i++) {
      var l = dong[i];
      var so = i + 1;
      if (/^\s*```/.test(l)) trongRao = !trongRao;
      var cauTruc = !trongRao && /^#{1,4} /.test(l) ? phanTich(l) : null;

      if (cauTruc) {
        if (cauTruc.loai === "tram") {
          dongTram();
          tram = { ten: cauTruc.gt, _dong: so, _meta: {}, _dap_an: {}, ly_thuyet: "", de: [] };
          dsTram.push(tram);
          vungMeta = "tram";
          continue;
        }
        if (!tram) { baoLoi(so, "Dòng cấu trúc \"" + l.trim() + "\" nằm trước \"# TRẠM:\"."); continue; }
        if (cauTruc.loai === "ly_thuyet") { dongDe(); moMuc("ly_thuyet", "Lý thuyết", so); continue; }
        if (cauTruc.loai === "da_mau") { dongDe(); dongMuc(); vungMeta = null; tram._trongDaMau = true; continue; }
        if (cauTruc.loai === "de") {
          dongDe();
          tram._trongDaMau = false;
          if (!cauTruc.gt) baoLoi(so, "Thiếu tên đề sau \"## ĐỀ:\".");
          de = { _dong: so, _tieuDe: cauTruc.gt, _meta: {}, mo_dau: "", mo_dau_soan_them: "", tac_vu: "", tac_vu_soan_them: "", giai_dap: "", buoc: [] };
          tram.de.push(de);
          vungMeta = "de";
          continue;
        }
        if (cauTruc.loai === "buoc") {
          var bb = timBuoc(cauTruc.gt);
          if (tram._trongDaMau && !de) {
            if (!bb) { baoLoi(so, "Tên bước lạ \"" + cauTruc.gt + "\". Dùng một trong: " + BUOC.map(function (x) { return x.ten; }).join(", ") + "."); moMuc("bo", "", so); continue; }
            moMuc("da_mau", bb.ten, so, { buoc: bb.ma });
            continue;
          }
          if (!de) { baoLoi(so, "\"### BƯỚC:\" phải nằm trong một \"## ĐỀ:\"."); continue; }
          dongBuoc();
          if (!bb) {
            baoLoi(so, "Tên bước lạ \"" + cauTruc.gt + "\". Dùng một trong: " + BUOC.map(function (x) { return x.ten; }).join(", ") + ".");
            buoc = { _bo: true };
            continue;
          }
          if (de.buoc.some(function (x) { return x.ma === bb.ma; })) baoLoi(so, "Bước \"" + bb.ten + "\" bị lặp trong đề \"" + de._tieuDe + "\".");
          buoc = { ma: bb.ma, ten: bb.ten, de: "", de_soan_them: "", ket_qua: "", ket_qua_soan_them: "", dap_an: "", dap_an_de: "", _dong: so };
          de.buoc.push(buoc);
          continue;
        }
        if (cauTruc.loai === "mo_dau" || cauTruc.loai === "tac_vu" || cauTruc.loai === "giai_dap") {
          if (!de) { baoLoi(so, "\"" + l.trim() + "\" phải nằm trong một \"## ĐỀ:\"."); continue; }
          dongBuoc();
          moMuc(cauTruc.loai, l.replace(/^#+\s*/, ""), so);
          continue;
        }
        if (cauTruc.loai === "muc_buoc") {
          if (buoc) {
            if (buoc._bo) { moMuc("bo", "", so); continue; }
            moMuc(cauTruc.ma, cauTruc.gt, so);
            continue;
          }
          // ngoài bước: coi như nội dung nếu đang trong một mục
          if (!muc) { baoLoi(so, "\"" + l.trim() + "\" phải nằm trong một \"### BƯỚC: …\"."); continue; }
        }
      }

      // dòng thường
      if (muc) {
        if (chiCoChuThich[i]) continue;
        if (muc.loai !== "bo") muc.dongs.push({ text: l, dong: so });
        continue;
      }
      if (!l.trim()) continue;
      if (vungMeta && RE_META.test(l)) {
        var mm = l.match(RE_META);
        var khoa = mm[1].trim(), gt = mm[2].trim();
        var hopLe = vungMeta === "tram" ? ["Mã", "Chương", "Tên gốc"] : ["Số", "Mã", "Nguồn đề", "Tên", "Dòng nguồn"];
        if (hopLe.indexOf(khoa) < 0) { baoLoi(so, "Thông tin lạ \"" + khoa + "\". Dùng: " + hopLe.join(", ") + "."); continue; }
        (vungMeta === "tram" ? tram : de)._meta[khoa] = gt;
        continue;
      }
      if (!tram) continue; // phần giới thiệu trước "# TRẠM:" được bỏ qua
      if (chiCoChuThich[i]) continue;
      if (/^#{1,6} /.test(l)) baoLoi(so, "Tiêu đề lạ \"" + l.trim() + "\". Xem các dòng cấu trúc trong khuôn.");
      else baoLoi(so, "Dòng nằm ngoài mục nào (cần đặt dưới ### Mở đầu, #### Đề, #### Kết quả…): \"" + l.trim().slice(0, 60) + "\".");
    }
    dongTram();

    // hoàn thiện
    dsTram.forEach(function (t) {
      var m = t._meta;
      if (!m["Chương"]) baoLoi(t._dong, "Trạm \"" + t.ten + "\" thiếu dòng \"Chương: …\".");
      if (!t.ten) baoLoi(t._dong, "Thiếu tên trạm sau \"# TRẠM:\".");
      t.id = m["Mã"] || slug(t.ten);
      t.chuong_ten = m["Chương"] || "";
      t.ten_goc = m["Tên gốc"] || t.ten;
      if (!t.de.length) baoLoi(t._dong, "Trạm \"" + t.ten + "\" chưa có đề nào (## ĐỀ: …).");
      var daCo = {}, daCoMa = {};
      t.de.forEach(function (d) {
        var dm = d._meta;
        d.so = dm["Số"] || "";
        d.ten = "Tên" in dm ? dm["Tên"] : d._tieuDe;
        d.nguon_de = dm["Nguồn đề"] || "Đề nạp tay";
        d.id = dm["Mã"] || (t.id + "--" + slug(d.so || d._tieuDe));
        var dn = (dm["Dòng nguồn"] || "").match(/^(\d+)\s*-\s*(\d+)$/);
        d.dong = dn ? [parseInt(dn[1], 10), parseInt(dn[2], 10)] : null;
        var khoa = chuanTen(d._tieuDe);
        if (daCo[khoa]) baoLoi(d._dong, "Trùng tên đề \"" + d._tieuDe + "\" (đã có ở dòng " + daCo[khoa] + ").");
        else daCo[khoa] = d._dong;
        if (daCoMa[d.id]) baoLoi(d._dong, "Trùng mã đề \"" + d.id + "\" (đã có ở dòng " + daCoMa[d.id] + ").");
        else daCoMa[d.id] = d._dong;
        d.buoc.forEach(function (b) {
          if (!b._coDe) baoLoi(b._dong, "Bước \"" + b.ten + "\" của đề \"" + d._tieuDe + "\" thiếu mục \"#### Đề\" (để trống nếu dùng yêu cầu chung).");
          if (b._hinh && b._hinh.length) b.ket_qua = [b.ket_qua].concat(b._hinh).filter(Boolean).join("\n\n");
          b.dap_an = b._coDapAn ? b._dapAn : (t._dap_an[b.ma] || "");
        });
        d.soan_them = [];
        if (d.mo_dau_soan_them) d.soan_them.push("mo_dau");
        if (d.tac_vu_soan_them) d.soan_them.push("tac_vu");
        d.buoc.forEach(function (b) { if (b.ket_qua_soan_them || b.de_soan_them) d.soan_them.push(b.ma); });
      });
    });
    loi.sort(function (a, b) { return a.dong - b.dong; });
    return { tram: dsTram.map(sachTram), loi: loi };
  }

  function phanTich(l) {
    var m;
    if ((m = l.match(/^# TRẠM:\s*(.*)$/))) return { loai: "tram", gt: m[1].trim() };
    if (/^## LÝ THUYẾT\s*$/.test(l)) return { loai: "ly_thuyet" };
    if (/^## ĐÁP ÁN MẪU\s*$/.test(l)) return { loai: "da_mau" };
    if ((m = l.match(/^## ĐỀ:\s*(.*)$/))) return { loai: "de", gt: m[1].trim() };
    if ((m = l.match(/^### BƯỚC:\s*(.*)$/))) return { loai: "buoc", gt: m[1].trim() };
    if (/^### Mở đầu\s*$/.test(l)) return { loai: "mo_dau" };
    if (/^### Tác vụ\s*$/.test(l)) return { loai: "tac_vu" };
    if (/^### Giải đáp\s*$/.test(l)) return { loai: "giai_dap" };
    if ((m = l.match(/^#### (Đề|Kết quả|Hình|Đáp án riêng|Đáp án)\s*$/))) {
      var ma = { "Đề": "de", "Kết quả": "ket_qua", "Hình": "hinh", "Đáp án": "dap_an", "Đáp án riêng": "dap_an_de" }[m[1]];
      return { loai: "muc_buoc", ma: ma, gt: m[1] };
    }
    return null;
  }

  function sachTram(t) {
    return {
      id: t.id,
      ten: t.ten,
      ten_goc: t.ten_goc,
      chuong_ten: t.chuong_ten,
      ly_thuyet: t.ly_thuyet || "",
      de: t.de.map(function (d) {
        return {
          id: d.id, so: d.so, ten: d.ten, nguon_de: d.nguon_de, dong: d.dong,
          mo_dau: d.mo_dau, mo_dau_soan_them: d.mo_dau_soan_them,
          tac_vu: d.tac_vu, tac_vu_soan_them: d.tac_vu_soan_them,
          buoc: d.buoc.map(function (b) {
            return {
              ma: b.ma, ten: b.ten, de: b.de, de_soan_them: b.de_soan_them,
              ket_qua: b.ket_qua, ket_qua_soan_them: b.ket_qua_soan_them,
              dap_an: b.dap_an, dap_an_de: b.dap_an_de,
            };
          }),
          giai_dap: d.giai_dap,
          soan_them: d.soan_them,
        };
      }),
    };
  }

  /* ---------------- DỰNG DỮ LIỆU ---------------- */
  function dungDuLieu(dsTram, huongDan) {
    var chuong = [];
    var theoMa = {};
    dsTram.forEach(function (t) {
      var ma = maChuong(t.chuong_ten);
      if (!theoMa[ma]) { theoMa[ma] = { id: ma, ten: t.chuong_ten, tram: [] }; chuong.push(theoMa[ma]); }
      theoMa[ma].tram.push({ id: t.id, ten: t.ten, ten_goc: t.ten_goc, ly_thuyet: t.ly_thuyet, de: t.de });
    });
    chuong.sort(function (a, b) {
      var x = soChuong(a.ten), y = soChuong(b.ten);
      return (x === null ? 999 : x) - (y === null ? 999 : y);
    });
    return {
      nguon: "mau-nap/tram/*.md",
      ghi_chu: "Chữ trong các trường không có hậu tố _soan_them được chép nguyên dòng từ tài liệu nguồn. Trường *_soan_them là phần tự soạn thêm.",
      buoc_mac_dinh: DE_CHUNG,
      huong_dan_chung: huongDan || "",
      chuong: chuong,
    };
  }

  /* Ghép trạm nạp tay vào dữ liệu đang có. Trạm trùng mã -> thêm đề vào trạm đó. */
  function ghep(duLieu, dsTram, nhanNapTay) {
    var loi = [];
    var tramTheoMa = {}, deTheoMa = {};
    duLieu.chuong.forEach(function (c) {
      c.tram.forEach(function (t) {
        tramTheoMa[t.id] = { c: c, t: t };
        t.de.forEach(function (d) { deTheoMa[d.id] = t; });
      });
    });
    dsTram.forEach(function (t) {
      var co = tramTheoMa[t.id];
      var dich;
      if (co) dich = co.t;
      else {
        var ma = maChuong(t.chuong_ten);
        var c = null;
        duLieu.chuong.forEach(function (x) { if (x.id === ma) c = x; });
        if (!c) {
          c = { id: ma, ten: t.chuong_ten, tram: [] };
          duLieu.chuong.push(c);
          duLieu.chuong.sort(function (a, b) {
            var x = soChuong(a.ten), y = soChuong(b.ten);
            return (x === null ? 999 : x) - (y === null ? 999 : y);
          });
        }
        dich = { id: t.id, ten: t.ten, ten_goc: t.ten_goc, ly_thuyet: t.ly_thuyet, de: [] };
        c.tram.push(dich);
        tramTheoMa[t.id] = { c: c, t: dich };
      }
      var tenCo = {};
      dich.de.forEach(function (d) { tenCo[chuanTen(tenHienThi(d))] = true; });
      t.de.forEach(function (d) {
        if (deTheoMa[d.id]) { loi.push({ dong: 0, ma_de: d.id, ten_de: tenHienThi(d), thong_bao: "Trùng mã đề \"" + d.id + "\" với đề đã có trong trạm \"" + deTheoMa[d.id].ten + "\"." }); return; }
        if (tenCo[chuanTen(tenHienThi(d))]) { loi.push({ dong: 0, ma_de: d.id, ten_de: tenHienThi(d), thong_bao: "Trùng tên đề \"" + tenHienThi(d) + "\" với đề đã có trong trạm \"" + dich.ten + "\"." }); return; }
        if (nhanNapTay) d.nap_tay = true;
        dich.de.push(d);
        deTheoMa[d.id] = dich;
        tenCo[chuanTen(tenHienThi(d))] = true;
      });
    });
    return loi;
  }

  /* ---------------- XUẤT ---------------- */
  function xuat(tram, chuongTen) {
    var L = [];
    L.push("# TRẠM: " + tram.ten);
    L.push("Mã: " + tram.id);
    L.push("Chương: " + (chuongTen || tram.chuong_ten || ""));
    if (tram.ten_goc && tram.ten_goc !== tram.ten) L.push("Tên gốc: " + tram.ten_goc);
    L.push("");
    if (tram.ly_thuyet) { L.push("## LÝ THUYẾT", "", tram.ly_thuyet, ""); }

    // đáp án mẫu chung của trạm = giá trị xuất hiện nhiều nhất cho mỗi bước
    var mau = {};
    BUOC.forEach(function (bb) {
      var dem = {};
      tram.de.forEach(function (d) {
        d.buoc.forEach(function (b) { if (b.ma === bb.ma && b.dap_an) dem[b.dap_an] = (dem[b.dap_an] || 0) + 1; });
      });
      var tot = null, n = 0;
      Object.keys(dem).forEach(function (k) { if (dem[k] > n) { n = dem[k]; tot = k; } });
      if (tot !== null && n >= 2) mau[bb.ma] = tot;
    });
    var coMau = Object.keys(mau).length > 0;
    if (coMau) {
      L.push("## ĐÁP ÁN MẪU", "");
      BUOC.forEach(function (bb) { if (mau[bb.ma]) L.push("### BƯỚC: " + bb.ten, "", mau[bb.ma], ""); });
    }

    tram.de.forEach(function (d) {
      L.push("## ĐỀ: " + tenHienThi(d));
      if (d.so) L.push("Số: " + d.so);
      L.push("Mã: " + d.id);
      L.push("Nguồn đề: " + d.nguon_de);
      L.push("Tên: " + (d.ten || ""));
      if (d.dong && d.dong.length === 2) L.push("Dòng nguồn: " + d.dong[0] + "-" + d.dong[1]);
      L.push("");
      L.push("### Mở đầu", "");
      khoiST(d.mo_dau, d.mo_dau_soan_them);
      if (d.tac_vu || d.tac_vu_soan_them) { L.push("### Tác vụ", ""); khoiST(d.tac_vu, d.tac_vu_soan_them); }
      d.buoc.forEach(function (b) {
        L.push("### BƯỚC: " + b.ten, "");
        L.push("#### Đề", "");
        khoiST(b.de, b.de_soan_them);
        if (b.ket_qua || b.ket_qua_soan_them) { L.push("#### Kết quả", ""); khoiST(b.ket_qua, b.ket_qua_soan_them); }
        var macDinh = mau[b.ma] || "";
        if (b.dap_an !== macDinh) { L.push("#### Đáp án", "", b.dap_an || TRONG, ""); }
        if (b.dap_an_de) { L.push("#### Đáp án riêng", "", b.dap_an_de, ""); }
      });
      if (d.giai_dap) L.push("### Giải đáp", "", d.giai_dap, "");
    });
    while (L.length && L[L.length - 1] === "") L.pop();
    return L.join("\n") + "\n";

    function khoiST(nguon, st) {
      if (nguon) L.push(nguon, "");
      if (st) L.push("Soạn thêm:", st, "");
    }
  }

  return {
    BUOC: BUOC,
    DE_CHUNG: DE_CHUNG,
    doc: doc,
    xuat: xuat,
    dungDuLieu: dungDuLieu,
    ghep: ghep,
    tenHienThi: tenHienThi,
    slug: slug,
  };
});

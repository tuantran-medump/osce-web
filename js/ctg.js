/* Sinh băng CTG mô phỏng (SVG) – chuyển từ nguon/tap-doc-ctg/script/ctggen.py + cases.py sang JS.
   Dùng chung cho web (window.CTG) và Node (require). Có seed để sinh băng mới cùng kiểu với ca gốc. */
(function (goc, tao) {
  if (typeof module === "object" && module.exports) module.exports = tao();
  else goc.CTG = tao();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var FS = 4; // Hz

  /* ---- RNG có seed (mulberry32) + phân phối chuẩn ---- */
  function taoRng(seed) {
    var a = (seed >>> 0) || 1;
    function rand() {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    var du = null;
    function normal() {
      if (du !== null) { var x = du; du = null; return x; }
      var u = 0, v = 0;
      while (u === 0) u = rand();
      v = rand();
      var r = Math.sqrt(-2 * Math.log(u));
      du = r * Math.sin(2 * Math.PI * v);
      return r * Math.cos(2 * Math.PI * v);
    }
    return {
      rand: rand,
      uniform: function (a, b) { return a + (b - a) * rand(); },
      standardNormal: function (n) { var o = new Float64Array(n); for (var i = 0; i < n; i++) o[i] = normal(); return o; }
    };
  }

  /* ---- tiện ích mảng ---- */
  function hanning(m) { // np.hanning(m)
    var o = new Float64Array(m);
    if (m === 1) { o[0] = 1; return o; }
    for (var i = 0; i < m; i++) o[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (m - 1));
    return o;
  }
  function smooth(x, win) {
    win = Math.max(1, Math.floor(win));
    var h = hanning(win + 2), k = h.slice(1, h.length - 1), s = 0, i, j;
    for (i = 0; i < k.length; i++) s += k[i];
    for (i = 0; i < k.length; i++) k[i] /= s;
    var n = x.length, m = k.length, off = Math.floor((m - 1) / 2), o = new Float64Array(n);
    for (i = 0; i < n; i++) {
      var c = i + off, acc = 0;
      for (j = 0; j < m; j++) { var idx = c - j; if (idx >= 0 && idx < n) acc += x[idx] * k[j]; }
      o[i] = acc;
    }
    return o;
  }
  function std(x) {
    var n = x.length, m = 0, i;
    for (i = 0; i < n; i++) m += x[i];
    m /= n;
    var v = 0;
    for (i = 0; i < n; i++) v += (x[i] - m) * (x[i] - m);
    return Math.sqrt(v / n);
  }
  function variability(n, amp, rng, jitter) {
    if (jitter === undefined) jitter = 0.6;
    var v = new Float64Array(n), i;
    if (amp > 0) {
      var lf = smooth(rng.standardNormal(n + 400), 4 * FS).slice(200, 200 + n);
      var lf2 = smooth(rng.standardNormal(n + 400), 10 * FS).slice(200, 200 + n);
      var s1 = std(lf), s2 = std(lf2);
      for (i = 0; i < n; i++) lf[i] = lf[i] / s1 + 0.6 * lf2[i] / s2;
      var s3 = std(lf);
      for (i = 0; i < n; i++) v[i] += lf[i] / s3 * amp / 4.2;
    }
    var j = smooth(rng.standardNormal(n), 2);
    for (i = 0; i < n; i++) v[i] += j[i] * jitter;
    return v;
  }
  function bump(t, i, t0, width) {
    var u = (t - t0) / width;
    return u < 0 || u > 1 ? 0 : 0.5 * (1 - Math.cos(2 * Math.PI * u));
  }
  function contraction(t, t0, dur) {
    var u = (t - t0) / dur;
    if (u <= 0 || u >= 1) return 0;
    return Math.pow(Math.sin(Math.PI * u), 1.6);
  }

  /* ---- Băng ghi ---- */
  function Strip(minutes, o) {
    o = o || {};
    this.minutes = minutes;
    this.speed = o.speed || 3;
    this.rng = taoRng(o.seed || 1);
    var n = minutes * 60 * FS, i;
    this.n = n;
    this.t = new Float64Array(n);
    for (i = 0; i < n; i++) this.t[i] = i / FS;
    var base = o.base === undefined ? 140 : o.base, tone = o.tone === undefined ? 12 : o.tone;
    this.fhr = new Float64Array(n).fill(base);
    this.varAmp = new Float64Array(n).fill(o["var"] === undefined ? 12 : o["var"]);
    this.ua = new Float64Array(n).fill(tone);
    var nz = smooth(this.rng.standardNormal(n), 3 * FS);
    for (i = 0; i < n; i++) this.ua[i] += nz[i] * 1.2 + 0.8 * Math.sin(2 * Math.PI * this.t[i] / 4.5);
    this.contr = [];
    this.gaps = [];
    this.fm = [];
    this.extra = new Float64Array(n);
  }
  Strip.prototype.addContraction = function (t0, dur, peak) {
    if (dur === undefined) dur = 70;
    if (peak === undefined) peak = 50;
    this.contr.push([t0, dur, peak]);
    for (var i = 0; i < this.n; i++) this.ua[i] += peak * contraction(this.t[i], t0, dur);
  };
  Strip.prototype.regularContractions = function (every, o) {
    o = o || {};
    var dur = o.dur || 70, peak = o.peak || 50, start = o.start === undefined ? 20 : o.start;
    var jitter = o.jitter === undefined ? 12 : o.jitter, pjit = o.pjit === undefined ? 8 : o.pjit;
    var t0 = start;
    while (t0 + dur < this.minutes * 60 + dur * 0.5) {
      this.addContraction(t0 + this.rng.uniform(-jitter, jitter), dur, peak + this.rng.uniform(-pjit, pjit));
      t0 += every;
    }
  };
  Strip.prototype.accel = function (t0, amp, width) {
    for (var i = 0; i < this.n; i++) this.extra[i] += (amp || 22) * bump(this.t[i], i, t0, width || 50);
  };
  Strip.prototype.early = function (depth) {
    var self = this;
    this.contr.forEach(function (c) {
      var k = (depth || 18) * (0.8 + 0.4 * c[2] / 60) / 1.2;
      for (var i = 0; i < self.n; i++) self.extra[i] -= k * contraction(self.t[i], c[0], c[1]);
    });
  };
  Strip.prototype.late = function (depth, lag, widen) {
    var self = this;
    depth = depth || 20; lag = lag === undefined ? 30 : lag; widen = widen || 1.15;
    this.contr.forEach(function (c) {
      for (var i = 0; i < self.n; i++) self.extra[i] -= depth * contraction(self.t[i], c[0] + lag, c[1] * widen);
    });
  };
  Strip.prototype.variable = function (t0, depth, o) {
    o = o || {};
    var drop = o.drop || 10, hold = o.hold || 20, rec = o.rec || 15, shoulder = o.shoulder === undefined ? 8 : o.shoulder;
    var a = t0, b = a + drop, c = b + hold, d = c + rec;
    for (var i = 0; i < this.n; i++) {
      var t = this.t[i], y = 0;
      if (shoulder) y += shoulder * bump(t, i, t0 - 18, 22) + shoulder * bump(t, i, t0 + drop + hold + rec - 4, 22);
      if (t >= a && t < b) y -= depth * 0.5 * (1 - Math.cos(Math.PI * (t - a) / drop));
      else if (t >= b && t < c) y -= depth;
      else if (t >= c && t < d) y -= depth * 0.5 * (1 + Math.cos(Math.PI * (t - c) / rec));
      this.extra[i] += y;
    }
  };
  Strip.prototype.setVar = function (a, b, amp) {
    for (var i = 0; i < this.n; i++) if (this.t[i] >= a && this.t[i] < b) this.varAmp[i] = amp;
  };
  Strip.prototype.build = function (jitter) {
    if (jitter === undefined) jitter = 0.6;
    var n = this.n, i;
    var v1 = variability(n, 4.2, this.rng, 0), s = std(v1);
    for (i = 0; i < n; i++) v1[i] /= s;
    var amp = smooth(this.varAmp, 20 * FS);
    var j = smooth(this.rng.standardNormal(n), 2);
    this.sig = new Float64Array(n);
    for (i = 0; i < n; i++) this.sig[i] = this.fhr[i] + this.extra[i] + v1[i] * amp[i] / 4.2 + j[i] * jitter;
    return this;
  };

  /* ---- 12 kiểu ca (cases.py) ---- */
  var CA = {
    c1: function (seed) { // NST có đáp ứng, 1 cm/phút, 30 phút
      var s = new Strip(30, { speed: 1, seed: seed, base: 140, "var": 14, tone: 8 });
      [[150, 25, 55], [520, 22, 45], [900, 28, 60], [1270, 20, 50], [1500, 24, 70]].forEach(function (x) { s.accel(x[0], x[1], x[2]); });
      s.fm = [148, 515, 893, 1262, 1496, 1100];
      s.addContraction(700, 50, 14);
      s.addContraction(1650, 45, 12);
      return s.build();
    },
    c2: function (seed) {
      var s = new Strip(10, { seed: seed, base: 135, "var": 12, tone: 12 });
      s.regularContractions(150, { dur: 75, peak: 60, start: 25, jitter: 6 });
      s.early(20);
      s.accel(90, 24, 50);
      return s.build();
    },
    c3: function (seed) {
      var s = new Strip(10, { seed: seed, base: 170, "var": 9, tone: 14 });
      s.regularContractions(200, { dur: 65, peak: 45, start: 40, jitter: 15 });
      return s.build();
    },
    c4: function (seed) {
      var s = new Strip(10, { seed: seed, base: 100, "var": 12, tone: 10 });
      s.regularContractions(240, { dur: 60, peak: 40, start: 60, jitter: 15 });
      s.accel(330, 24, 60);
      return s.build();
    },
    c5: function (seed) {
      var s = new Strip(10, { seed: seed, base: 140, "var": 3.2, tone: 12 });
      s.regularContractions(200, { dur: 65, peak: 45, start: 50, jitter: 12 });
      return s.build(0.45);
    },
    c6: function (seed) {
      var s = new Strip(10, { seed: seed, base: 145, "var": 11, tone: 18 });
      s.regularContractions(96, { dur: 62, peak: 55, start: 12, jitter: 5 });
      s.late(22, 32);
      return s.build();
    },
    c7: function (seed) {
      var s = new Strip(10, { seed: seed, base: 140, "var": 13, tone: 12 });
      s.regularContractions(170, { dur: 70, peak: 55, start: 30, jitter: 20 });
      var p = [[12, 45, 9, 18, 14], [28, 60, 7, 30, 18], [5, 38, 10, 14, 12], [20, 55, 8, 25, 16]];
      s.contr.slice(0, p.length).forEach(function (c, k) {
        s.variable(c[0] + p[k][0], p[k][1], { drop: p[k][2], hold: p[k][3], rec: p[k][4], shoulder: 9 });
      });
      return s.build();
    },
    c8: function (seed) {
      var s = new Strip(10, { seed: seed, base: 140, "var": 12, tone: 12 });
      s.regularContractions(180, { dur: 70, peak: 50, start: 40, jitter: 12 });
      var a = 170, b = 190, c = 400, d = 440;
      for (var i = 0; i < s.n; i++) {
        var t = s.t[i], y = 0;
        if (t >= a && t < b) y = -55 * 0.5 * (1 - Math.cos(Math.PI * (t - a) / (b - a)));
        else if (t >= b && t < c) y = -55;
        else if (t >= c && t < d) y = -55 * 0.5 * (1 + Math.cos(Math.PI * (t - c) / (d - c)));
        s.extra[i] += y;
      }
      s.setVar(185, 420, 5);
      return s.build();
    },
    c9: function (seed) {
      var s = new Strip(10, { seed: seed, base: 150, "var": 1.6, tone: 14 });
      s.regularContractions(195, { dur: 70, peak: 45, start: 30, jitter: 8 });
      s.late(16, 34, 1.25);
      return s.build(0.35);
    },
    c10: function (seed) {
      var s = new Strip(10, { seed: seed, base: 90, "var": 1.6, tone: 12 });
      for (var i = 0; i < s.n; i++) s.ua[i] += 18 * Math.min(1, Math.max(0, (s.t[i] - 60) / 120));
      s.regularContractions(80, { dur: 50, peak: 20, start: 15, jitter: 18, pjit: 7 });
      return s.build(0.5);
    },
    c11: function (seed) { // hình sin, 20 phút
      var s = new Strip(20, { speed: 3, seed: seed, base: 150, "var": 0, tone: 8 });
      var f = 3.5 / 60;
      for (var i = 0; i < s.n; i++) {
        var t = s.t[i];
        s.extra[i] += (8 + 1.2 * Math.sin(2 * Math.PI * t / 300)) * Math.sin(2 * Math.PI * f * t);
      }
      s.addContraction(500, 45, 12);
      return s.build(0.25);
    },
    c12: function (seed) {
      var s = new Strip(10, { seed: seed, base: 145, "var": 40, tone: 12 });
      s.regularContractions(200, { dur: 70, peak: 50, start: 40, jitter: 15 });
      s.setVar(0, 30, 14);
      return s.build();
    }
  };
  // seed của ca gốc trong cases.py
  var SEED_GOC = { c1: 11, c2: 21, c3: 31, c4: 41, c5: 51, c6: 61, c7: 71, c8: 81, c9: 91, c10: 101, c11: 111, c12: 121 };

  /* ---- Vẽ SVG (render trong ctggen.py) ---- */
  var PX_CM = 34;
  function f1(x) { return (Math.round(x * 10) / 10).toFixed(1); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function render(strip, opt) {
    opt = opt || {};
    var speed = strip.speed;
    var m0 = opt.window ? opt.window[0] : 0, m1 = opt.window ? opt.window[1] : strip.minutes;
    var T0 = m0 * 60, W = (m1 - m0) * speed * PX_CM;
    var L = 46, top = 30, H1 = (210 - 50) / 20 * PX_CM, gap = 26, H2 = 100 / 25 * PX_CM;
    var Htot = top + H1 + gap + H2 + 26, Wtot = L + W + 14;
    var o = [];
    o.push('<svg class="ctg" viewBox="0 0 ' + Math.round(Wtot) + " " + Math.round(Htot) + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(opt.title || "Băng CTG") + '">');
    o.push('<rect x="0" y="0" width="' + Math.round(Wtot) + '" height="' + Math.round(Htot) + '" fill="#fffdf8"/>');
    if (opt.header) o.push('<text x="' + L + '" y="18" class="hd">' + esc(opt.header) + "</text>");
    function yF(b) { return top + (210 - b) / 20 * PX_CM; }
    function yU(p) { return top + H1 + gap + (100 - p) / 25 * PX_CM; }
    var thin = "#f2b8ae", thick = "#d9665a";
    var stepS = speed === 3 ? 20 : 60, majorS = speed === 3 ? 60 : 600, s, x, col, w;
    for (s = 0; s <= (m1 - m0) * 60; s += stepS) {
      x = L + s / 60 * speed * PX_CM;
      if (s % majorS === 0) { col = thick; w = 1.1; } else { col = thin; w = 0.6; }
      if (speed === 1 && s % 300 === 0 && s % majorS) { col = thick; w = 0.8; }
      o.push('<line x1="' + f1(x) + '" y1="' + top + '" x2="' + f1(x) + '" y2="' + f1(top + H1) + '" stroke="' + col + '" stroke-width="' + w + '"/>');
      o.push('<line x1="' + f1(x) + '" y1="' + f1(yU(100)) + '" x2="' + f1(x) + '" y2="' + f1(yU(0)) + '" stroke="' + col + '" stroke-width="' + w + '"/>');
    }
    var b, p;
    for (b = 50; b <= 210; b += 10) {
      o.push('<line x1="' + L + '" y1="' + f1(yF(b)) + '" x2="' + f1(L + W) + '" y2="' + f1(yF(b)) + '" stroke="' + (b % 30 === 0 ? thick : thin) + '" stroke-width="' + (b % 30 === 0 ? 1.1 : 0.6) + '"/>');
    }
    for (p = 0; p <= 100; p += 10) {
      o.push('<line x1="' + L + '" y1="' + f1(yU(p)) + '" x2="' + f1(L + W) + '" y2="' + f1(yU(p)) + '" stroke="' + (p % 20 === 0 ? thick : thin) + '" stroke-width="' + (p % 20 === 0 ? 1.1 : 0.6) + '"/>');
    }
    var xs = [L - 4];
    for (var k = 1; k < 10; k++) { var xk = L + k * 10 * PX_CM; if (xk < L + W - 30) xs.push(xk - 2); }
    xs.forEach(function (lx) {
      var trai = lx < L, anchor = trai ? "end" : "middle", xx = trai ? lx : lx + 2, cls = "sc" + (trai ? "" : " mid");
      for (b = 60; b <= 210; b += 30) o.push('<text x="' + xx + '" y="' + f1(yF(b) + 3.5) + '" class="' + cls + '" text-anchor="' + anchor + '">' + b + "</text>");
      for (p = 0; p <= 100; p += 20) o.push('<text x="' + xx + '" y="' + f1(yU(p) + 3.5) + '" class="' + cls + '" text-anchor="' + anchor + '">' + p + "</text>");
    });
    o.push('<text x="4" y="' + (top + 10) + '" class="un">nhịp/ph</text>');
    o.push('<text x="4" y="' + f1(yU(100) + 10) + '" class="un">mmHg</text>');
    if (opt.times) {
      var stepm = speed === 3 ? 5 : 10;
      for (var mm = 0; mm < m1 - m0; mm += stepm) {
        x = L + mm * speed * PX_CM;
        var tm = opt.times[0] * 60 + opt.times[1] + m0 + mm;
        o.push('<text x="' + f1(x + 3) + '" y="' + f1(top + H1 + 17) + '" class="tm">' + pad(Math.floor(tm / 60) % 24) + ":" + pad(tm % 60) + "</text>");
      }
    }
    var step = speed === 3 ? 1 : 2, i, seg = [], paths = [];
    function trongKhoang(t) { return strip.gaps.some(function (g) { return g[0] <= t && t < g[1]; }); }
    function X(t) { return L + (t - T0) / 60 * speed * PX_CM; }
    for (i = 0; i < strip.n; i += step) {
      var t = strip.t[i];
      if (t < T0 || t > m1 * 60) continue;
      if (trongKhoang(t)) { if (seg.length) { paths.push(seg); seg = []; } continue; }
      seg.push(f1(X(t)) + "," + f1(yF(Math.min(210, Math.max(50, strip.sig[i])))));
    }
    if (seg.length) paths.push(seg);
    paths.forEach(function (sg) {
      o.push('<polyline fill="none" stroke="#1b1b3a" stroke-width="1.1" stroke-linejoin="round" points="' + sg.join(" ") + '"/>');
    });
    var pts = [];
    for (i = 0; i < strip.n; i += step) {
      if (strip.t[i] < T0 || strip.t[i] > m1 * 60) continue;
      pts.push(f1(X(strip.t[i])) + "," + f1(yU(Math.min(100, Math.max(0, strip.ua[i])))));
    }
    o.push('<polyline fill="none" stroke="#1b1b3a" stroke-width="1.1" points="' + pts.join(" ") + '"/>');
    strip.fm.forEach(function (fm) {
      if (fm >= T0 && fm <= m1 * 60) o.push('<rect x="' + f1(X(fm) - 1.5) + '" y="' + f1(top + H1 + 3) + '" width="3" height="8" fill="#1b1b3a"/>');
    });
    (opt.notes || []).forEach(function (n) {
      if (n[0] < T0 || n[0] > m1 * 60) return;
      x = X(n[0]);
      o.push('<line x1="' + f1(x) + '" y1="' + f1(top + H1) + '" x2="' + f1(x) + '" y2="' + f1(top + H1 + gap) + '" stroke="#1b5fa8" stroke-width="2"/>');
      o.push('<text x="' + f1(x + 4) + '" y="' + f1(top + H1 + gap - 6) + '" class="nt">' + esc(n[1]) + "</text>");
    });
    o.push('<text x="' + f1(L + W) + '" y="' + Math.round(Htot - 8) + '" class="sp" text-anchor="end">Tốc độ giấy ' + speed + " cm/phút · ô dọc mảnh = " +
      (speed === 3 ? "20 giây" : "1 phút") + ", vạch đậm = " + (speed === 3 ? "1 phút" : "10 phút (vạch vừa = 5 phút)") + " · FHR 20 nhịp/cm · cơn co 25 mmHg/cm</text>");
    o.push("</svg>");
    return o.join("");
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function sinh(gen, seed) { return CA[gen](seed === undefined ? SEED_GOC[gen] : seed); }

  return { taoRng: taoRng, smooth: smooth, Strip: Strip, CA: CA, SEED_GOC: SEED_GOC, sinh: sinh, render: render };
});

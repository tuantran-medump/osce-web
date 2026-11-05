"""Sinh băng CTG mô phỏng dạng SVG (giấy kẻ ô, FHR + cơn co)."""
import numpy as np

FS = 4  # Hz


def smooth(x, win):
    win = max(1, int(win))
    k = np.hanning(win + 2)[1:-1]
    k /= k.sum()
    return np.convolve(x, k, mode="same")


def variability(n, amp, rng, jitter=0.6):
    """amp = biên độ đỉnh-đáy mong muốn (bpm)."""
    v = np.zeros(n)
    if amp > 0:
        w = rng.standard_normal(n + 400)
        lf = smooth(w, 4 * FS)[200:-200]          # dao động chu kì vài giây
        lf2 = smooth(rng.standard_normal(n + 400), 10 * FS)[200:-200]
        lf = lf / lf.std() + 0.6 * lf2 / lf2.std()
        lf /= lf.std()
        v += lf * amp / 4.2
    v += smooth(rng.standard_normal(n), 2) * jitter
    return v


def bump(t, t0, width):
    """raised cosine 0..1 trong [t0, t0+width]."""
    u = (t - t0) / width
    y = 0.5 * (1 - np.cos(2 * np.pi * u))
    y[(u < 0) | (u > 1)] = 0
    return y


def contraction_shape(t, t0, dur):
    u = (t - t0) / dur
    y = np.sin(np.pi * np.clip(u, 0, 1)) ** 1.6
    y[(u <= 0) | (u >= 1)] = 0
    return y


def variable_decel(t, t0, depth, drop=10, hold=20, rec=15, shoulder=8):
    """giảm đột ngột: vai tăng – rơi nhanh – đáy – hồi phục – vai tăng."""
    y = np.zeros_like(t)
    if shoulder:
        y += shoulder * bump(t, t0 - 18, 22)
        y += shoulder * bump(t, t0 + drop + hold + rec - 4, 22)
    a = t0
    b = a + drop
    c = b + hold
    d = c + rec
    m = (t >= a) & (t < b)
    y[m] -= depth * 0.5 * (1 - np.cos(np.pi * (t[m] - a) / drop))
    m = (t >= b) & (t < c)
    y[m] -= depth
    m = (t >= c) & (t < d)
    y[m] -= depth * 0.5 * (1 + np.cos(np.pi * (t[m] - c) / rec))
    return y


class Strip:
    def __init__(self, minutes, speed=3, seed=1, base=140, var=12, tone=12):
        self.minutes = minutes
        self.speed = speed  # cm/phút
        self.t = np.arange(0, minutes * 60, 1 / FS)
        self.rng = np.random.default_rng(seed)
        n = len(self.t)
        self.fhr = np.full(n, float(base))
        self.var_amp = np.full(n, float(var))
        self.ua = np.full(n, float(tone))
        self.ua += smooth(self.rng.standard_normal(n), 3 * FS) * 1.2
        # nhịp thở mẹ
        self.ua += 0.8 * np.sin(2 * np.pi * self.t / 4.5)
        self.contr = []
        self.gaps = []
        self.extra = np.zeros(n)

    def add_contraction(self, t0, dur=70, peak=50):
        self.contr.append((t0, dur, peak))
        self.ua += peak * contraction_shape(self.t, t0, dur)

    def regular_contractions(self, every, dur=70, peak=50, start=20, jitter=12, pjit=8):
        t0 = start
        while t0 + dur < self.minutes * 60 + dur * 0.5:
            self.add_contraction(t0 + self.rng.uniform(-jitter, jitter), dur,
                                 peak + self.rng.uniform(-pjit, pjit))
            t0 += every

    def accel(self, t0, amp=22, width=50):
        self.extra += amp * bump(self.t, t0, width)

    def early(self, depth=18):
        for t0, dur, pk in self.contr:
            self.extra -= depth * (0.8 + 0.4 * pk / 60) / 1.2 * contraction_shape(self.t, t0, dur)

    def late(self, depth=20, lag=30, widen=1.15):
        for t0, dur, pk in self.contr:
            self.extra -= depth * contraction_shape(self.t, t0 + lag, dur * widen)

    def variable(self, t0, depth, **kw):
        self.extra += variable_decel(self.t, t0, depth, **kw)

    def set_var(self, a, b, amp):
        m = (self.t >= a) & (self.t < b)
        self.var_amp[m] = amp

    def build(self, jitter=0.6):
        n = len(self.t)
        v1 = variability(n, 1.0 * 4.2, self.rng, jitter=0)  # chuẩn hóa std ~1
        v1 /= v1.std()
        amp = smooth(self.var_amp, 20 * FS)
        v = v1 * amp / 4.2
        v += smooth(self.rng.standard_normal(n), 2) * jitter
        self.sig = self.fhr + self.extra + v
        self.uas = self.ua
        return self


# ---------------- vẽ SVG ----------------
PX_CM = 34


def render(strip, title="", header="", times=None, notes=(), window=None):
    """notes: list (giây, chữ) ghi chú trên băng (vd tiêm thuốc)."""
    speed = strip.speed
    m0, m1 = window if window else (0, strip.minutes)
    T0 = m0 * 60
    W_cm = (m1 - m0) * speed
    W = W_cm * PX_CM
    bpm_cm = 20  # 20 nhịp/cm  (thang 50–210 = 8 cm)
    mm_cm = 25   # 25 mmHg/cm  (thang 0–100 = 4 cm)
    L = 46  # lề trái
    top = 30
    H1 = (210 - 50) / bpm_cm * PX_CM
    gap = 26
    H2 = 100 / mm_cm * PX_CM
    Htot = top + H1 + gap + H2 + 26
    Wtot = L + W + 14
    o = []
    o.append(f'<svg class="ctg" viewBox="0 0 {Wtot:.0f} {Htot:.0f}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{title}">')
    o.append(f'<rect x="0" y="0" width="{Wtot:.0f}" height="{Htot:.0f}" fill="#fffdf8"/>')
    o.append(f'<text x="{L}" y="18" class="hd">{header}</text>')

    def yF(b):
        return top + (210 - b) / bpm_cm * PX_CM

    def yU(p):
        return top + H1 + gap + (100 - p) / mm_cm * PX_CM

    thin, thick = "#f2b8ae", "#d9665a"
    # vạch dọc
    if speed == 3:
        step_s, major_s = 20, 60
    else:
        step_s, major_s = 60, 600
    for s in range(0, (m1 - m0) * 60 + 1, step_s):
        x = L + s / 60 * speed * PX_CM
        col, w = (thick, 1.1) if s % major_s == 0 else (thin, 0.6)
        if speed == 1 and s % 300 == 0 and s % major_s:
            col, w = thick, 0.8
        o.append(f'<line x1="{x:.1f}" y1="{top}" x2="{x:.1f}" y2="{top+H1:.1f}" stroke="{col}" stroke-width="{w}"/>')
        o.append(f'<line x1="{x:.1f}" y1="{yU(100):.1f}" x2="{x:.1f}" y2="{yU(0):.1f}" stroke="{col}" stroke-width="{w}"/>')
    # vạch ngang FHR
    for b in range(50, 211, 10):
        col, w = (thick, 1.1) if b % 30 == 0 else (thin, 0.6)
        o.append(f'<line x1="{L}" y1="{yF(b):.1f}" x2="{L+W:.1f}" y2="{yF(b):.1f}" stroke="{col}" stroke-width="{w}"/>')
    for p in range(0, 101, 10):
        col, w = (thick, 1.1) if p % 20 == 0 else (thin, 0.6)
        o.append(f'<line x1="{L}" y1="{yU(p):.1f}" x2="{L+W:.1f}" y2="{yU(p):.1f}" stroke="{col}" stroke-width="{w}"/>')
    # nhãn thang
    label_xs = [L - 4]
    for k in range(1, 10):
        xk = L + k * 10 * PX_CM
        if xk < L + W - 30:
            label_xs.append(xk - 2)
    for lx in label_xs:
        anchor = "end" if lx < L else "middle"
        lx = lx if lx < L else lx + 2
        for b in range(60, 211, 30):
            o.append(f'<text x="{lx}" y="{yF(b)+3.5:.1f}" class="sc{"" if lx < L else " mid"}" text-anchor="{anchor}">{b}</text>')
        for p in range(0, 101, 20):
            o.append(f'<text x="{lx}" y="{yU(p)+3.5:.1f}" class="sc{"" if lx < L else " mid"}" text-anchor="{anchor}">{p}</text>')
    o.append(f'<text x="4" y="{top+10}" class="un">nhịp/ph</text>')
    o.append(f'<text x="4" y="{yU(100)+10:.1f}" class="un">mmHg</text>')
    # giờ
    if times:
        h, m = times
        stepm = 5 if speed == 3 else 10
        for mm in range(0, m1 - m0, stepm):
            x = L + mm * speed * PX_CM
            tm = h * 60 + m + m0 + mm
            o.append(f'<text x="{x+3:.1f}" y="{top+H1+17:.1f}" class="tm">{tm//60:02d}:{tm%60:02d}</text>')
    # đường FHR
    sel = (strip.t >= T0) & (strip.t <= m1 * 60)
    t = strip.t[sel]
    xs = L + (t - T0) / 60 * speed * PX_CM
    fhr = np.clip(strip.sig[sel], 50, 210)
    step = 1 if speed == 3 else 2
    pts = []
    gaps = strip.gaps
    def ingap(tt):
        return any(a <= tt < b for a, b in gaps)
    seg = []
    paths = []
    for i in range(0, len(t), step):
        if ingap(t[i]):
            if seg:
                paths.append(seg); seg = []
            continue
        seg.append(f"{xs[i]:.1f},{yF(fhr[i]):.1f}")
    if seg:
        paths.append(seg)
    for sgm in paths:
        o.append(f'<polyline fill="none" stroke="#1b1b3a" stroke-width="1.1" stroke-linejoin="round" points="{" ".join(sgm)}"/>')
    ua = np.clip(strip.uas[sel], 0, 100)
    pts = " ".join(f"{xs[i]:.1f},{yU(ua[i]):.1f}" for i in range(0, len(t), step))
    o.append(f'<polyline fill="none" stroke="#1b1b3a" stroke-width="1.1" points="{pts}"/>')
    for fm in getattr(strip, "fm", []):
        if T0 <= fm <= m1 * 60:
            x = L + (fm - T0) / 60 * speed * PX_CM
            o.append(f'<rect x="{x-1.5:.1f}" y="{top+H1+3:.1f}" width="3" height="8" fill="#1b1b3a"/>')
    for s, txt in notes:
        if not (T0 <= s <= m1 * 60):
            continue
        x = L + (s - T0) / 60 * speed * PX_CM
        o.append(f'<line x1="{x:.1f}" y1="{top+H1:.1f}" x2="{x:.1f}" y2="{top+H1+gap:.1f}" stroke="#1b5fa8" stroke-width="2"/>')
        o.append(f'<text x="{x+4:.1f}" y="{top+H1+gap-6:.1f}" class="nt">{txt}</text>')
    o.append(f'<text x="{L+W:.1f}" y="{Htot-8:.0f}" class="sp" text-anchor="end">Tốc độ giấy {speed} cm/phút · ô dọc mảnh = {"20 giây" if speed==3 else "1 phút"}, vạch đậm = {"1 phút" if speed==3 else "10 phút (vạch vừa = 5 phút)"} · FHR 20 nhịp/cm · cơn co 25 mmHg/cm</text>')
    o.append('</svg>')
    return "\n".join(o)

import numpy as np
from ctggen import Strip, render, contraction_shape, bump


def c1():  # NST có đáp ứng, 1 cm/phút 30 phút
    s = Strip(30, speed=1, seed=11, base=140, var=14, tone=8)
    for t0, a, w in [(150, 25, 55), (520, 22, 45), (900, 28, 60), (1270, 20, 50), (1500, 24, 70)]:
        s.accel(t0, a, w)
    s.fm = [148, 515, 893, 1262, 1496, 1100]
    s.add_contraction(700, 50, 14)
    s.add_contraction(1650, 45, 12)
    return s.build()


def c2():  # nhịp giảm sớm, 4 cơn/10'
    s = Strip(10, seed=21, base=135, var=12, tone=12)
    s.regular_contractions(150, dur=75, peak=60, start=25, jitter=6)
    s.early(depth=20)
    s.accel(90, 24, 50)
    return s.build()


def c3():  # nhịp nhanh, sốt
    s = Strip(10, seed=31, base=170, var=9, tone=14)
    s.regular_contractions(200, dur=65, peak=45, start=40, jitter=15)
    return s.build()


def c4():  # chậm đơn độc, dao động trung bình
    s = Strip(10, seed=41, base=100, var=12, tone=10)
    s.regular_contractions(240, dur=60, peak=40, start=60, jitter=15)
    s.accel(330, 24, 60)
    return s.build()


def c5():  # dao động tối thiểu sau pethidine
    s = Strip(10, seed=51, base=140, var=3.2, tone=12)
    s.regular_contractions(200, dur=65, peak=45, start=50, jitter=12)
    return s.build(jitter=0.45)


def c6():  # tachysystole + giảm muộn lặp lại, dao động trung bình
    s = Strip(10, seed=61, base=145, var=11, tone=18)
    s.regular_contractions(96, dur=62, peak=55, start=12, jitter=5)
    s.late(depth=22, lag=32)
    return s.build()


def c7():  # bất định lặp lại, có vai, dao động TB
    s = Strip(10, seed=71, base=140, var=13, tone=12)
    s.regular_contractions(170, dur=70, peak=55, start=30, jitter=20)
    params = [(12, 45, 9, 18, 14), (28, 60, 7, 30, 18), (5, 38, 10, 14, 12), (20, 55, 8, 25, 16)]
    for (t0, dur, pk), (off, d, dr, hd, rc) in zip(s.contr, params):
        s.variable(t0 + off, d, drop=dr, hold=hd, rec=rc, shoulder=9)
    return s.build()


def c8():  # nhịp giảm kéo dài sau tê NMC, tụt HA
    s = Strip(10, seed=81, base=140, var=12, tone=12)
    s.regular_contractions(180, dur=70, peak=50, start=40, jitter=12)
    t = s.t
    a, b, c, d = 170, 190, 400, 440  # rơi 20s, đáy ~3.5', hồi phục 40s
    y = np.zeros_like(t)
    m = (t >= a) & (t < b); y[m] = -55 * 0.5 * (1 - np.cos(np.pi * (t[m] - a) / (b - a)))
    m = (t >= b) & (t < c); y[m] = -55
    m = (t >= c) & (t < d); y[m] = -55 * 0.5 * (1 + np.cos(np.pi * (t[m] - c) / (d - c)))
    s.extra += y
    s.set_var(185, 420, 5)
    return s.build()


def c9():  # loại III: mất dao động + giảm muộn lặp lại
    s = Strip(10, seed=91, base=150, var=1.6, tone=14)
    s.regular_contractions(195, dur=70, peak=45, start=30, jitter=8)
    s.late(depth=16, lag=34, widen=1.25)
    return s.build(jitter=0.35)


def c10():  # nhau bong non: TLCB cao, cơn co nhỏ dày, nhịp chậm, mất dao động
    s = Strip(10, seed=101, base=90, var=1.6, tone=12)
    t = s.t
    s.ua += 18 * np.clip((t - 60) / 120, 0, 1)  # trương lực tăng dần
    s.regular_contractions(80, dur=50, peak=20, start=15, jitter=18, pjit=7)
    return s.build(jitter=0.5)


def c11():  # hình sin, 1 cm/phút 30 phút
    s = Strip(20, speed=3, seed=111, base=150, var=0, tone=8)
    t = s.t
    f = 3.5 / 60
    s.extra += (8 + 1.2 * np.sin(2 * np.pi * t / 300)) * np.sin(2 * np.pi * f * t)
    s.add_contraction(500, 45, 12)
    return s.build(jitter=0.25)


def c12():  # dao động tăng (marked), ĐTĐ kiểm soát kém
    s = Strip(10, seed=121, base=145, var=40, tone=12)
    s.regular_contractions(200, dur=70, peak=50, start=40, jitter=15)
    s.set_var(0, 30, 14)
    return s.build()


CASES = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12]

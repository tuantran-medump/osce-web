import json, math, numpy as np
sh=json.load(open('shino.json'))
Z97,Z90=1.8808,1.2816
def shino(k):
    d=sh[k]; lo=max(d[p]['range'][0] for p in d); hi=min(d[p]['range'][1] for p in d)
    ga=np.arange(math.ceil(lo*10)/10, hi+1e-9, 0.1)
    v={p:np.polyval(d[p]['coef'],ga) for p in ('p3','p50','p97')}
    v['p10']=v['p50']-(v['p50']-v['p3'])*Z90/Z97
    v['p90']=v['p50']+(v['p97']-v['p50'])*Z90/Z97
    return ga,v
def hadlock():
    ga=np.arange(14,40.0001,0.1)
    m=np.exp(0.578+0.332*ga-0.00354*ga**2)
    return ga,{'p3':m*0.7486,'p10':m*0.83,'p50':m,'p90':m*1.17,'p97':m*1.2514}
charts=[
 dict(key='BPD',title='Đường kính lưỡng đỉnh (BPD)',unit='mm',x=(16,42),y=(20,110),ymaj=10,ymin=2,src='shino',short='ĐƯỜNG KÍNH LƯỠNG ĐỈNH (BPD)'),
 dict(key='AC',title='Chu vi vòng bụng (AC)',unit='cm',x=(16,42),y=(5,40),ymaj=5,ymin=1,src='shino',short='CHU VI VÒNG BỤNG (AC)'),
 dict(key='FL',title='Chiều dài xương đùi (FL)',unit='mm',x=(16,42),y=(10,80),ymaj=10,ymin=2,src='shino',short='CHIỀU DÀI XƯƠNG ĐÙI (FL)'),
 dict(key='EFW',title='Trọng lượng thai ước tính (EFW, công thức Shinozuka)',unit='g',x=(16,42),y=(0,4500),ymaj=500,ymin=100,src='shino',short='CÂN NẶNG THAI ƯỚC TÍNH (EFW)'),
 dict(key='HAD',title='Trọng lượng thai ước tính (EFW, công thức Hadlock)',unit='g',x=(14,42),y=(0,5000),ymaj=500,ymin=100,src='hadlock',short='CÂN NẶNG THAI ƯỚC TÍNH (EFW)'),
]
COL={'p3':'#c0392b','p97':'#c0392b','p10':'#d68910','p90':'#d68910','p50':'#1e8449'}
def build(c):
    W,H=287,200  # mm landscape
    s=[]; ink='#1a1a1a'
    def t(x,y,txt,sz=3,a='start',w='normal',fill=ink,it=False):
        s.append(f'<text x="{x:.2f}" y="{y:.2f}" font-size="{sz}" text-anchor="{a}" font-weight="{w}" fill="{fill}"{" font-style=\"italic\"" if it else ""}>{txt}</text>')
    def ln(x1,y1,x2,y2,col='#bbb',sw=0.15,dash=None):
        s.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{col}" stroke-width="{sw}"{f" stroke-dasharray=\"{dash}\"" if dash else ""}/>')
    t(0,5,'BIỂU ĐỒ TĂNG TRƯỞNG – '+c['short'],4.6,w='bold')
    srcname='Shinozuka (Tokyo 1994)' if c['src']=='shino' else 'Hadlock 1991'
    t(W,5,'Chuẩn: '+srcname,3.2,'end',w='bold',fill='#2b4c7e')
    y=12
    for lab,a,b in [('Họ tên',0,95),('PARA',98,135),('Kinh chót',138,185),('Tuổi thai định theo',188,W)]:
        t(a,y,lab+':',3,w='bold'); ln(a+len(lab)*1.65+2.5,y+0.7,b-2,y+0.7,'#666',0.2,'0.6 0.6')
    # khung đồ thị
    PX,PY,PW,PH=16,20,190,165
    x0,x1=c['x']; y0,y1=c['y']
    X=lambda g:PX+(g-x0)/(x1-x0)*PW; Y=lambda v:PY+PH-(v-y0)/(y1-y0)*PH
    # lưới phụ theo ngày? dùng tuần
    v=y0
    yminor=c['ymin']
    n=int(round((y1-y0)/yminor))
    for i in range(n+1):
        val=y0+i*yminor; maj=abs((val-y0)%c['ymaj'])<1e-6 or abs((val-y0)%c['ymaj']-c['ymaj'])<1e-6
        ln(PX,Y(val),PX+PW,Y(val),'#777' if maj else '#cfcfcf',0.3 if maj else 0.15)
        if maj: t(PX-1.2,Y(val)+1.1,f'{val:g}',3,'end')
    for g in range(x0,x1+1):
        maj=g%2==0
        ln(X(g),PY,X(g),PY+PH,'#777' if maj else '#cfcfcf',0.3 if maj else 0.15)
        if maj: t(X(g),PY+PH+4.2,str(g),3,'middle')
    s.append(f'<rect x="{PX}" y="{PY}" width="{PW}" height="{PH}" fill="none" stroke="{ink}" stroke-width="0.45"/>')
    t(PX+PW/2,PY+PH+9,'Tuổi thai (tuần)',3.2,'middle',w='bold')
    t(PX+2,PY+5,f"{c['key'] if c['key']!='HAD' else 'EFW'} ({c['unit']})",3.4,w='bold')
    s.append(f'<text x="{PX-11:.2f}" y="{PY+PH/2:.2f}" font-size="3.2" font-weight="bold" text-anchor="middle" transform="rotate(-90 {PX-11:.2f} {PY+PH/2:.2f})">{c["title"].split(" (")[0]} ({c["unit"]})</text>')
    ga,vals=shino(c['key']) if c['src']=='shino' else hadlock()
    for p in ('p3','p10','p50','p90','p97'):
        pts=' '.join(f'{X(g):.2f},{Y(val):.2f}' for g,val in zip(ga,vals[p]) if y0<=val<=y1 and g<=x1)
        sw=0.75 if p=='p50' else 0.55
        dash=' stroke-dasharray="2.2 1.2"' if p in ('p10','p90') else ''
        s.append(f'<polyline points="{pts}" fill="none" stroke="{COL[p]}" stroke-width="{sw}"{dash} stroke-linecap="round"/>')
        m=ga<=x1; gx,gv=ga[m][-1],vals[p][m][-1]
        t(X(gx)+1,Y(gv)+1.1,p[1:],2.8,'start',w='bold',fill=COL[p])
    # bảng bên phải
    TX=PX+PW+10; TW=W-TX
    t(TX,PY+1,'Ghi kết quả siêu âm',3.4,w='bold')
    cols=[('Ngày SA',0.30),('Tuổi thai',0.24),(c['key'] if c['key']!='HAD' else 'EFW',0.22),('BPV',0.24)]
    ty=PY+4; rh=9.2
    s.append(f'<rect x="{TX}" y="{ty}" width="{TW}" height="{rh*9}" fill="none" stroke="{ink}" stroke-width="0.35"/>')
    cx=TX
    for name,fr in cols:
        t(cx+fr*TW/2,ty+6,name,2.8,'middle',w='bold'); cx+=fr*TW
        if cx<TX+TW-0.1: ln(cx,ty,cx,ty+rh*9,'#555',0.25)
    for i in range(1,9): ln(TX,ty+i*rh,TX+TW,ty+i*rh,'#555' if i==1 else '#999',0.3 if i==1 else 0.2)
    ly=ty+rh*9+7
    t(TX,ly,'Chú thích đường bách phân vị (BPV)',3,w='bold'); ly+=5
    for p,lab in (('p97','BPV 97'),('p90','BPV 90'),('p50','BPV 50'),('p10','BPV 10'),('p3','BPV 3')):
        dash=' stroke-dasharray="2.2 1.2"' if p in ('p10','p90') else ''
        s.append(f'<line x1="{TX}" y1="{ly-1}" x2="{TX+10}" y2="{ly-1}" stroke="{COL[p]}" stroke-width="{0.75 if p=="p50" else 0.55}"{dash}/>')
        t(TX+12,ly,lab,2.9); ly+=4.6
    ly+=1.5
    if c['src']=='shino':
        notes=['BPV 3, 50, 97: số hóa từ biểu đồ','Shinozuka trong Chương 3.','BPV 10, 90: nội suy theo phân phối','chuẩn (z = 1,28) – gần đúng.']
        if c['key']=='EFW': notes+=['Chỉ điền EFW tính bằng công thức','Shinozuka (không dùng EFW máy).']
    else:
        notes=['ln(EFW) = 0,578 + 0,332·TT − 0,00354·TT²','BPV 10/90 = ±17 %; BPV 3/97 ≈ ±25 %.','Chỉ điền EFW máy tính theo Hadlock.','Chuẩn Hadlock lớn hơn thai Việt Nam','→ dễ chẩn đoán quá tay FGR (Ch.3).']
    for n_ in notes: t(TX,ly,n_,2.55,fill='#444'); ly+=3.6
    ft=('Nguồn: Shinozuka N, Nakamura T, Hirayama M. Acta Neonatologica Japonica 1994;30(3):433-441 (hình 1–2, Chương 3 – Lượng giá sức khoẻ thai).' if c['src']=='shino'
        else 'Nguồn: Hadlock FP, Harrist RB, Martinez-Poyer J. In utero analysis of fetal growth: a sonographic weight standard. Radiology 1991;181:129-133.')
    t(0,H-0.5,ft,2.4,fill='#666',it=True)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 {W+10} {H+10}" width="297mm" height="210mm" font-family="DejaVu Sans, sans-serif">'+''.join(s)+'</svg>'
pages=[build(c) for c in charts]
open('growth.html','w').write('<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Biểu đồ tăng trưởng thai</title><style>@page{size:A4 landscape;margin:0}html,body{margin:0;background:#fff}.pg{width:297mm;height:210mm;page-break-after:always;overflow:hidden}.pg:last-child{page-break-after:auto}svg{display:block}</style></head><body>'+''.join(f'<div class="pg">{p}</div>' for p in pages)+'</body></html>')
for c,p in zip(charts,pages):
    open(f'growth_{c["key"]}.html','w').write('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff}</style></head><body>'+p+'</body></html>')
# kiểm tra Hadlock
g,v=hadlock()
for w in (20,28,40): i=int(round((w-14)*10)); print(w,[round(v[p][i]) for p in ('p3','p10','p50','p90','p97')])

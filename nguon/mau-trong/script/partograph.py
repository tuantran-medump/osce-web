# Sinh sản đồ WHO trống (SVG trong HTML, A4 dọc). Đơn vị mm.
import sys
def build(modified=False):
    W,H=200,287
    L=34                      # cột nhãn trái
    GW=W-L-1                  # bề rộng lưới
    hours=12 if modified else 24
    hw=GW/hours; cw=hw/2      # 1 giờ, nửa giờ
    s=[]; y=0
    ink='#1a1a1a'; thin='#9a9a9a'; mid='#555'
    def t(x,y,txt,sz=2.6,anchor='start',w='normal',fill=ink,it=False):
        s.append(f'<text x="{x:.2f}" y="{y:.2f}" font-size="{sz}" text-anchor="{anchor}" font-weight="{w}" fill="{fill}"{" font-style=\"italic\"" if it else ""}>{txt}</text>')
    def ln(x1,y1,x2,y2,c=thin,sw=0.15,dash=None):
        s.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{c}" stroke-width="{sw}"{f" stroke-dasharray=\"{dash}\"" if dash else ""}/>')
    def rect(x,y,w,h,sw=0.35,c=ink,fill='none'):
        s.append(f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" fill="{fill}" stroke="{c}" stroke-width="{sw}"/>')
    def grid(y0,rows,rh,ncols,major_every=None):
        cwid=GW/ncols
        for i in range(1,rows): ln(L,y0+i*rh,L+GW,y0+i*rh)
        for j in range(1,ncols):
            maj = major_every and j%major_every==0
            ln(L+j*cwid,y0,L+j*cwid,y0+rows*rh,c=mid if maj else thin,sw=0.25 if maj else 0.15)
        rect(L,y0,GW,rows*rh)
    # ---------- Đầu trang
    title='SẢN ĐỒ WHO' + (' – BẢN RÚT GỌN (không pha tiềm thời, bắt đầu 4 cm)' if modified else ' (nguyên bản 1994)')
    t(W/2,4.5,title,4.2,'middle','bold')
    y=9
    f=[('Họ tên',0,72),('Tuổi',74,96),('PARA',98,130),('Số nhập viện',132,W)]
    for lab,a,b in f:
        t(a,y,lab+':',2.8,w='bold'); ln(a+len(lab)*1.55+2.5,y+0.6,b-2,y+0.6,c=mid,sw=0.2,dash='0.6 0.6')
    y+=6
    f=[('Ngày nhập viện',0,58),('Giờ nhập viện',60,110),('Ối vỡ lúc',112,160),('',0,0)]
    for lab,a,b in f[:3]:
        t(a,y,lab+':',2.8,w='bold'); ln(a+len(lab)*1.5+2.5,y+0.6,b-2,y+0.6,c=mid,sw=0.2,dash='0.6 0.6')
    t(162,y,'Thời gian vỡ ối: ……… giờ',2.8,w='bold')
    y+=4
    # ---------- Tim thai 180-100 (và 200-80 cho bản rút gọn)
    hi,lo=(200,80) if modified else (180,100)
    rows=(hi-lo)//10; rh=36/rows
    y0=y; grid(y0,rows,rh,hours*2,2)
    for i in range(rows+1):
        v=hi-10*i; t(L-1,y0+i*rh+0.9,str(v),2.3,'end')
        if v in (110,160): ln(L,y0+i*rh,L+GW,y0+i*rh,c='#2b6cb0',sw=0.3,dash='1 0.6')
    t(2,y0+rows*rh/2-1.5,'Tim thai',3,w='bold'); t(2,y0+rows*rh/2+2,'(nhịp/phút)',2.4);
    y=y0+rows*rh+1.2
    # ---------- Ối + biến dạng đầu
    rh=4.2; y0=y; grid(y0,2,rh,hours*2,2)
    t(2,y0+3.1,'Nước ối',2.7,w='bold'); t(15,y0+3.1,'(C/T/X/K)',2.1,fill=mid)
    t(2,y0+rh+3.1,'Biến dạng đầu',2.7,w='bold')
    y=y0+2*rh+2.2
    # ---------- Mở CTC + độ lọt
    ch=hw if not modified else min(hw,7.0)   # ô vuông
    ch=min(ch,6.9)
    y0=y; Hc=10*ch
    for i in range(1,10): ln(L,y0+i*ch,L+GW,y0+i*ch)
    for j in range(1,hours): ln(L+j*hw,y0,L+j*hw,y0+Hc)
    rect(L,y0,GW,Hc)
    for i in range(11):
        t(L-1.2,y0+(10-i)*ch+0.9,str(i),2.5,'end',w='bold' if i in (3,4,10) else 'normal')
    # thang độ lọt 5..0 trên vùng 0-5
    for i in range(6): t(L-6.5,y0+(10-i)*ch+0.9,str(i),2.3,'end',fill='#7a3e00')
    ln(L-9.5,y0+5*ch,L-9.5,y0+10*ch,c='#7a3e00',sw=0.3)
    ln(L-9.5,y0+5*ch,L-8.5,y0+5*ch,c='#7a3e00',sw=0.3); ln(L-9.5,y0+10*ch,L-8.5,y0+10*ch,c='#7a3e00',sw=0.3)
    t(2,y0+1.5*ch,'Cổ tử cung',3,w='bold'); t(2,y0+1.5*ch+3.3,'(cm)',2.5); t(2,y0+1.5*ch+6.6,'ghi bằng X',2.4,w='bold',fill='#c00000')
    t(1,y0+7.2*ch,'Độ lọt',2.9,w='bold',fill='#7a3e00'); t(1,y0+7.2*ch+3.2,'(5/5 → 0/5)',2.2,fill='#7a3e00'); t(1,y0+7.2*ch+6.4,'ghi bằng O',2.4,w='bold',fill='#7a3e00')
    X=lambda h:L+h*hw; Y=lambda cm:y0+(10-cm)*ch
    if not modified:
        ln(X(0),Y(3),X(8),Y(3),c=ink,sw=0.7)
        t(X(0.6),Y(3)+3.6,'Pha tiềm thời (tối đa 8 giờ)',2.6,'start',it=True)
        ln(X(8),Y(0),X(8),Y(10),c=ink,sw=0.7)
        t(X(9.2),Y(10)+3.2,'Pha hoạt động',2.8,'start',w='bold',it=True)
        a0,b0,start=8,12,3
    else:
        a0,b0,start=0,4,4
    ln(X(a0),Y(start),X(a0+10-start),Y(10),c=ink,sw=0.7)
    ln(X(b0),Y(start),X(b0+10-start),Y(10),c=ink,sw=0.7)
    import math
    ang=-math.degrees(math.atan2(ch,hw))
    for (h0,lab) in ((a0,'Đường báo động'),(b0,'Đường hành động')):
        mx=X(h0+(10-start)*0.55)-1; my=Y(start+(10-start)*0.55)-1.2
        s.append(f'<text x="{mx:.2f}" y="{my:.2f}" font-size="2.6" font-weight="bold" fill="{ink}" text-anchor="middle" transform="rotate({ang:.1f} {mx:.2f} {my:.2f})">{lab}</text>')
    y=y0+Hc
    # hàng giờ
    rh=4; rect(L,y,GW,rh,sw=0.25)
    for j in range(hours+1):
        t(X(j),y+2.9,str(j),2.2,'middle')
    t(2,y+2.9,'Giờ (từ lúc ghi)',2.5,w='bold')
    y+=rh
    rh=5; grid(y,1,rh,hours)
    t(2,y+3.5,'Giờ đồng hồ',2.7,w='bold')
    y+=rh+2.2
    # ---------- Cơn co
    rh=4.2; y0=y; grid(y0,5,rh,hours*2,2)
    for i in range(5): t(L-1,y0+(5-i)*rh-1.2,str(i+1),2.3,'end')
    t(2,y0+8,'Cơn co',3,w='bold'); t(2,y0+11.3,'trong 10 phút',2.4); 
    y=y0+5*rh+1.2
    # ---------- Oxytocin
    rh=4.2; y0=y; grid(y0,2,rh,hours*2,2)
    t(2,y0+3.1,'Oxytocin (UI/L)',2.6,w='bold'); t(2,y0+rh+3.1,'giọt/phút',2.6,w='bold')
    y=y0+2*rh+1.2
    # ---------- Thuốc + dịch truyền
    rh=17; grid(y,1,rh,hours*2,2)
    t(2,y+8,'Thuốc và',2.8,w='bold'); t(2,y+11.4,'dịch truyền',2.8,w='bold')
    y+=rh+2.2
    # ---------- Mạch, HA
    rows=12; rh=3.9; y0=y; grid(y0,rows,rh,hours*2,2)
    for i in range(rows+1): t(L-1,y0+i*rh+0.9,str(180-10*i),2.1,'end')
    t(2,y0+16,'Mạch  •',3,w='bold'); t(2,y0+21,'và',2.6); t(2,y0+26,'Huyết áp  ↕',3,w='bold')
    y=y0+rows*rh+1.2
    # ---------- Nhiệt độ
    rh=4.5; grid(y,1,rh,hours); t(2,y+3.3,'Nhiệt độ (°C)',2.7,w='bold'); y+=rh+1.2
    # ---------- Nước tiểu
    rh=4.2; y0=y; grid(y0,3,rh,hours)
    t(2,y0+rh*1.5+1,'Nước tiểu',2.8,w='bold')
    for i,lab in enumerate(['đạm','ceton','thể tích']): t(L-1,y0+i*rh+3,lab,2.3,'end')
    y=y0+3*rh+3.2
    # ---------- Chú thích
    leg=[ '<tspan font-weight="bold">Ối:</tspan> C còn · T vỡ, trong · X vỡ, có phân su · K vỡ, không còn nước ối    <tspan font-weight="bold">Biến dạng đầu:</tspan> 0 · + · ++ · +++',
          '<tspan font-weight="bold">Cơn co (tô số ô = số cơn/10 phút):</tspan> chấm = &lt;20 giây · gạch chéo = 20–40 giây · tô đen = &gt;40 giây',
          ('<tspan font-weight="bold">Nhịp ghi (WHO 1994):</tspan> tim thai, cơn co, mạch mỗi 30 phút · mở CTC (X), độ lọt (O), huyết áp mỗi 4 giờ · nhiệt độ mỗi 2 giờ' )]
    if not modified:
        leg.append('<tspan font-weight="bold">Vào pha hoạt động:</tspan> tịnh tiến điểm X lên đường báo động (giữ nguyên tung độ), các ghi chép sau đó tính từ điểm mới.')
    else:
        leg.append('<tspan font-weight="bold">Bản rút gọn:</tspan> điểm X đầu tiên ghi ngay trên đường báo động, tung độ = độ mở CTC lúc khám (≥ 4 cm).')
    for k,l in enumerate(leg): t(0,y+k*3.3,l,2.25)
    y+=len(leg)*3.3
    t(W,H-0.5,'Mẫu dựng lại theo WHO 1994 “Preventing prolonged labour: the partograph” và handout sản đồ Bộ môn Phụ Sản ĐHYD TPHCM 2020. Ô nhỏ = 30 phút.',1.9,'end',fill=mid,it=True)
    if y>H-3: print('WARN overflow',y,file=sys.stderr)
    print('used height',round(y,1),file=sys.stderr)
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 {W+10} {H+10}" width="210mm" height="297mm" font-family="Be Vietnam Pro, Noto Sans, DejaVu Sans, sans-serif">'+''.join(s)+'</svg>'
    return svg
if __name__=='__main__':
    import os
    pages=[build(False),build(True)]
    html='<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Sản đồ WHO trống</title><style>@page{size:A4;margin:0}html,body{margin:0;background:#fff}.pg{width:210mm;height:297mm;page-break-after:always;overflow:hidden}.pg:last-child{page-break-after:auto}svg{display:block}</style></head><body>'+''.join(f'<div class="pg">{p}</div>' for p in pages)+'</body></html>'
    open('sando.html','w').write(html)
    for i,p in enumerate(pages):
        open(f'sando_{i}.html','w').write('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff}</style></head><body>'+p+'</body></html>')

from PIL import Image; import numpy as np, json
cfg={
 'BPD':('1a-bpd',63,580,(20,412),(110,17.5),120),
 'AC':('1b-ac',58.5,573.8,(5,408.5),(40,19),120),
 'FL':('1c-fl',56.5,575.8,(10,412),(80,25),120),
 'EFW':('2-efw',47,353.5,(0,470),(4500,13),170),
}
out={}
for k,(f,x0,x1,(v1,p1),(v2,p2),thr) in cfg.items():
  im=np.array(Image.open('/mnt/project-files/chuong3/hinh/p04-hinh-%s-shinozuka.png'%f).convert('L')).astype(int)
  H,W=im.shape
  d=im<thr; g=im<200
  rows=[y for y in range(H) if g[y,int(x0)+5:int(x1)].mean()>0.6]
  cols=[x for x in range(W) if g[int(p2)+5:int(p1)-5,x].mean()>0.6]
  gridc=set()
  for y in rows: d[max(0,y-1):y+2,:]=False
  for x in cols:
    for xx in range(x-1,x+2): gridc.add(xx)
  def centers(x):
    if x in gridc or x>=W: return None
    ys=np.where(d[int(p2)+3:int(p1)-2,x])[0]+int(p2)+3
    if len(ys)==0: return []
    runs=np.split(ys,np.where(np.diff(ys)>1)[0]+1)
    return [r.mean() for r in runs if len(r)<=10]
  # seed: rightmost-ish column with 3 well separated
  xs=list(range(int(x0)+2,min(W-1,int(x1)+12)))
  seed=None
  for x in reversed(xs):
    c=centers(x)
    if c and len(c)==3 and min(np.diff(sorted(c)))>8: seed=x;break
  tracks=[{seed:v} for v in sorted(centers(seed),reverse=True)]  # p3 (largest y) first
  for direction in (-1,1):
    pos=[t[seed] for t in tracks]; slope=[0,0,0]; prevx=[seed]*3
    x=seed+direction
    while x0<x<min(W-1,x1+12):
      c=centers(x)
      if c is not None:
        for i in range(3):
          pred=pos[i]+slope[i]*(x-prevx[i])
          if c:
            j=min(c,key=lambda v:abs(v-pred))
            if abs(j-pred)<3+0.3*abs(x-prevx[i]) and all(abs(j-pos[m])>1.5 or m==i for m in range(3)):
              if abs(x-prevx[i])<12: slope[i]=0.7*slope[i]+0.3*(j-pos[i])/(x-prevx[i])
              tracks[i][x]=j; pos[i]=j; prevx[i]=x
      x+=direction
  res={}
  for i,nm in enumerate(['p3','p50','p97']):
    a=np.array(sorted((16+(x-x0)/(x1-x0)*26, v1+(y-p1)/(p2-p1)*(v2-v1)) for x,y in tracks[i].items()))
    c=np.polyfit(a[:,0],a[:,1],4); r=a[:,1]-np.polyval(c,a[:,0])
    res[nm]=dict(range=[float(a[0,0]),float(a[-1,0])],coef=c.tolist(),rmse=float(np.sqrt((r**2).mean())),n=len(a))
  out[k]=res
  print(k,{n:([round(v,1) for v in r['range']],r['n'],round(r['rmse'],2)) for n,r in res.items()})
  for ga in range(16,43,2):
    print(' ',ga,[round(np.polyval(res[n]['coef'],ga),1) for n in ['p3','p50','p97']])
json.dump(out,open('shino.json','w'))

const {chromium}=require('playwright');
(async()=>{
 const [,,html,pdf,...pngs]=process.argv;
 const b=await chromium.launch(); 
 const p=await b.newPage();
 await p.goto('file://'+process.cwd()+'/'+html); await p.pdf({path:pdf,preferCSSPageSize:true,printBackground:true});
 for(const spec of pngs){ const [src,out,w,h,scale]=spec.split(':');
   const q=await b.newPage({viewport:{width:+w,height:+h},deviceScaleFactor:+scale});
   await q.goto('file://'+process.cwd()+'/'+src); await q.screenshot({path:out,fullPage:true}); await q.close();}
 await b.close();})();

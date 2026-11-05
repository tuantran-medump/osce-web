#!/usr/bin/env node
/* Bộ chạy kiểm thử giao diện: bật server tĩnh (Node, không cần Python) rồi chạy lần lượt các script.
   Cách dùng:
     node tests/e2e/chay.js                 # bộ nhanh: tu-cham, nap-de, cong-cu-tuong-tac, offline, toan-trang (mẫu)
     node tests/e2e/chay.js toan-trang      # chỉ chạy các script được nêu tên
     DAY_DU=1 node tests/e2e/chay.js toan-trang   # kiểm toàn bộ 121 đề × 6 cỡ màn hình (~20 phút)
   Ảnh chụp lưu ở tests/e2e/anh/. Cần Playwright + Chromium (require('playwright') chạy được). */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const GOC = path.join(__dirname, "..", "..");
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".pdf": "application/pdf",
};
const BO_NHANH = ["tu-cham", "nap-de", "cong-cu-tuong-tac", "offline", "toan-trang"];

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const f = path.normalize(path.join(GOC, p));
  if (!f.startsWith(GOC) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "Content-Type": MIME[path.extname(f).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});

// Phải chạy script con bất đồng bộ: spawnSync chặn vòng lặp sự kiện nên server tĩnh không trả lời được.
function chayScript(f, url) {
  return new Promise((xong) => {
    const con = spawn(process.execPath, [f], { stdio: "inherit", env: { ...process.env, OSCE_URL: url } });
    con.on("close", (ma) => xong(ma));
  });
}

server.listen(0, "127.0.0.1", async () => {
  const url = `http://127.0.0.1:${server.address().port}/`;
  const ds = process.argv.slice(2).length ? process.argv.slice(2) : BO_NHANH;
  const loi = [];
  for (const ten of ds) {
    const f = path.join(__dirname, ten.replace(/\.js$/, "") + ".js");
    if (!fs.existsSync(f)) { loi.push(`${ten}: không có script`); continue; }
    console.log(`\n▶ ${ten}`);
    const ma = await chayScript(f, url);
    if (ma !== 0) loi.push(`${ten}: mã thoát ${ma}`);
  }
  server.close();
  console.log(loi.length ? `\n✗ ${loi.length} script lỗi:\n` + loi.join("\n") : `\n✓ ${ds.length} script đạt`);
  process.exit(loi.length ? 1 : 0);
});

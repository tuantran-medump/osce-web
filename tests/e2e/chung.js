// Dùng chung cho các script kiểm thử giao diện (Playwright).
"use strict";
const path = require("path");
const fs = require("fs");
const GOC = path.join(__dirname, "..", "..");
// Địa chỉ web đang chạy; chay.js tự bật server và đặt biến này.
const URL_GOC = (process.env.OSCE_URL || "http://localhost:8765/").replace(/\/?$/, "/");
// Ảnh chụp màn hình (không commit)
const ANH = path.join(__dirname, "anh") + path.sep;
fs.mkdirSync(ANH, { recursive: true });
module.exports = { GOC, URL_GOC, ANH };

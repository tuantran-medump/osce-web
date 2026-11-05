/* Service worker – sinh tự động bởi tools/build_data.js từ tools/sw-mau.js. Không sửa tay sw.js. */
"use strict";
var PHIEN_BAN = "420130e9ae04";
var BO_NHO = "osce-" + PHIEN_BAN;
var DANH_SACH = [
 "./",
 "index.html",
 "manifest.webmanifest",
 "css/style.css",
 "js/md.js",
 "js/nap.js",
 "js/ctg.js",
 "js/cong-cu.js",
 "js/app.js",
 "data/stations.js",
 "data/cong-cu.js",
 "mau-nap/MAU_NAP_DE_OSCE.md",
 "icons/icon.svg",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/icon-maskable-512.png",
 "icons/apple-touch-icon.png",
 "icons/favicon-32.png",
 "nguon/hinh/p016-1.jpg",
 "nguon/hinh/p016-2.jpg",
 "nguon/hinh/p017-1.jpg",
 "nguon/hinh/p020-1.jpg",
 "nguon/hinh/p021-1.jpg",
 "nguon/hinh/p022-1.jpg",
 "nguon/hinh/p023-1.jpg",
 "nguon/hinh/p024-1.jpg",
 "nguon/hinh/p028-1.jpg",
 "nguon/hinh/p036-1.jpg",
 "nguon/hinh/p037-1.jpg",
 "nguon/hinh/p040-1.jpg",
 "nguon/hinh/p042-1.jpg",
 "nguon/hinh/p045-1.jpg",
 "nguon/hinh/p046-1.jpg",
 "nguon/hinh/p048-1.jpg",
 "nguon/hinh/p048-2.jpg",
 "nguon/hinh/p048-3.jpg",
 "nguon/hinh/p049-1.jpg",
 "nguon/hinh/p051-1.jpg",
 "nguon/hinh/p052-1.jpg",
 "nguon/hinh/p053-1.jpg",
 "nguon/hinh/p053-2.jpg",
 "nguon/hinh/p054-1.jpg",
 "nguon/hinh/p061-1.jpg",
 "nguon/hinh/p061-2.jpg",
 "nguon/hinh/p062-1.jpg",
 "nguon/hinh/p071-1.jpg",
 "nguon/hinh/p073-1.jpg",
 "nguon/hinh/p073-2.jpg",
 "nguon/hinh/p074-1.jpg",
 "nguon/hinh/p074-2.jpg",
 "nguon/hinh/p074-3.jpg",
 "nguon/hinh/p080-1.jpg",
 "nguon/hinh/p081-1.jpg",
 "nguon/hinh/p081-2.jpg",
 "nguon/hinh/p088-1.jpg",
 "nguon/hinh/p088-2.jpg",
 "nguon/hinh/p089-1.jpg",
 "nguon/hinh/p093-1.jpg",
 "nguon/hinh/p095-1.jpg",
 "nguon/hinh/p096-1.jpg",
 "nguon/hinh/p096-2.jpg",
 "nguon/hinh/p096-3.jpg",
 "nguon/hinh/p097-1.jpg",
 "nguon/hinh/p100-1.jpg",
 "nguon/hinh/p100-2.jpg",
 "nguon/hinh/p101-1.jpg",
 "nguon/hinh/p104-1.jpg",
 "nguon/hinh/p107-1.jpg",
 "nguon/hinh/p111-1.jpg",
 "nguon/hinh/p114-1.jpg",
 "nguon/hinh/p114-2.jpg",
 "nguon/hinh/p115-1.jpg",
 "nguon/hinh/p121-1.jpg",
 "nguon/hinh/p122-1.jpg",
 "nguon/hinh/p122-2.jpg",
 "nguon/hinh/p124-1.jpg",
 "nguon/hinh/p126-1.jpg",
 "nguon/hinh/p127-1.jpg",
 "nguon/hinh/p127-2.jpg",
 "nguon/hinh/p128-1.jpg",
 "nguon/hinh/p137-1.jpg",
 "nguon/hinh/p137-2.jpg",
 "nguon/hinh/p138-1.jpg",
 "nguon/hinh/p142-1.jpg",
 "nguon/hinh/p148-1.jpg",
 "nguon/hinh/p151-1.jpg",
 "nguon/hinh/p154-1.jpg",
 "nguon/hinh/p155-1.jpg",
 "nguon/hinh/p156-1.jpg",
 "nguon/hinh/p157-1.jpg",
 "nguon/hinh/p159-1.jpg",
 "nguon/hinh/p160-1.jpg",
 "nguon/hinh/p161-1.jpg",
 "nguon/hinh/p164-1.jpg",
 "nguon/hinh/p166-1.jpg",
 "nguon/hinh/p167-1.jpg"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(BO_NHO).then(function (c) { return c.addAll(DANH_SACH); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("osce-") === 0 && k !== BO_NHO; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("message", function (e) {
  if (e.data === "cap-nhat") self.skipWaiting();
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    // mở trang: dùng index.html trong bộ nhớ (chạy offline), cập nhật nền khi có mạng
    e.respondWith(caches.match("index.html").then(function (r) {
      return r || fetch(req);
    }).catch(function () { return fetch(req); }));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (r) {
    return r || fetch(req).then(function (res) {
      if (res && res.ok && res.type === "basic") {
        var copy = res.clone();
        caches.open(BO_NHO).then(function (c) { c.put(req, copy); });
      }
      return res;
    });
  }));
});

/* Service worker – sinh tự động bởi tools/build_data.js từ tools/sw-mau.js. Không sửa tay sw.js. */
"use strict";
var PHIEN_BAN = "__PHIEN_BAN__";
var BO_NHO = "osce-" + PHIEN_BAN;
var DANH_SACH = __DANH_SACH__;

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

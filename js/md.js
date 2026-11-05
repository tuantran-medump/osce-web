/* Bộ chuyển Markdown tối giản -> HTML cho nội dung trong data/stations.js.
   Hỗ trợ: tiêu đề (#..######), danh sách lồng nhau (-, +, *, 1.), in đậm/nghiêng, ảnh, đoạn văn.
   Không sửa chữ: chỉ đổi ký hiệu định dạng thành thẻ HTML. */
(function () {
  "use strict";

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function inline(s) {
    var out = esc(s);
    // ảnh
    out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (_, alt, src) {
      return '<button type="button" class="md-img" data-src="' + src + '" aria-label="Phóng to hình">' +
        '<img src="' + src + '" alt="' + (alt || "Hình trong tài liệu") + '" loading="lazy"></button>';
    });
    // in đậm
    out = out.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
    // in nghiêng: *chữ* (không phải dấu * đầu dòng, không có khoảng trắng sát bên trong)
    // (không dùng lookbehind để chạy được trên Safari cũ)
    out = out.replace(/(^|[\s(])\*([^\s*][^*\n]*?[^\s*]|[^\s*])\*(?=[\s).,:;!?]|$)/g, "$1<em>$2</em>");
    return out;
  }

  var RE_LIST = /^(\s*)([-+*]|\d+\.)\s+(.*)$/;
  var RE_HEAD = /^(#{1,6})\s+(.*)$/;

  function render(md) {
    if (!md) return "";
    var lines = md.split("\n");
    var html = [];
    var stack = []; // {indent, type}
    var para = [];

    function flushPara() {
      if (para.length) {
        html.push("<p>" + para.map(inline).join("<br>") + "</p>");
        para = [];
      }
    }
    function closeTo(level) {
      while (stack.length > level) {
        var t = stack.pop();
        html.push("</li></" + t.type + ">");
      }
    }

    for (var i = 0; i < lines.length; i++) {
      var raw = lines[i];
      if (!raw.trim()) {
        flushPara();
        continue;
      }
      var h = raw.match(RE_HEAD);
      if (h) {
        flushPara();
        closeTo(0);
        html.push('<h4 class="md-h md-h' + h[1].length + '">' + inline(h[2]) + "</h4>");
        continue;
      }
      var m = raw.match(RE_LIST);
      if (m) {
        flushPara();
        var indent = m[1].replace(/\t/g, "    ").length;
        var type = /\d/.test(m[2]) ? "ol" : "ul";
        var text = m[3];
        // bỏ các cấp sâu hơn
        while (stack.length && stack[stack.length - 1].indent > indent) {
          var t = stack.pop();
          html.push("</li></" + t.type + ">");
        }
        var top = stack[stack.length - 1];
        if (top && top.indent === indent) {
          if (top.type !== type) {
            stack.pop();
            html.push("</li></" + top.type + ">");
            html.push(type === "ol" ? '<ol start="' + parseInt(m[2], 10) + '"><li>' : "<ul><li>");
            stack.push({ indent: indent, type: type });
          } else {
            html.push("</li><li>");
          }
        } else {
          html.push(type === "ol" ? '<ol start="' + parseInt(m[2], 10) + '"><li>' : "<ul><li>");
          stack.push({ indent: indent, type: type });
        }
        // "- - chữ" (gạch lặp) -> giữ nguyên dấu thứ hai
        html.push(inline(text));
        continue;
      }
      // dòng thường
      if (stack.length && /^\s+/.test(raw)) {
        html.push("<br>" + inline(raw.trim()));
        continue;
      }
      closeTo(0);
      para.push(raw.trim());
    }
    flushPara();
    closeTo(0);
    return html.join("");
  }

  window.MD = { render: render, inline: inline };
})();

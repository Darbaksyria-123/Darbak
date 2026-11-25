/* محمّل ذكي: بيحمّل الخريطة والخط بدون ما يعلّق التطبيق.
   كل مكتبة إلها أكتر من مصدر (نسخة محلية بمجلد vendor ← cdnjs ← jsDelivr ← unpkg)،
   ولو كلهم فشلوا بتظهر رسالة وزر إعادة محاولة بدل شاشة معلّقة. */
(function () {
  var V = '?v=31', failed = false;
  function el(t, a) { var e = document.createElement(t); for (var k in a) e[k] = a[k]; return e; }
  function showFail() {
    if (failed || window.__dkReady) return; failed = true;
    var s = document.getElementById('splash'); if (!s) return;
    s.innerHTML = '<div style="padding:28px;text-align:center;max-width:320px"><div style="font-size:40px;font-weight:800">دربك</div><p style="margin:14px 0 20px;line-height:1.7">النت ضعيف أو بعض الخدمات ما انفتحت. جرّب مرة تانية.</p><button type="button" id="dkRetry" style="background:#fff;color:#07553a;border:0;border-radius:14px;padding:12px 26px;font:700 16px inherit;cursor:pointer">أعد المحاولة</button></div>';
    var b = document.getElementById('dkRetry'); if (b) b.onclick = function () { location.reload(); };
  }
  /* جرّب مصدر ورا مصدر؛ ok() بتتأكد إنو المكتبة فعلاً اشتغلت */
  function loadJS(urls, ok, cb) {
    var i = 0;
    (function next() {
      if (i >= urls.length) return cb(false);
      var u = urls[i++], fin = false, s = el('script', { src: u, async: false });
      function end(good) { if (fin) return; fin = true; clearTimeout(to); if (good && ok()) cb(true); else { try { s.remove(); } catch (e) {} next(); } }
      var to = setTimeout(function () { end(false); }, 7000);
      s.onload = function () { end(true); }; s.onerror = function () { end(false); };
      document.head.appendChild(s);
    })();
  }
  function loadCSS(urls, nonblock) {
    var i = 0;
    (function next() {
      if (i >= urls.length) return;
      var l = el('link', { rel: 'stylesheet', href: urls[i++] });
      if (nonblock) { l.media = 'print'; l.onload = function () { l.media = 'all'; }; }
      l.onerror = function () { try { l.remove(); } catch (e) {} next(); };
      document.head.appendChild(l);
    })();
  }
  var CDN = ['https://cdnjs.cloudflare.com/ajax/libs/', 'https://cdn.jsdelivr.net/npm/', 'https://unpkg.com/'];
  /* الخط: بدون تعطيل الصفحة (لو ما وصل بيشتغل خط الجهاز) */
  loadCSS(['https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap'], true);
  loadCSS(['vendor/leaflet.css', CDN[0] + 'leaflet/1.9.4/leaflet.min.css', 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css']);
  loadCSS(['vendor/MarkerCluster.css', CDN[0] + 'leaflet.markercluster/1.5.3/MarkerCluster.css', 'https://cdn.jsdelivr.net/npm/leaflet.markercluster@1.5.3/dist/MarkerCluster.css']);
  loadCSS(['vendor/MarkerCluster.Default.css', CDN[0] + 'leaflet.markercluster/1.5.3/MarkerCluster.Default.css', 'https://cdn.jsdelivr.net/npm/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css']);

  var wd = setTimeout(showFail, 14000);   /* لو التطبيق ما اشتغل خلال 14 ثانية */
  loadJS(['vendor/leaflet.js', CDN[0] + 'leaflet/1.9.4/leaflet.min.js', 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'],
    function () { return !!(window.L && L.map); },
    function (a) {
      if (!a) return showFail();
      loadJS(['vendor/markercluster.js', CDN[0] + 'leaflet.markercluster/1.5.3/leaflet.markercluster.js', 'https://cdn.jsdelivr.net/npm/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js', 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'],
        function () { return !!(window.L && L.markerClusterGroup); },
        function (b) {
          if (!b) return showFail();
          loadJS(['icons3d.js' + V], function () { return true; }, function () {
            loadJS(['app.js' + V], function () { return true; }, function (c) { if (!c) showFail(); else clearTimeout(wd); });
          });
        });
    });
})();

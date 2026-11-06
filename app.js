(function () {
  /* ===== إعداد الخادم: بيتعدّل من ملف config.js. إذا فاضي، التطبيق بيشتغل بوضع تجريبي على الجهاز فقط ===== */
  var CFG = window.DARBAK_CONFIG || { url: '', key: '' };
  var remote = !!(CFG.url && CFG.key && /^https:\/\//.test(CFG.url));

  /* ===== اللغة: عربي (افتراضي) / English. الترجمة بتتطبّق على الشاشة تلقائياً من ملف lang-en.js ===== */
  var LANG = 'ar', DICT = window.DARBAK_EN || null;
  try { if (localStorage.getItem('darbak.lang') === 'en' && DICT) LANG = 'en'; } catch (e) {}
  var AR_RE = /[\u0600-\u06FF]/;
  var RXT = [
    [/^منذ (\d+) (?:دقايق|دقيقة)$/, '$1 min ago'], [/^منذ (\d+) (?:ساعات|ساعة)$/, '$1 h ago'], [/^منذ ساعة$/, '1 h ago'], [/^منذ ساعتين$/, '2 h ago'],
    [/^منذ يوم$/, '1 day ago'], [/^منذ يومين$/, '2 days ago'], [/^منذ (\d+) أيام$/, '$1 days ago'],
    [/^ينتهي بعد (\d+) دقيقة$/, 'Ends in $1 min'], [/^ينتهي بعد (\d+) ساعة$/, 'Ends in $1 h'], [/^ينتهي بعد (\d+) أيام$/, 'Ends in $1 days']
  ];
  var FRAGK = DICT ? Object.keys(DICT.frag).sort(function (a, b) { return b.length - a.length; }) : [];
  function trText(v) {
    if (LANG !== 'en' || !v || !AR_RE.test(v)) return v;
    var k = v.trim(); if (!k) return v;
    var e = DICT.exact[k]; if (e != null) return v.replace(k, e);
    for (var i = 0; i < RXT.length; i++) if (RXT[i][0].test(k)) return v.replace(k, k.replace(RXT[i][0], RXT[i][1]));
    var o = v;
    for (var j = 0; j < FRAGK.length; j++) { if (o.indexOf(FRAGK[j]) > -1) o = o.split(FRAGK[j]).join(DICT.frag[FRAGK[j]]); if (!AR_RE.test(o)) break; }
    return o;
  }
  var TR_ATTR = ['placeholder', 'aria-label', 'title', 'alt'];
  function trNode(n) {
    if (n.nodeType === 3) { var v = n.nodeValue, t = trText(v); if (t !== v) n.nodeValue = t; }
    else if (n.nodeType === 1) { TR_ATTR.forEach(function (a) { var v = n.getAttribute && n.getAttribute(a); if (v && AR_RE.test(v)) { var t = trText(v); if (t !== v) n.setAttribute(a, t); } }); }
  }
  function trTree(root) {
    trNode(root);
    var w = document.createTreeWalker(root, 1 | 4, null), n;
    while ((n = w.nextNode())) trNode(n);
  }
  function setLang(l) { try { localStorage.setItem('darbak.lang', l); } catch (e) {} location.reload(); }
  var FLAG_SY = (function () {
    function star(cx, cy, r) { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.4 : r; p.push((cx + rr * Math.cos(a)).toFixed(2) + ',' + (cy + rr * Math.sin(a)).toFixed(2)); } return '<polygon points="' + p.join(' ') + '" fill="#ce1126"/>'; }
    return '<svg viewBox="0 0 30 20" width="30" height="20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><rect width="30" height="6.67" fill="#007a3d"/><rect y="13.33" width="30" height="6.67" fill="#000"/>' + star(8, 10, 2.4) + star(15, 10, 2.4) + star(22, 10, 2.4) + '<rect width="30" height="20" fill="none" stroke="rgba(0,0,0,.25)" stroke-width=".6"/></svg>';
  })();
  var FLAG_EN = '<svg viewBox="0 0 60 30" width="30" height="20" preserveAspectRatio="none" aria-hidden="true"><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#c8102e" stroke-width="2.5"/><path d="M30,0 V30 M0,15 H60" stroke="#fff" stroke-width="10"/><path d="M30,0 V30 M0,15 H60" stroke="#c8102e" stroke-width="6"/></svg>';

  var $ = function (id) { return document.getElementById(id); };
  function h(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* ===== التعريفات ===== */
  var IC = {
    accident: '<path d="M4 16l1.6-5.5A2 2 0 017.5 9h9a2 2 0 011.9 1.5L20 16v3h-2.5v-1.5h-11V19H4z"/><circle cx="8" cy="14.5" r="1" fill="currentColor"/><circle cx="16" cy="14.5" r="1" fill="currentColor"/>',
    blocked: '<path d="M3 7h18v5H3z"/><path d="M6 12v7M18 12v7M8 7l3 5M13 7l3 5"/>',
    danger: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.2v.1"/>',
    ice: '<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>',
    rain: '<path d="M7 15a4 4 0 01.5-7.9A5 5 0 0117 9a3.2 3.2 0 01-.5 6z"/><path d="M9 18l-1 2M13 18l-1 2M17 18l-1 2"/>',
    fog: '<path d="M4 8h13M7 12h13M4 16h13M7 20h10"/>',
    checkpoint: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>',
    radar: '<path d="M4 17a8 8 0 0116 0"/><path d="M12 17l4-6"/>',
    pothole: '<path d="M3 14c0-3 4-5 9-5s9 2 9 5-4 5-9 5-9-2-9-5z"/><path d="M8 14h8"/>',
    hospital: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
    clinic: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    fuel: '<path d="M6 20V6a1 1 0 011-1h7a1 1 0 011 1v14"/><path d="M5 20h11M6 11h9M15 9h2l2 2v6a1.5 1.5 0 01-3 0v-3h-1"/>',
    pharmacy: '<path d="M8 4h8l1 4H7z"/><path d="M7 8v11a1 1 0 001 1h8a1 1 0 001-1V8"/><path d="M12 11v5M9.5 13.5h5"/>',
    restaurant: '<path d="M7 3v8M4 3v5a3 3 0 006 0V3M7 11v10"/><path d="M17 21V3c-2.5 1.5-3.5 4-3.5 7 0 2 1 3 3.5 3"/>',
    bakery: '<path d="M4 10a4 4 0 014-4h8a4 4 0 014 4v1a2 2 0 01-2 2v5a1 1 0 01-1 1H7a1 1 0 01-1-1v-5a2 2 0 01-2-2z"/><path d="M9 10v2M12 10v2M15 10v2"/>',
    exchange: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
    rest: '<path d="M4 10h13v5a4 4 0 01-4 4H8a4 4 0 01-4-4z"/><path d="M17 11h2a2 2 0 010 5h-2M8 3c0 2 1.5 2 1.5 4M12 3c0 2 1.5 2 1.5 4"/>',
    hotel: '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5"/><circle cx="7" cy="11" r="1.6"/>',
    municipality: '<path d="M3 20h18M5 20V10l7-5 7 5v10"/><path d="M9 20v-6h6v6"/>',
    registry: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
    police: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M12 8.5l1.2 2.5 2.7.3-2 1.9.6 2.7L12 14.5l-2.5 1.4.6-2.7-2-1.9 2.7-.3z"/>',
    traffic: '<rect x="8" y="3" width="8" height="18" rx="3"/><circle cx="12" cy="8" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="16" r="1.3" fill="currentColor"/>',
    fire: '<path d="M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"/>',
    ambulance: '<rect x="3" y="8" width="13" height="9" rx="1"/><path d="M16 11h3l2 3v3h-5M9.5 10v5M7 12.5h5"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/>',
    airport: '<path d="M21 15l-8-3V6a1.5 1.5 0 00-3 0v6l-8 3v2l8-1.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-3.5l8 1.5z"/>',
    crossing: '<path d="M5 21V4M5 5h13l-3 4 3 4H5"/>',
    home: '<path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    svc: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    more: '<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>',
    mine: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 9h6M9 13h6M9 17h3"/>',
    bell: '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 21h4"/>',
    wx: '<path d="M7 15a4 4 0 01.5-7.9A5 5 0 0117 9a3.2 3.2 0 01-.5 6z"/>',
    drive: '<path d="M12 3l7 17-7-4-7 4z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.1"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'
  };
  var R = {   /* بلاغات المستخدمين. alert=1 تدخل بنظام التنبيه الصوتي العام */
    accident:   { n: 'حادث سير',      say: 'حادث سير',      ttl: 180,   c: '#c62828', alert: 1 },
    blocked:    { n: 'إغلاق طريق',    say: 'طريق مقطوع',    ttl: 1440,  c: '#e65100', alert: 1 },
    danger:     { n: 'خطر على الطريق', say: 'خطر على الطريق', ttl: 720,   c: '#ad1457', alert: 1 },
    ice:        { n: 'تشكّل جليد',    say: 'تشكّل جليد',    ttl: 720,   c: '#0277bd', alert: 1 },
    rain:       { n: 'أمطار غزيرة',   say: 'أمطار غزيرة',   ttl: 360,   c: '#37474f', alert: 1 },
    fog:        { n: 'ضباب كثيف',     say: 'ضباب كثيف',     ttl: 360,   c: '#546e7a', alert: 1 },
    checkpoint: { n: 'حاجز / ازدحام', say: 'حاجز',          ttl: 360,   c: '#2a62b0' },
    radar:      { n: 'دورية رادار',   say: 'دورية رادار',   ttl: 120,   c: '#6a32a8' },
    pothole:    { n: 'حفرة',          say: 'حفرة',          ttl: 10080, c: '#a8730f' }
  };
  var F = {   /* مرافق. add=1 يقدر المستخدم يضيفها. الباقي من OSM فقط. الألوان غامقة وواضحة */
    fuel:         { n: 'محروقات',           c: '#e4500a', add: 1 },
    hospital:     { n: 'مشفى / مركز طبي',  c: '#007f73', add: 1 },
    pharmacy:     { n: 'صيدلية',          c: '#1f5fe0', add: 1 },
    restaurant:   { n: 'مطعم / مقهى',      c: '#d62839', add: 1 },
    rest:         { n: 'استراحة طريق',     c: '#8a5a00', add: 1 },
    bakery:       { n: 'مخبز / فرن',       c: '#7c4a1e', add: 1 },
    exchange:     { n: 'مكتب صرافة',      c: '#0e7490', add: 1 },
    hotel:        { n: 'فندق / مكان إقامة', c: '#6d28d9', add: 1 },
    police:       { n: 'مخفر شرطة / أمن طرق', c: '#1740b8', add: 1 },
    ambulance:    { n: 'إسعاف',           c: '#c2185b', add: 1 },
    fire:         { n: 'إطفاء',           c: '#c93c00', add: 1 },
    municipality: { n: 'بلدية',           c: '#2f5d3a', add: 1 },
    registry:     { n: 'دائرة نفوس',      c: '#4a3ab8', add: 1 },
    airport:      { n: 'مطار',            c: '#0a58a8', add: 1 },
    crossing:     { n: 'معبر حدودي',      c: '#a31515' }
  };
  var ROOT = document.documentElement.style;
  Object.keys(R).forEach(function (k) { ROOT.setProperty('--c-' + k, R[k].c); });
  Object.keys(F).forEach(function (k) { ROOT.setProperty('--c-' + k, F[k].c); });
  function svg(k, color, size) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; }
  function tint(c) { return c; }
  function circ(k, c) { var d = h('span', 'ci'); d.style.background = tint(c); d.innerHTML = svg(k, '#fff', 24); return d; }

  var GOV = [
    { n: 'دمشق', lat: 33.513, lon: 36.292 }, { n: 'ريف دمشق', lat: 33.60, lon: 36.55 }, { n: 'حلب', lat: 36.202, lon: 37.134 },
    { n: 'حمص', lat: 34.730, lon: 36.709 }, { n: 'حماة', lat: 35.132, lon: 36.757 }, { n: 'اللاذقية', lat: 35.519, lon: 35.790 },
    { n: 'طرطوس', lat: 34.889, lon: 35.887 }, { n: 'إدلب', lat: 35.930, lon: 36.633 }, { n: 'درعا', lat: 32.625, lon: 36.106 },
    { n: 'السويداء', lat: 32.709, lon: 36.567 }, { n: 'القنيطرة', lat: 33.126, lon: 35.824 }, { n: 'الرقة', lat: 35.953, lon: 39.007 },
    { n: 'دير الزور', lat: 35.336, lon: 40.141 }, { n: 'الحسكة', lat: 36.502, lon: 40.748 }
  ];
  function govBy(n) { for (var i = 0; i < GOV.length; i++) if (GOV[i].n === n) return GOV[i]; return GOV[0]; }
  function govOf(p) {
    if (dist(p, GOV[0]) < 10000) return GOV[0].n;
    var best = GOV[1], bd = Infinity;
    GOV.forEach(function (g) { var d = dist(p, g); if (d < bd) { bd = d; best = g; } });
    return best.n;
  }

  /* ===== أدوات ===== */
  function dist(a, b) {
    var r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lon - a.lon) * r;
    var x = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 6371000 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }
  function bearing(a, b) {
    var r = Math.PI / 180, y = Math.sin((b.lon - a.lon) * r) * Math.cos(b.lat * r);
    var x = Math.cos(a.lat * r) * Math.sin(b.lat * r) - Math.sin(a.lat * r) * Math.cos(b.lat * r) * Math.cos((b.lon - a.lon) * r);
    return (Math.atan2(y, x) / r + 360) % 360;
  }
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function uid() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'i' + Date.now() + Math.random().toString(36).slice(2, 9); }
  function uuid() {   /* UUID صحيح دايماً (الخادم بيطلبه) */
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = new Uint8Array(16); crypto.getRandomValues(b); b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var x = [].map.call(b, function (v) { return ('0' + v.toString(16)).slice(-2); }).join('');
    return x.slice(0, 8) + '-' + x.slice(8, 12) + '-' + x.slice(12, 16) + '-' + x.slice(16, 20) + '-' + x.slice(20);
  }
  var PHOTO_RE = /^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/;
  function safePhoto(p) { return typeof p === 'string' && p.length < 150000 && PHOTO_RE.test(p) ? p : null; }   /* ما منعرض إلا صور JPEG مولّدة من التطبيق، حتى لو الخادم رجّع شي تاني */
  function ago(t) {
    var m = Math.max(1, Math.round((Date.now() - t) / 60000));
    if (m < 60) return 'منذ ' + m + (m <= 10 ? ' دقايق' : ' دقيقة');
    var hr = Math.round(m / 60);
    if (hr < 24) return hr === 1 ? 'منذ ساعة' : hr === 2 ? 'منذ ساعتين' : 'منذ ' + hr + (hr <= 10 ? ' ساعات' : ' ساعة');
    var d = Math.round(hr / 24); return d === 1 ? 'منذ يوم' : d === 2 ? 'منذ يومين' : 'منذ ' + d + ' أيام';
  }
  function left(r) {
    var m = Math.round(R[r.type].ttl - (Date.now() - r.at) / 60000);
    if (m < 60) return 'ينتهي بعد ' + Math.max(m, 1) + ' دقيقة';
    var hr = Math.round(m / 60); return hr < 48 ? 'ينتهي بعد ' + hr + ' ساعة' : 'ينتهي بعد ' + Math.round(hr / 24) + ' أيام';
  }
  var tt;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2800); }

  /* ===== الخادم (Supabase: REST + Auth) أو التخزين المحلي ===== */
  var RK = 'darbak.v3.reports', FK = 'darbak.v3.facs', VK = 'darbak.v2.votes', OK = 'darbak.v2.owner';
  var SK = 'darbak.session.v2', PK = 'darbak.profile.v1', STK = 'darbak.settings.v1', MK = 'darbak.mine.v1';
  var deviceOwner = load(OK, null); if (!deviceOwner) { deviceOwner = uid(); save(OK, deviceOwner); }
  var session = remote ? load(SK, null) : null;          /* {access, refresh, exp, uid, email, name} */
  var owner = session ? session.uid : deviceOwner;
  var mineIds = remote ? {} : load(MK, {});              /* بالخادم: بتنجلب من my_ids بعد الدخول */
  var profile = load(PK, null) || { name: '', since: Date.now() }; save(PK, profile);
  var settings = Object.assign({ voice: true, vib: true, old: false }, load(STK, {}));
  /* خدمات OSM اللي آخر تعديل عليها قبل 2024 بتنخفي افتراضياً (بتظهر من حسابي). المطارات والمعابر المؤكَّدة ما بتتأثر */
  var OLD_TS = Date.UTC(2024, 0, 1);
  function oldO(p) { return !settings.old && !p.cur && p.ts > 0 && p.ts < OLD_TS; }
  function oldCount() { var n = 0; Object.keys(osm).forEach(function (k) { if (oldO(osm[k])) n++; }); return n; }
  var votes = remote ? {} : load(VK, {});
  var reports = [], facs = [], photoCache = {};
  var online = navigator.onLine !== false;
  function isMine(it) { return remote ? !!mineIds[it.id] : (it.owner === owner || !!mineIds[it.id]); }
  function markMine(id) { mineIds[id] = 1; if (!remote) save(MK, mineIds); }
  var KM = { clinic: 'hospital', traffic: 'police' };      /* دمج الفئات القديمة */
  function normFacs() { facs.forEach(function (f) { if (KM[f.kind]) { f.sub = f.sub || (f.kind === 'clinic' ? 'مركز طبي / عيادة' : 'شرطة مرور / أمن طرق'); f.kind = KM[f.kind]; } }); }

  /* --- أخطاء الخادم بالعربي --- */
  function errMsg(e) {
    var m = String((e && (e.code || e.message)) || e || '');
    if (/login_required|jwt|not authenticated/i.test(m)) return 'سجّل دخولك أول';
    if (/confirm_email/.test(m)) return 'أكّد إيميلك أول (شيّك رسالة التأكيد بإيميلك)';
    if (/rate_limit/.test(m)) return 'وصلت للحد المسموح حالياً، جرّب بعد شوي';
    if (/duplicate/.test(m)) return 'في إضافة مشابهة قريبة منك. أكّدها بدل ما تكرّرها';
    if (/own_item/.test(m)) return 'ما بتقدر تصوّت على إضافتك';
    if (/too_far/.test(m)) return 'لازم تكون قريب من الكازية (أقل من 1.5 كم) لتحدّث حالتها';
    if (/outside_syria/.test(m)) return 'الموقع خارج سوريا';
    if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return 'ما في اتصال بالإنترنت';
    return 'ما نجحت العملية، جرّب مرة تانية';
  }

  /* --- جلسة الحساب --- */
  function clearSession() { session = null; owner = deviceOwner; mineIds = remote ? {} : load(MK, {}); votes = remote ? {} : load(VK, {}); try { localStorage.removeItem(SK); } catch (e) {} }
  function setTokens(j) {
    var u = j.user || session || {};
    session = { access: j.access_token, refresh: j.refresh_token, exp: Date.now() + (j.expires_in || 3600) * 1000, uid: (j.user ? j.user.id : session.uid), email: (j.user ? j.user.email : session.email), name: ((j.user && j.user.user_metadata) || {}).name || (session && session.name) || '' };
    if (!j.user && session) { /* تجديد توكن بدون كائن المستخدم */ }
    owner = session.uid; save(SK, session);
    if (session.name && !profile.name) { profile.name = session.name; save(PK, profile); }
  }
  function authReq(method, path, body, tok) {
    var hd = { apikey: CFG.key, 'Content-Type': 'application/json' };
    if (tok) hd.Authorization = 'Bearer ' + tok;
    return fetch(CFG.url + '/auth/v1/' + path, { method: method, headers: hd, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.text().then(function (t) { var j = {}; try { j = t ? JSON.parse(t) : {}; } catch (e) {} if (!r.ok) { var er = new Error(j.msg || j.error_description || j.message || j.error_code || 'error'); er.status = r.status; er.code = j.error_code || j.code || ''; throw er; } return j; }); });
  }
  function refreshSession() {
    if (!session) return Promise.resolve();
    return authReq('POST', 'token?grant_type=refresh_token', { refresh_token: session.refresh }).then(function (j) {
      setTokens({ access_token: j.access_token, refresh_token: j.refresh_token, expires_in: j.expires_in, user: j.user });
    }).catch(function (e) { if (e && e.status >= 400 && e.status < 500) { clearSession(); renderAll(); toast('انتهت جلستك، سجّل دخول مرة تانية'); } throw e; });
  }
  function tokenReady() { return (!session || session.exp - Date.now() > 60000) ? Promise.resolve() : refreshSession(); }

  function api(path, opts) {
    opts = opts || {};
    return tokenReady().then(function () {
      var hd = { apikey: CFG.key, 'Content-Type': 'application/json' };
      var tok = session ? session.access : (/^eyJ/.test(CFG.key) ? CFG.key : null);   /* المفتاح الجديد (sb_publishable_…) مو JWT، فبيروح بـ apikey بس */
      if (tok) hd.Authorization = 'Bearer ' + tok;
      return fetch(CFG.url + '/rest/v1/' + path, Object.assign({}, opts, { headers: Object.assign(hd, opts.headers || {}) }));
    }).then(function (r) {
      if (r.status === 401 && session && !opts._retry) { return refreshSession().then(function () { return api(path, Object.assign({}, opts, { _retry: 1 })); }); }
      return r.text().then(function (t) {
        var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok) { var er = new Error((j && (j.message || j.hint)) || ('http ' + r.status)); er.code = (j && j.message) || ''; er.status = r.status; throw er; }
        return j;
      });
    });
  }
  function rpc(name, body) { return api('rpc/' + name, { method: 'POST', body: JSON.stringify(body || {}) }); }

  /* --- شروط الكتابة: نت + حساب (بالوضع المربوط بالخادم) --- */
  var authTab = 'in';
  /* --- CAPTCHA (Cloudflare Turnstile) اختياري: بيشتغل إذا حطيت captcha بـ config.js --- */
  var capLoad = null;
  function capScript() {
    if (capLoad) return capLoad;
    capLoad = new Promise(function (ok, no) {
      var sc = document.createElement('script'); sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; sc.async = true;
      sc.onload = function () { ok(window.turnstile); }; sc.onerror = function () { capLoad = null; no(new Error('captcha')); }; document.head.appendChild(sc);
    });
    return capLoad;
  }
  function capBox(form) {   /* بيرجّع {token(), reset()} وبيضيف الودجت للفورم */
    var st = { t: '', w: null };
    if (!CFG.captcha) return { token: function () { return ''; }, reset: function () {}, need: false };
    var d = h('div', 'cap'); form.appendChild(d);
    capScript().then(function (ts) { st.w = ts.render(d, { sitekey: CFG.captcha, language: 'ar', callback: function (t) { st.t = t; }, 'expired-callback': function () { st.t = ''; }, 'error-callback': function () { st.t = ''; } }); })
      .catch(function () { d.textContent = 'تعذّر تحميل التحقق. تأكد من الاتصال وحدّث الصفحة.'; });
    return { need: true, token: function () { return st.t; }, reset: function () { st.t = ''; try { if (st.w != null && window.turnstile) window.turnstile.reset(st.w); } catch (e) {} } };
  }
  function withCap(body, cap) { if (cap.need) body.gotrue_meta_security = { captcha_token: cap.token() }; return body; }
  function capOk(cap) { if (cap.need && !cap.token()) { toast('أكّد إنك مو روبوت أول'); return false; } return true; }
  function canWrite() {
    if (!online) { toast('ما في نت. دربك بيشتغل بالنت بس'); return false; }
    if (remote && !session) { authTab = 'in'; toast('سجّل دخولك أول عشان تضيف أو تأكّد'); go('acct'); return false; }
    return true;
  }

  function seedR() {
    var now = Date.now(), m = 60000;
    function s(i, type, g, dla, dlo, road, note, min, yes) { var c = govBy(g); return { id: 'sr' + i, seed: 1, type: type, lat: c.lat + dla, lon: c.lon + dlo, road: road, note: note, at: now - min * m, yes: yes, no: 0, owner: 'seed' }; }
    return [
      s(1, 'accident', 'دمشق', 0.020, -0.004, 'طريق المطار', 'تصادم بين سيارتين، المسار الأيمن مسدود', 15, 7),
      s(2, 'accident', 'دمشق', -0.025, 0.020, 'أوتوستراد المزة', 'حادث بسيط، السير بطيء', 45, 4),
      s(3, 'blocked', 'دمشق', -0.012, -0.014, 'جسر الرئيس', 'أعمال صيانة والطريق مقطوع', 30, 3),
      s(4, 'blocked', 'حماة', 0.010, 0.020, 'طريق السلمية', 'الطريق مقطوع، استخدموا الطريق البديل', 90, 3),
      s(5, 'checkpoint', 'دمشق', 0.012, 0.010, 'شارع الثورة', 'ازدحام كثيف عند الحاجز', 20, 6),
      s(6, 'checkpoint', 'دمشق', -0.020, 0.030, 'أوتوستراد المزة', 'ازدحام متوسط', 40, 2),
      s(7, 'fog', 'دمشق', 0.060, 0.050, 'طريق دمشق حمص', 'ضباب كثيف والرؤية أقل من 50 متر', 30, 5),
      s(8, 'rain', 'اللاذقية', 0.010, -0.010, 'الطريق الساحلي', 'أمطار غزيرة وتجمّع مياه', 45, 4),
      s(9, 'ice', 'السويداء', 0.020, 0.030, 'طريق السويداء درعا', 'جليد على المنعطفات', 120, 3),
      s(10, 'pothole', 'حمص', -0.010, 0.012, 'طريق حماة', 'حفرة عميقة بالمسار الأيمن', 60 * 30, 5)
    ];
  }
  function persist() { if (!remote) { save(RK, reports); save(FK, facs); } }
  function initLocal() { reports = load(RK, null) || seedR(); facs = load(FK, null) || []; normFacs(); persist(); }

  var refreshing = false;
  function refresh() {
    if (!remote) { renderAll(); return Promise.resolve(); }
    if (!online || refreshing) return Promise.resolve();
    refreshing = true;
    var since = Date.now() - 7 * 86400000;
    return Promise.all([
      api('reports?select=id,type,lat,lon,road,note,has_photo,at,yes,no&at=gte.' + since + '&order=at.desc&limit=500'),
      api('facilities?select=id,kind,name,lat,lon,note,fuel,at,yes,no&order=at.desc&limit=1000')
    ]).then(function (x) { reports = Array.isArray(x[0]) ? x[0] : []; facs = Array.isArray(x[1]) ? x[1] : []; normFacs(); renderAll(); })
      .catch(function () { if (online) toast('ما في اتصال بالخادم'); }).then(function () { refreshing = false; });
  }
  function syncMine() {
    if (!remote || !session) return;
    rpc('my_ids').then(function (rows) { (rows || []).forEach(function (r) { mineIds[r.id] = 1; }); renderAll(); }).catch(function () {});
    rpc('my_votes').then(function (rows) { (rows || []).forEach(function (r) { votes[r.item] = r.yes ? 'y' : 'n'; }); renderAll(); }).catch(function () {});
  }
  function addItem(table, obj) {
    var arr = table === 'reports' ? reports : facs;
    if (!remote) { markMine(obj.id); arr.push(obj); renderAll(); persist(); return Promise.resolve(); }
    var p = table === 'reports'
      ? rpc('add_report', { p_id: obj.id, p_type: obj.type, p_lat: obj.lat, p_lon: obj.lon, p_road: obj.road || '', p_note: obj.note || '', p_photo: obj.photo || null })
      : rpc('add_facility', { p_id: obj.id, p_kind: obj.kind, p_name: obj.name, p_lat: obj.lat, p_lon: obj.lon, p_note: obj.note || '', p_fuel: obj.fuel || '' });
    return p.then(function () {
      if (obj.photo) { photoCache[obj.id] = obj.photo; obj.has_photo = true; delete obj.photo; }
      markMine(obj.id); arr.push(obj); renderAll();
    });
  }
  function voteItem(table, item, yes) {
    var prev = votes[item.id];
    if (yes) item.yes++; else item.no++; votes[item.id] = yes ? 'y' : 'n'; if (!remote) save(VK, votes); renderAll();
    if (!remote) return persist();
    rpc('vote_item', { p_table: table, p_id: item.id, p_yes: yes }).catch(function (e) {
      if (yes) item.yes--; else item.no--; if (prev) votes[item.id] = prev; else delete votes[item.id]; renderAll(); toast(errMsg(e));
    });
  }
  function flagItem(table, item) {
    if (!remote) { toast('الإبلاغ عن المحتوى بيشتغل بعد ربط الخادم'); return; }
    rpc('flag_item', { p_table: table, p_id: item.id }).then(function () {
      var arr = table === 'reports' ? reports : facs, i = arr.indexOf(item); if (i > -1) arr.splice(i, 1); selected = null; renderAll(); toast('شكراً، وصلنا إبلاغك وبنراجعه');
    }).catch(function (e) { toast(errMsg(e)); });
  }
  function deleteItem(table, item) {
    var arr = table === 'reports' ? reports : facs, i = arr.indexOf(item); if (i > -1) arr.splice(i, 1); selected = null; renderAll();
    if (!remote) return persist();
    rpc('delete_mine', { p_table: table, p_id: item.id }).catch(function () { toast('ما انحذف من الخادم'); refresh(); });
  }
  function editNote(table, item, note) {
    item.note = note; renderAll();
    if (!remote) return persist();
    rpc('edit_mine', { p_table: table, p_id: item.id, p_note: note }).catch(function () { toast('ما انحفظ التعديل على الخادم'); refresh(); });
  }
  function getPhoto(it) { return safePhoto(it.photo || photoCache[it.id]); }
  function loadPhoto(it, then) {
    if (!remote || !it.has_photo || photoCache[it.id] || photoCache[it.id] === false) return;
    photoCache[it.id] = false;
    api('reports?select=photo&id=eq.' + encodeURIComponent(it.id)).then(function (x) { var p = x && x[0] && safePhoto(x[0].photo); if (p) { photoCache[it.id] = p; then(); } }).catch(function () { delete photoCache[it.id]; });
  }

  /* --- تسجيل الدخول والتسجيل والروابط الراجعة من الإيميل --- */
  function authErr(m, code) {
    m = String(m || '') + ' ' + String(code || '');
    if (/email_not_confirmed|not confirmed/i.test(m)) return 'أكّد إيميلك أول من الرسالة اللي وصلتك';
    if (/invalid login|invalid_credentials/i.test(m)) return 'الإيميل أو كلمة السر غلط';
    if (/already registered|already been registered|user_already_exists/i.test(m)) return 'هالإيميل مسجّل من قبل، سجّل دخول';
    if (/weak_password|password/i.test(m)) return 'كلمة السر ضعيفة: 8 أحرف على الأقل ويفضّل أرقام وحروف';
    if (/over_email_send_rate_limit|rate/i.test(m)) return 'محاولات كتيرة، استنى شوي وجرّب';
    if (/email/i.test(m)) return 'تأكد من الإيميل';
    if (/Failed to fetch|NetworkError/i.test(m)) return 'ما في اتصال بالإنترنت';
    return 'ما نجحت العملية، جرّب مرة تانية';
  }
  function afterLogin() { syncMine(); refresh(); renderAll(); }
  function signOut() {
    var t = session && session.access; if (t) authReq('POST', 'logout', null, t).catch(function () {});
    clearSession(); profile.name = ''; save(PK, profile); renderAll(); toast('سجّلت خروج');
  }
  function deleteAccount() {
    rpc('delete_my_account').then(function () { clearSession(); refresh(); renderAll(); toast('انحذف حسابك مع كل إضافاتك'); }).catch(function (e) { toast(errMsg(e)); });
  }
  var recoveryTok = null;
  function handleAuthHash() {
    if (!remote || !location.hash || location.hash.length < 3) return;
    var p = new URLSearchParams(location.hash.slice(1));
    if (p.get('error')) { toast('الرابط غلط أو انتهت صلاحيته، اطلب رابط جديد'); try { history.replaceState(null, '', location.pathname); } catch (e) {} return; }
    var at = p.get('access_token'); if (!at) return;
    var type = p.get('type'), rt = p.get('refresh_token'), ex = parseInt(p.get('expires_in') || '3600', 10);
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    authReq('GET', 'user', null, at).then(function (u) {
      setTokens({ access_token: at, refresh_token: rt, expires_in: ex, user: u });
      if (type === 'recovery') { recoveryTok = at; authTab = 'new'; go('acct'); toast('اكتب كلمة سر جديدة'); }
      else { toast('تم تأكيد إيميلك، أهلاً فيك'); afterLogin(); go('acct'); }
    }).catch(function () { toast('الرابط انتهت صلاحيته، اطلب رابط جديد'); });
  }

  /* ===== الحالة ===== */
  var gov = 'دمشق';
  var vis = {}; Object.keys(R).concat(Object.keys(F)).concat(['wx']).forEach(function (k) { vis[k] = true; });
  var mode = 'all';
  var selected = null;        // {t:'reports'|'facilities'|'osm', id}
  var osm = {};
  function live(r) { return R[r.type] && (Date.now() - r.at) / 60000 < R[r.type].ttl && (r.no - r.yes) < 3; }
  function facOk(f) { return F[f.kind] && (f.no - f.yes) < 3; }
  function findSel() {
    if (!selected) return null;
    if (selected.t === 'osm') return osm[selected.id] || null;
    var arr = selected.t === 'reports' ? reports : facs;
    for (var i = 0; i < arr.length; i++) if (arr[i].id === selected.id) return arr[i];
    return null;
  }

  /* ===== التنقل بين الشاشات ===== */
  var TITLES = { map: 'الخريطة الحية', wx: 'الطقس', svc: 'الخدمات', more: 'المزيد', mine: 'بلاغاتي', acct: 'حسابي' };
  var SCRS = ['home', 'map', 'feed', 'wx', 'svc', 'more', 'mine', 'acct'];
  var NAVOF = { home: 'home', feed: 'home', wx: 'home', map: 'map', svc: 'svc', more: 'more', mine: 'more', acct: 'more' };
  var cur = 'home', stack = [];
  var feedType = null, feedTab = 'all', feedGov = '';
  function feedTitle() { return feedType === 'accident' ? 'الحوادث' : feedType === 'blocked' ? 'إغلاقات الطرق' : feedType === 'checkpoint' ? 'الازدحام والحواجز' : 'التنبيهات'; }

  function go(s, opt) {
    opt = opt || {};
    if (opt.root) stack = s === 'home' ? [] : ['home']; else if (!opt.back && s !== cur) stack.push(cur);
    cur = s;
    SCRS.forEach(function (n) { $('s-' + n).hidden = n !== s; });
    $('barHome').hidden = s !== 'home'; $('barSub').hidden = s === 'home';
    $('barTitle').textContent = s === 'feed' ? feedTitle() : (TITLES[s] || '');
    $('barGov').hidden = s !== 'map';
    var nv = NAVOF[s];
    document.querySelectorAll('#nav .tab').forEach(function (b) { if (b.dataset.go === nv) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    if (s === 'map') { setTimeout(function () { map.invalidateSize(); renderDetail(); loadCells(); }, 0); }
    else { $('s-' + s).scrollTop = 0; $('detail').hidden = true; }
    renderScreen(s);
  }
  function back() { var p = stack.pop() || 'home'; go(p, { back: true }); }
  function renderScreen(s) {
    if (s === 'home') renderHome(); else if (s === 'feed') renderFeed(); else if (s === 'wx') renderWxScreen();
    else if (s === 'svc') renderSvc(); else if (s === 'more') renderMore(); else if (s === 'mine') renderMine(); else if (s === 'acct') renderAcct();
  }
  function renderAll() {
    drawPins();
    var typing = cur === 'acct' && document.activeElement && document.activeElement.tagName === 'INPUT' && $('s-acct').contains(document.activeElement);
    if (!typing) renderScreen(cur);   /* ما نعيد رسم نموذج الدخول وانت عم تكتب */
    if (cur === 'map') renderDetail();
  }
  function setGov(g) {
    gov = g;
    ['homeGov', 'wxGov', 'svcGov', 'barGov'].forEach(function (id) { $(id).value = g; });
    if (cur === 'map') { var o = govBy(g); map.flyTo([o.lat, o.lon], 12, { duration: .8 }); }
    renderScreen(cur);
  }
  function openOnMap(lat, lon, t, id, zoom) { go('map'); map.setView([lat, lon], zoom || 15); selected = { t: t, id: id }; renderDetail(); }

  /* ===== الخريطة ===== */
  /* الخريطة محصورة بسوريا: ما بتقدر تسحبها لبرا الحدود ولا تبعّد أكتر من اللازم */
  var map = L.map('map', { zoomControl: false, preferCanvas: true, minZoom: 6, maxBounds: [[31.9, 35.3], [37.8, 42.9]], maxBoundsViscosity: 1.0 });
  map.fitBounds([[32.3, 35.7], [37.3, 42.4]]);
  var osmTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' });
  var sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Esri, Maxar, Earthstar Geographics' });
  var satLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 });
  osmTiles.addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  var layerR = L.layerGroup().addTo(map), layerF = L.layerGroup().addTo(map), layerW = L.layerGroup().addTo(map);
  var layerO = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 48, disableClusteringAtZoom: 16, chunkedLoading: true }).addTo(map);
  var routeLine = null, meMarker = null;

  $('bSat').addEventListener('click', function () {
    var on = this.getAttribute('aria-pressed') !== 'true';
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) { map.removeLayer(osmTiles); sat.addTo(map); satLabels.addTo(map); } else { map.removeLayer(sat); map.removeLayer(satLabels); osmTiles.addTo(map); }
  });

  function pinR(type) { return L.divIcon({ className: '', iconSize: [28, 28], iconAnchor: [14, 28], html: '<div class="pin" style="background:var(--c-' + type + ')">' + svg(type, '#fff', 14) + '</div>' }); }
  function pinF(kind) { return L.divIcon({ className: '', iconSize: [26, 26], iconAnchor: [13, 13], html: '<div class="fpin" style="background:var(--c-' + kind + ')">' + svg(kind, '#fff', 14) + '</div>' }); }
  function pinO(kind) { return L.divIcon({ className: '', iconSize: [22, 22], iconAnchor: [11, 11], html: '<div class="opin" style="background:var(--c-' + kind + ')">' + svg(kind, '#fff', 13) + '</div>' }); }

  function refreshO() {
    layerO.clearLayers(); var arr = [];
    Object.keys(osm).forEach(function (id) {
      var p = osm[id]; if (!vis[p.kind] || oldO(p)) return;
      if (!p.m) { p.m = L.marker([p.lat, p.lon], { icon: pinO(p.kind), title: p.name || F[p.kind].n }); p.m.on('click', function () { selected = { t: 'osm', id: id }; renderDetail(); }); }
      arr.push(p.m);
    });
    layerO.addLayers(arr);
  }
  function drawPins() {
    layerR.clearLayers(); layerF.clearLayers();
    reports.forEach(function (r) {
      if (!live(r) || !vis[r.type]) return;
      L.marker([r.lat, r.lon], { icon: pinR(r.type), title: R[r.type].n }).addTo(layerR).on('click', function () { selected = { t: 'reports', id: r.id }; renderDetail(); });
    });
    facs.forEach(function (f) {
      if (!facOk(f) || !vis[f.kind]) return;
      L.marker([f.lat, f.lon], { icon: pinF(f.kind), title: f.name }).addTo(layerF).on('click', function () { selected = { t: 'facilities', id: f.id }; renderDetail(); });
    });
    drawWx();
  }

  /* ===== بيانات OpenStreetMap الحيّة (Overpass) ===== */
  var OVP = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
  var osmBase = 0;
  function stampOsm() { var e = document.getElementById('osmStamp'); if (e && osmBase) e.textContent = 'بيانات OpenStreetMap محدّثة حتى: ' + fmtDate(osmBase) + '. ما نعدّل عليها، بنعرضها متل ما هي.'; }
  function ovp(q) {
    var i = 0;
    function next() {
      if (i >= OVP.length) return Promise.reject(new Error('overpass'));
      var u = OVP[i++], ctl = new AbortController(), to = setTimeout(function () { ctl.abort(); }, 50000);
      return fetch(u, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ctl.signal })
        .then(function (r) { clearTimeout(to); if (!r.ok) throw new Error('http'); return r.json(); })
        .then(function (j) { var tb = j && j.osm3s && Date.parse(j.osm3s.timestamp_osm_base); if (tb && tb > osmBase) { osmBase = tb; stampOsm(); } return j; })
        .catch(function () { clearTimeout(to); return next(); });
    }
    return next();
  }
  /* حدود سوريا التقريبية (خط,طول). تُستخدم كشبكة أمان: لإضافة المرافق، ولو استعلام حدود OSM ما اشتغل */
  var SYR_POLY = [[35.93,35.90],[35.96,36.06],[36.08,36.22],[36.22,36.52],[36.55,36.66],[36.70,36.98],[36.75,37.30],[36.76,37.60],[36.85,38.00],[36.95,38.30],[36.80,38.80],[36.72,39.25],[36.82,39.70],[36.86,40.10],[37.00,40.60],[37.12,41.10],[37.15,41.60],[37.25,42.00],[37.27,42.40],[36.82,42.18],[36.60,41.85],[36.33,41.35],[35.85,41.18],[35.30,41.00],[34.75,40.95],[34.40,41.00],[34.00,40.15],[33.70,39.50],[33.37,38.80],[32.32,37.20],[32.31,36.75],[32.40,36.40],[32.54,36.02],[32.65,35.85],[32.70,35.65],[32.75,35.72],[33.05,35.78],[33.25,35.80],[33.43,35.85],[33.65,35.95],[33.85,36.30],[34.00,36.45],[34.20,36.52],[34.35,36.55],[34.55,36.52],[34.62,36.30],[34.62,35.93],[34.90,35.82],[35.30,35.72],[35.62,35.74],[35.85,35.78]];
  function inPoly(lat, lon) {
    var ins = false, P = SYR_POLY;
    for (var i = 0, j = P.length - 1; i < P.length; j = i++) {
      if (((P[i][1] > lon) !== (P[j][1] > lon)) && (lat < (P[j][0] - P[i][0]) * (lon - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0])) ins = !ins;
    }
    return ins;
  }
  function elPt(e) { return [e.lat != null ? e.lat : (e.center && e.center.lat), e.lon != null ? e.lon : (e.center && e.center.lon)]; }
  /* الاستعلام الأساسي بيستخدم حدود سوريا الرسمية من OSM. إذا رجع فاضي على مستوى البلد، بنرجع لمربع + فلتر الحدود */
  var useArea = true;
  function areaBody(bb, parts) { var b = '(' + bb.join(',') + ')'; return '[out:json][timeout:60];area["ISO3166-1"="SY"][admin_level=2]->.sy;(' + parts.map(function (p) { return 'nwr' + p + '(area.sy)' + b + ';'; }).join('') + ');out center tags meta;'; }
  function getPois(bb, parts) {
    function bboxMode() { return ovp(qBody(bb, parts)).then(function (j) { return { elements: (j.elements || []).filter(function (e) { var p = elPt(e); return p[0] != null && inPoly(p[0], p[1]); }) }; }); }
    if (!useArea) return bboxMode();
    return ovp(areaBody(bb, parts)).then(function (j) {
      if (j.elements && j.elements.length) return j;
      if (bb === SYR) { useArea = false; return bboxMode(); }
      return j;
    });
  }
  function qBody(bb, parts) { var b = '(' + bb.join(',') + ')'; return '[out:json][timeout:45];(' + parts.map(function (p) { return 'nwr' + p + b + ';'; }).join('') + ');out center tags meta;'; }
  var P_COUNTRY = ['["amenity"="hospital"]', '["amenity"="police"]', '["amenity"="fire_station"]', '["emergency"="ambulance_station"]', '["amenity"="townhall"]', '["aeroway"="aerodrome"]', '["barrier"="border_control"]'];
  var P_CELL = ['["amenity"="pharmacy"]', '["amenity"="fuel"]', '["amenity"="clinic"]', '["tourism"~"^(hotel|guest_house|hostel|motel|apartment)$"]', '["amenity"~"^(restaurant|cafe|fast_food)$"]', '["highway"~"^(rest_area|services)$"]', '["shop"="bakery"]', '["amenity"="bureau_de_change"]', '["amenity"="money_transfer"]', '["shop"="money_transfer"]', '["office"="government"]["name"~"نفوس"]'];
  var SYR = [32.2, 35.6, 37.4, 42.4];

  var STAY = { hotel: 'فندق', guest_house: 'بيت ضيافة', hostel: 'نزل', motel: 'موتيل', apartment: 'شقق مفروشة' };
  function classify(t) {   /* بيرجّع [الفئة، التسمية الفرعية] */
    if (t.aeroway === 'aerodrome') {   /* مطارات مدنية فقط: بدون عسكري ولا مهابط صغيرة بلا رمز */
      var an = (t.name || '') + ' ' + (t['name:ar'] || '') + ' ' + (t['name:en'] || '');
      if ((t.military && t.military !== 'no') || /عسكري|military|air ?base|قاعدة/i.test(an)) return null;
      if (!(t.iata || t.icao || /^(international|public|regional|civil)$/.test(t['aerodrome:type'] || t.aerodrome || ''))) return null;
      return ['airport', 'مطار'];
    }
    if (t.barrier === 'border_control') return ['crossing', 'معبر حدودي'];
    if (t.amenity === 'hospital') return ['hospital', 'مشفى'];
    if (t.amenity === 'clinic') return ['hospital', 'مركز طبي / عيادة'];
    if (t.amenity === 'pharmacy') return ['pharmacy', 'صيدلية'];
    if (t.amenity === 'fuel') return ['fuel', 'كازية'];
    if (t.amenity === 'fire_station') return ['fire', 'إطفاء'];
    if (t.emergency === 'ambulance_station') return ['ambulance', 'إسعاف'];
    if (t.amenity === 'townhall') return ['municipality', 'بلدية'];
    if (t.amenity === 'restaurant') return ['restaurant', 'مطعم'];
    if (t.amenity === 'cafe') return ['restaurant', 'مقهى'];
    if (t.amenity === 'fast_food') return ['restaurant', 'وجبات سريعة'];
    if (t.shop === 'bakery') return ['bakery', 'مخبز'];
    if (t.amenity === 'bureau_de_change') return ['exchange', 'مكتب صرافة'];
    if (t.amenity === 'money_transfer' || t.shop === 'money_transfer') return ['exchange', 'حوالات وصرافة'];
    if (t.highway === 'rest_area' || t.highway === 'services') return ['rest', 'استراحة طريق'];
    if (STAY[t.tourism]) return ['hotel', STAY[t.tourism]];
    if (t.amenity === 'police') return /مرور|أمن الطرق|شرطة الطرق|traffic|highway/i.test((t.name || '') + ' ' + (t['name:ar'] || '') + ' ' + (t['name:en'] || '')) ? ['police', 'شرطة مرور / أمن طرق'] : ['police', 'مخفر شرطة'];
    if (t.office === 'government' && /نفوس/.test((t.name || '') + (t['name:ar'] || ''))) return ['registry', 'دائرة نفوس'];
    return null;
  }
  function fuelOf(t) {
    var o = [];
    if (t['fuel:octane_95'] === 'yes') o.push('بنزين 95'); if (t['fuel:octane_91'] === 'yes') o.push('بنزين 91'); if (t['fuel:octane_92'] === 'yes') o.push('بنزين 92');
    if (t['fuel:diesel'] === 'yes') o.push('مازوت'); if (t['fuel:lpg'] === 'yes') o.push('غاز');
    return o.join('،');
  }
  function fmtDate(ts) { try { return new Date(ts).toLocaleDateString(LANG === 'en' ? 'en-GB' : 'ar', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return ''; } }
  function addrOf(t) { return t['addr:full'] || [t['addr:street'], t['addr:housenumber'], t['addr:suburb'] || t['addr:district'], t['addr:city']].filter(Boolean).join('، '); }
  function cleanPhone(p) { return String(p || '').split(/[;,]/)[0].replace(/[^\d+]/g, '').slice(0, 18); }
  function webOf(t) { var u = t.website || t['contact:website'] || ''; return /^https?:\/\/[^\s<>"']+$/i.test(u) ? u : ''; }
  var STALE_MS = 730 * 24 * 3600 * 1000;
  function toPoi(e) {
    var t = e.tags || {}, cl = classify(t); if (!cl) return null; var kind = cl[0];
    var lat = e.lat != null ? e.lat : (e.center && e.center.lat), lon = e.lon != null ? e.lon : (e.center && e.center.lon);
    if (lat == null || lon == null) return null;
    var note = (t.iata || t.icao) ? ('رمز ' + (t.iata || t.icao)) : '';
    var em = t.emergency === 'yes' || t['healthcare:speciality'] === 'emergency' ? 1 : 0;
    var ts = e.timestamp ? Date.parse(e.timestamp) : 0;
    return { id: e.type[0] + e.id, kind: kind, sub: cl[1], lat: lat, lon: lon, name: (LANG === 'en' ? (t['name:en'] || t.name || t['name:ar']) : (t['name:ar'] || t.name || t['name:en'])) || '', note: note, fuel: kind === 'fuel' ? fuelOf(t) : '', ot: e.type, oid: e.id,
      addr: addrOf(t), ph: cleanPhone(t.phone || t['contact:phone'] || t['contact:mobile']), hrs: String(t.opening_hours || '').slice(0, 120), web: webOf(t), op: String(t.operator || '').slice(0, 80), em: em, ts: ts || 0 };
  }
  /* ===== مطارات ومعابر بحالة مؤكَّدة: بتحلّ مكان نسخ OSM القريبة منها =====
     الإحداثيات: ويكيبيديا. الحالة: المصدر والتاريخ مكتوبين على كل بند. عدّل الحالة هون بس تتغيّر. */
  var CST = { ok: ['يعمل', 'g'], part: ['يعمل جزئياً', 'y'], ped: ['مشاة فقط', 'y'], open: ['مفتوح', 'g'], closed: ['مغلق', 'r'] };
  var SRC_APP = 'إدارة دربك', SRC_LC = 'Logistics Cluster (تقرير معابر ومطارات سوريا)';
  var CUR = [
    { id: 'cur-dam', kind: 'airport', ar: 'مطار دمشق الدولي', en: 'Damascus International Airport', code: 'DAM / OSDI', lat: 33.41056, lon: 36.51417, st: 'ok', d: '2026-11-05', src: SRC_APP, r: 6000 },
    { id: 'cur-alp', kind: 'airport', ar: 'مطار حلب الدولي', en: 'Aleppo International Airport', code: 'ALP / OSAP', lat: 36.18056, lon: 37.22417, st: 'ok', d: '2026-11-05', src: SRC_APP, r: 6000 },
    { id: 'cur-dez', kind: 'airport', ar: 'مطار دير الزور', en: 'Deir ez-Zor Airport', code: 'DEZ / OSDZ', lat: 35.28528, lon: 40.17583, st: 'part', d: '2026-11-05', src: SRC_APP, r: 6000 },
    { id: 'cur-kac', kind: 'airport', ar: 'مطار القامشلي الدولي', en: 'Qamishli International Airport', code: 'KAC / OSKL', lat: 37.02056, lon: 41.19139, st: 'closed', d: '2026-11-05', src: SRC_APP, r: 6000 },
    { id: 'cur-ltk', kind: 'airport', ar: 'مطار اللاذقية الدولي', en: 'Latakia International Airport', code: 'LTK / OSLK', lat: 35.40083, lon: 35.94861, st: 'closed', d: '2026-11-05', src: SRC_APP, r: 6000 },
    { id: 'cur-nas', kind: 'crossing', ar: 'معبر نصيب – جابر (الأردن)', en: 'Nasib – Jaber crossing (Jordan)', lat: 32.5286, lon: 36.2008, st: 'ok', d: '2026-03-09', src: SRC_LC, r: 3000 },
    { id: 'cur-bah', kind: 'crossing', ar: 'معبر باب الهوى – جيلفه غوزو (تركيا)', en: 'Bab al-Hawa – Cilvegözü crossing (Türkiye)', lat: 36.230639, lon: 36.692639, st: 'ok', d: '2026-03-09', src: SRC_LC, r: 3000 },
    { id: 'cur-qaa', kind: 'crossing', ar: 'معبر البوكمال – القائم (العراق)', en: 'Abu Kamal – Al-Qa\'im crossing (Iraq)', lat: 34.4, lon: 40.98, st: 'open', d: '2026-03-09', src: SRC_LC, r: 3000, ap: 1 }
  ];
  function addCurated() {
    Object.keys(osm).forEach(function (k) { if (osm[k].fallback) delete osm[k]; });
    CUR.forEach(function (c) {
      Object.keys(osm).forEach(function (k) { var p = osm[k]; if (!p.cur && p.kind === c.kind && dist(p, c) < c.r) delete osm[k]; });
      osm[c.id] = { id: c.id, cur: 1, kind: c.kind, sub: c.kind === 'airport' ? 'مطار مدني' : 'معبر حدودي', lat: c.lat, lon: c.lon, name: LANG === 'en' ? c.en : c.ar, note: c.code ? 'رمز ' + c.code : '', fuel: '', ot: 'node', oid: 0, st: c.st, sd: Date.parse(c.d), ssrc: c.src, ap: c.ap || 0, ts: 0 };
    });
  }
  function curInfo(it) {
    var box = h('div', 'oinfo'), s = CST[it.st] || CST.open;
    var st = h('p', 'cst ' + s[1]); st.appendChild(document.createTextNode('الحالة: ' + s[0])); box.appendChild(st);
    var src = h('p', 'osmsrc'); src.appendChild(document.createTextNode('مصدر الحالة: ' + it.ssrc + ' · ' + fmtDate(it.sd)));
    src.appendChild(document.createTextNode('مصدر الموقع: ويكيبيديا' + (it.ap ? ' (موقع تقريبي)' : '')));
    if (Date.now() - it.sd > 90 * 86400000) src.appendChild(h('span', 'stale', 'الحالة ممكن تكون تغيّرت من هداك التاريخ، تحقق قبل السفر'));
    box.appendChild(src); return box;
  }
  function addOsm(els) { var n = 0; els.forEach(function (e) { var p = toPoi(e); if (p && !osm[p.id]) { osm[p.id] = p; n++; } }); if (n) addCurated(); return n; }

  var chain = Promise.resolve(), cellState = {}, osmErr = false, countryState = 'idle';
  function setOsmStat() {
    var n = Object.keys(osm).length, busy = countryState === 'loading' || Object.keys(cellState).some(function (k) { return cellState[k] === 'loading'; });
    var s = busy ? 'عم نحمّل بيانات OSM…' : (osmErr && !n ? 'تعذّر تحميل OSM، تأكد من النت وحرّك الخريطة' : 'مرافق OSM: ' + n);
    if (!busy && map.getZoom() < 10) s += ' · قرّب لتظهر الصيدليات والكازيات';
    $('mapStat').textContent = s;
  }
  /* ===== أسماء البلدات: أقرب مدينة/بلدة/قرية لأي نقطة (من OSM، مخزّنة على الجهاز) ===== */
  var PL = { grid: {}, n: 0 }, PLW = { c: 0.4, t: 0.6, v: 1, h: 1 };
  function plKey(la, lo) { return Math.floor(la * 10) + ',' + Math.floor(lo * 10); }
  function plAdd(a) { var k = plKey(a[0], a[1]); (PL.grid[k] = PL.grid[k] || []).push(a); PL.n++; }
  function plLoad() {
    var c = load('darbak.places.v1', null);
    if (c && c.items && Date.now() - c.ts < 30 * 86400000) { c.items.forEach(plAdd); return; }
    var PQ = '["place"~"^(city|town|village|hamlet)$"]["name"]';
    function take(j) {
      var items = [];
      (j.elements || []).forEach(function (e) {
        var t = e.tags || {}, nm = t['name:ar'] || t.name; if (e.lat == null || !nm || !inSyria({ lat: e.lat, lng: e.lon })) return;
        items.push([Math.round(e.lat * 1e4) / 1e4, Math.round(e.lon * 1e4) / 1e4, String(nm).slice(0, 40), (t.place || 'v')[0], String(t['name:en'] || '').slice(0, 40)]);
      });
      return items;
    }
    chain = chain.then(function () {
      return ovp('[out:json][timeout:90];area["ISO3166-1"="SY"][admin_level=2]->.a;node(area.a)' + PQ + ';out body;').then(function (j) {
        if (j.elements && j.elements.length) return j;
        return ovp('[out:json][timeout:90];node' + PQ + '(' + SYR.join(',') + ');out body;');
      }).then(function (j) {
        var items = take(j); if (!items.length) return;
        PL = { grid: {}, n: 0 }; items.forEach(plAdd); save('darbak.places.v1', { ts: Date.now(), items: items }); renderScreen(cur);
      }).catch(function () {});
    });
  }
  function plNear(p) {
    var ci = Math.floor(p.lat * 10), cj = Math.floor(p.lon * 10), best = null, bs = Infinity, bd = 0;
    for (var r = 1; r <= 3 && !best; r++) for (var di = -r; di <= r; di++) for (var dj = -r; dj <= r; dj++) {
      var arr = PL.grid[(ci + di) + ',' + (cj + dj)]; if (!arr) continue;
      for (var i = 0; i < arr.length; i++) { var a = arr[i], d = dist(p, { lat: a[0], lon: a[1] }), sc = d * (PLW[a[3]] || 1); if (sc < bs) { bs = sc; best = a; bd = d; } }
    }
    return best ? { a: best, d: bd } : null;
  }
  function placeLabel(p) {
    if (!PL.n) return govOf(p);
    var r = plNear(p); if (!r) return govOf(p);
    var nm = (LANG === 'en' && r.a[4]) ? r.a[4] : r.a[2], ty = { c: 'مدينة', t: 'بلدة', v: 'قرية', h: 'قرية' }[r.a[3]] || 'قرية';
    return (r.d <= 2500 ? ty + ' ' + nm : 'بالقرب من ' + nm) + ' · ' + govOf(p);
  }
  function loadCountry() {
    var c = load('darbak.osm.country.v4', null);
    if (c && c.items && Date.now() - c.ts < 12 * 3600 * 1000) { c.items.forEach(function (p) { if (!p.cur) osm[p.id] = p; }); addCurated(); countryState = 'done'; refreshO(); setOsmStat(); return; }
    countryState = 'loading'; setOsmStat();
    chain = chain.then(function () {
      return getPois(SYR, P_COUNTRY).then(function (j) {
        addOsm(j.elements || []); countryState = 'done'; osmErr = false;
        save('darbak.osm.country.v4', { ts: Date.now(), items: Object.keys(osm).map(function (k) { return osm[k]; }).filter(function (p) { return !p.cur; }) });
        refreshO(); setOsmStat(); renderScreen(cur);
      }).catch(function () {
        countryState = 'idle'; osmErr = true;
        if (!Object.keys(osm).length) {   /* احتياطي: مطارات رئيسية بمواقع تقريبية لما OSM ما يوصل */
          [['مطار دمشق الدولي', 33.4114, 36.5156], ['مطار حلب الدولي', 36.1807, 37.2244], ['مطار اللاذقية (باسل الأسد)', 35.4009, 35.9487], ['مطار القامشلي', 37.0206, 41.1914], ['مطار دير الزور', 35.2854, 40.1759]].forEach(function (a, i) {
            osm['fb' + i] = { id: 'fb' + i, kind: 'airport', lat: a[1], lon: a[2], name: a[0], note: 'موقع تقريبي (احتياطي). بيانات OSM ما انحمّلت.', fuel: '', ot: 'node', oid: 0, fallback: 1 };
          });
          addCurated(); refreshO(); renderScreen(cur);
        }
        setOsmStat();
      });
    });
  }
  function cellsInView() {
    var b = map.getBounds(), la0 = Math.max(32.2, b.getSouth()), la1 = Math.min(37.4, b.getNorth()), lo0 = Math.max(35.6, b.getWest()), lo1 = Math.min(42.4, b.getEast());
    if (la0 >= la1 || lo0 >= lo1) return [];
    var out = []; for (var i = Math.floor(la0 / .5); i <= Math.floor(la1 / .5); i++) for (var j = Math.floor(lo0 / .5); j <= Math.floor(lo1 / .5); j++) out.push([i, j]);
    return out.slice(0, 9);
  }
  function loadCells() {
    if (cur !== 'map') return;
    if (map.getZoom() < 10) { setOsmStat(); return; }
    cellsInView().forEach(function (c) {
      var k = c[0] + ',' + c[1]; if (cellState[k]) return; cellState[k] = 'loading';
      var bb = [c[0] * .5, c[1] * .5, c[0] * .5 + .5, c[1] * .5 + .5];
      chain = chain.then(function () {
        return getPois(bb, P_CELL).then(function (j) { addOsm(j.elements || []); cellState[k] = 'done'; osmErr = false; refreshO(); setOsmStat(); })
          .catch(function () { delete cellState[k]; osmErr = true; setOsmStat(); });
      });
    });
    setOsmStat();
  }
  map.on('moveend', loadCells);

  /* ===== الطقس (Open-Meteo) ===== */
  var wx = [];
  function wcode(c) {
    if (c === 0) return 'صافٍ'; if (c <= 3) return 'غائم جزئياً'; if (c === 45 || c === 48) return 'ضباب';
    if (c >= 51 && c <= 55) return 'رذاذ'; if (c === 56 || c === 57) return 'رذاذ متجمّد'; if (c >= 61 && c <= 65) return 'مطر';
    if (c === 66 || c === 67) return 'مطر متجمّد'; if (c >= 71 && c <= 77) return 'ثلج'; if (c >= 80 && c <= 82) return 'زخات مطر';
    if (c === 85 || c === 86) return 'زخات ثلج'; if (c >= 95) return 'عاصفة رعدية'; return '—';
  }
  function wicon(c, size, col) {
    var sun = '<circle cx="12" cy="12" r="4.5" fill="#ffb300" stroke="none"/><g stroke="#ffb300" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g>';
    var cloud = '<path d="M7 18a4 4 0 01.5-7.9A5 5 0 0117 12a3 3 0 01-.5 6z" fill="' + (col || '#cfd8dc') + '" stroke="none"/>';
    var inner;
    if (c === 0) inner = sun;
    else if (c <= 3) inner = '<g transform="translate(-3,-3) scale(.7)">' + sun + '</g>' + '<g transform="translate(2,2)">' + cloud + '</g>';
    else if (c === 45 || c === 48) inner = '<g stroke="#90a4ae" stroke-width="2" stroke-linecap="round"><path d="M4 8h13M7 12h13M4 16h13M7 20h10"/></g>';
    else if (c >= 71 && c <= 77 || c === 85 || c === 86) inner = cloud + '<g stroke="#4fc3f7" stroke-width="2" stroke-linecap="round"><path d="M9 20v.1M13 21v.1M17 20v.1"/></g>';
    else if (c >= 95) inner = cloud + '<path d="M12 14l-2 4h3l-1 4" stroke="#ffb300" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    else inner = cloud + '<g stroke="#1e88e5" stroke-width="2" stroke-linecap="round"><path d="M9 19l-1 2.5M13 19l-1 2.5M17 19l-1 2.5"/></g>';
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true">' + inner + '</svg>';
  }
  function visTxt(v) { return v == null ? '' : v >= 5000 ? 'الرؤية جيدة' : v >= 1000 ? 'الرؤية متوسطة' : 'الرؤية ضعيفة'; }
  function loadWx() {
    var u = 'https://api.open-meteo.com/v1/forecast?latitude=' + GOV.map(function (g) { return g.lat; }).join(',') + '&longitude=' + GOV.map(function (g) { return g.lon; }).join(',') +
      '&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto';
    return fetch(u).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      var arr = Array.isArray(j) ? j : [j];
      wx = arr.map(function (d, i) {
        var c = d.current || {}, code = c.weather_code, temp = c.temperature_2m, pr = c.precipitation || 0, vv = null;
        if (d.hourly && d.hourly.time && c.time) { var px = c.time.slice(0, 13); for (var k = 0; k < d.hourly.time.length; k++) if (d.hourly.time[k].slice(0, 13) === px) { vv = d.hourly.visibility[k]; break; } }
        var al = [];
        if (code === 45 || code === 48 || (vv != null && vv < 1000)) al.push({ k: 'fog', t: 'ضباب كثيف' + (vv != null ? ' (رؤية حوالي ' + Math.round(vv / 10) * 10 + ' م)' : '') });
        if (pr >= 4 || [65, 67, 82, 95, 96, 99].indexOf(code) > -1) al.push({ k: 'rain', t: 'أمطار غزيرة' + (pr ? ' (' + pr + ' مم)' : '') });
        if ([56, 57, 66, 67, 71, 73, 75, 77, 85, 86].indexOf(code) > -1 || (temp != null && temp <= 1.5 && (pr > 0 || (code >= 51 && code <= 67)))) al.push({ k: 'ice', t: 'خطر جليد' + (temp != null ? ' (حرارة ' + temp + '°)' : '') });
        var days = [];
        if (d.daily && d.daily.time) d.daily.time.forEach(function (t, n) { days.push({ d: t, max: d.daily.temperature_2m_max[n], min: d.daily.temperature_2m_min[n], code: d.daily.weather_code[n] }); });
        return { gov: GOV[i].n, lat: GOV[i].lat, lon: GOV[i].lon, temp: temp, feels: c.apparent_temperature, hum: c.relative_humidity_2m, code: code, wind: c.wind_speed_10m, vis: vv, al: al, days: days };
      });
      drawWx(); renderScreen(cur); updateBell();
    }).catch(function () { wxFail = true; renderScreen(cur); });
  }
  var wxFail = false;
  function wxOf(g) { for (var i = 0; i < wx.length; i++) if (wx[i].gov === g) return wx[i]; return null; }
  function drawWx() {
    layerW.clearLayers(); if (!vis.wx) return;
    wx.forEach(function (w) {
      w.al.forEach(function (a, i) {
        var mk = L.marker([w.lat + i * 0.05, w.lon + 0.05], { icon: pinR(a.k), title: a.t });
        mk.on('click', function () { toast(w.gov + ': ' + a.t + ' (توقعات Open-Meteo)'); }); mk.addTo(layerW);
      });
    });
  }

  /* ===== الشاشة الرئيسية ===== */
  /* ===== مؤثرات الطقس المتحركة حسب الحالة ===== */
  function wxFx(g, night) {
    var d = h('div', 'fx'), o = '', i;
    function drops(n, sp) { for (i = 0; i < n; i++) o += '<i class="drop" style="left:' + (i * 97 % 100) + '%;animation-duration:' + ((0.7 + ((i * 37) % 50) / 100) / sp).toFixed(2) + 's;animation-delay:-' + ((i * 53 % 100) / 100).toFixed(2) + 's"></i>'; }
    function flakes(n) { for (i = 0; i < n; i++) o += '<i class="flake" style="left:' + (i * 89 % 100) + '%;animation-duration:' + (3 + ((i * 31) % 30) / 10).toFixed(1) + 's;animation-delay:-' + ((i * 47 % 100) / 20).toFixed(1) + 's;width:' + (4 + i % 3 * 2) + 'px;height:' + (4 + i % 3 * 2) + 'px"></i>'; }
    function stars(n) { for (i = 0; i < n; i++) o += '<i class="star" style="left:' + ((i * 71 % 92) + 3) + '%;top:' + ((i * 29 % 55) + 6) + '%;animation-delay:-' + ((i % 6) * 0.4).toFixed(1) + 's"></i>'; }
    var clouds = '<i class="cloud c1"></i><i class="cloud c2"></i><i class="cloud c3"></i>';
    if (g === 'storm') { drops(24, 1.4); o += '<svg class="bolt" viewBox="0 0 40 70"><path d="M24 2L6 38h11l-5 30 22-42H21z" fill="#fff3a0" stroke="#ffd23d" stroke-width="1.5" stroke-linejoin="round"/></svg><div class="glow"></div><div class="dk">' + clouds + '</div>'; }
    else if (g === 'rain') { drops(18, 1); o += '<div class="dk">' + clouds + '</div>'; }
    else if (g === 'snow') { flakes(22); o += clouds; }
    else if (g === 'fog') { o += '<i class="band" style="top:30%"></i><i class="band" style="top:52%;animation-delay:-3s;animation-duration:12s"></i><i class="band" style="top:74%;animation-delay:-6s"></i>'; }
    else if (g === 'clear') { if (night) { stars(14); o += '<i class="moon"></i>'; } else o += '<div class="rays"></div><i class="sun"></i><i class="cloud c1 thin"></i>'; }
    else { if (night) { stars(8); o += '<div class="dk">' + clouds + '</div>'; } else o += clouds; }
    d.innerHTML = o; return d;
  }
  function wgroup(w) {   /* مجموعة الطقس لتلوين البطاقة */
    if (!w) return 'cloud'; var c = w.code, g = 'cloud';
    if (c === 0 || c === 1) g = 'clear'; else if (c === 2 || c === 3) g = 'cloud'; else if (c === 45 || c === 48) g = 'fog';
    else if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) g = 'rain'; else if ((c >= 71 && c <= 77) || c === 85 || c === 86) g = 'snow'; else if (c >= 95) g = 'storm';
    if (g !== 'storm' && g !== 'snow' && w.vis != null && w.vis < 1000) g = 'fog';
    return g;
  }
  function inGov(r) { return govOf(r) === gov; }
  function liveIn(type) { return reports.filter(function (r) { return live(r) && inGov(r) && (!type || r.type === type); }); }
  function renderHome() {
    var hr = new Date().getHours();
    $('greet').textContent = (hr < 12 ? 'صباح الخير' : hr < 18 ? 'مساء الخير' : 'مساء النور') + (profile.name ? (LANG === 'en' ? ', ' : ' يا ') + profile.name : '') + '، ' + gov;
    var w = wxOf(gov), box = $('homeWx'); box.textContent = ''; box.setAttribute('data-w', wgroup(w)); box.setAttribute('data-n', (hr < 6 || hr >= 19) ? '1' : '0'); box.appendChild(wxFx(wgroup(w), hr < 6 || hr >= 19));
    if (!w) { box.appendChild(h('span', 'c', wxFail ? 'تعذّر تحميل الطقس' : 'عم نحمّل الطقس…')); box.appendChild(h('span', 's', wxFail ? 'تأكد من النت وجرّب مرة تانية' : '')); }
    else {
      var l = h('div'); l.appendChild(h('div', 't', (w.temp != null ? Math.round(w.temp) : '—') + '°')); l.appendChild(h('div', 'c', wcode(w.code))); box.appendChild(l);
      var r = h('div'); r.innerHTML = wicon(w.code, 64); box.appendChild(r);
      box.appendChild(h('span', 's', gov + (visTxt(w.vis) ? ' · ' + visTxt(w.vis) : '') + ' · اضغط للتفاصيل'));
      if (w.al.length) { var al = h('div', 'al'); w.al.forEach(function (a) { al.appendChild(h('span', null, a.t)); }); box.appendChild(al); }
    }
    var nr = reports.filter(live).length, ns = Object.keys(osm).length - oldCount() + facs.filter(facOk).length;
    $('homeCounts').textContent = nr + ' بلاغ نشط · تتحدّث كل 15 ث';
    var tiles = $('tiles'); tiles.textContent = '';
    [['accident', 'الحوادث', 'accident', '#c62828'], ['blocked', 'الإغلاقات', 'blocked', '#e65100'], ['checkpoint', 'الازدحام', 'checkpoint', '#2a62b0'], ['wx', 'الطقس', 'wx', '#0b6e99']].forEach(function (x) {
      var b = h('button', 'tile'); b.type = 'button'; b.appendChild(circ(x[2], x[3])); b.appendChild(h('span', null, x[1]));
      b.appendChild(h('small', null, x[0] === 'wx' ? (w ? Math.round(w.temp) + '°' : '—') : liveIn(x[0]).length + ' بلاغ'));
      b.addEventListener('click', function () { if (x[0] === 'wx') go('wx'); else { feedType = x[0]; feedTab = 'all'; feedGov = gov; go('feed'); } });
      tiles.appendChild(b);
    });
    var ul = $('homeLatest'); ul.textContent = '';
    var lt = liveIn().sort(function (a, b) { return b.at - a.at; }).slice(0, 3);
    if (!lt.length) ul.appendChild(h('li', 'empty', 'ما في بلاغات فعّالة بـ' + gov + ' هلأ. إذا شفت شي على الطريق، اضغط + وبلّغ.'));
    lt.forEach(function (r) { ul.appendChild(rcard(r)); });
    var q = $('homeQuick'); q.textContent = '';
    var QL = { fuel: 'محروقات', hospital: 'مشافي', pharmacy: 'صيدليات', restaurant: 'مطاعم', police: 'شرطة وأمن طرق', rest: 'استراحات', hotel: 'فنادق', airport: 'مطارات' };
    ['fuel', 'hospital', 'pharmacy', 'restaurant', 'police', 'rest', 'hotel', 'airport'].forEach(function (k) {
      var b = h('button', 'qchip'); b.type = 'button'; b.innerHTML = svg(k, '#fff', 20); b.firstChild.style.background = F[k].c; b.appendChild(document.createTextNode(QL[k]));
      b.addEventListener('click', function () { svcKind = k; go('svc'); }); q.appendChild(b);
    });
    updateBell();
  }
  function updateBell() { $('bellDot').hidden = !reports.some(function (r) { return live(r) && R[r.type].alert; }); }

  /* ===== بطاقة بلاغ + شاشة البلاغات ===== */
  function rcard(r) {
    var b = h('button', 'rcard'); b.type = 'button';
    b.appendChild(circ(r.type, R[r.type].c));
    var t = h('div'); t.appendChild(h('h3', null, R[r.type].n + (r.road ? ' · ' + r.road : ''))); t.appendChild(h('p', 'meta pl', '📍 ' + (r.city || placeLabel(r)))); b.appendChild(t);
    var tg = h('div', 'tags'); tg.appendChild(h('span', 'tag', ago(r.at)));
    if (Date.now() - r.at < 3600000) tg.appendChild(h('span', 'tag new', 'جديد')); if (r.yes >= 3) tg.appendChild(h('span', 'tag ok', 'مؤكد')); if (r.seed) tg.appendChild(h('span', 'tag warn', 'مثال'));
    b.appendChild(tg);
    if (r.note) { var n = h('p', 'more meta', r.note); b.appendChild(n); }
    b.addEventListener('click', function () { openOnMap(r.lat, r.lon, 'reports', r.id, 15); });
    var li = h('li'); li.appendChild(b); return li;
  }
  function renderFeed() {
    var sel = $('feedGov'); sel.value = feedGov;
    var tabs = $('feedTabs'); tabs.textContent = '';
    [['all', 'الكل'], ['new', 'جديدة'], ['ok', 'مؤكدة']].forEach(function (x) {
      var b = h('button', null, x[1]); b.type = 'button'; b.setAttribute('aria-pressed', feedTab === x[0] ? 'true' : 'false');
      b.addEventListener('click', function () { feedTab = x[0]; renderFeed(); }); tabs.appendChild(b);
    });
    var ul = $('feedList'); ul.textContent = '';
    var rs = reports.filter(function (r) { return live(r) && (!feedType || r.type === feedType) && (!feedGov || govOf(r) === feedGov) && (feedTab === 'all' || (feedTab === 'new' ? Date.now() - r.at < 3600000 : r.yes >= 3)); }).sort(function (a, b) { return b.at - a.at; });
    if (!rs.length) { ul.appendChild(h('li', 'empty', 'ما في بلاغات هون هلأ.')); return; }
    rs.forEach(function (r) { ul.appendChild(rcard(r)); });
  }

  /* ===== شاشة الطقس ===== */
  function renderWxScreen() {
    $('wxGov').value = gov;
    var box = $('wxBody'); box.textContent = '';
    var w = wxOf(gov);
    if (!w) { box.appendChild(h('p', 'empty', wxFail ? 'تعذّر تحميل الطقس، تأكد من النت.' : 'عم نحمّل الطقس…')); return; }
    var big = h('div', 'wxbig'); big.setAttribute('data-w', wgroup(w)); var hr2 = new Date().getHours(); big.setAttribute('data-n', (hr2 < 6 || hr2 >= 19) ? '1' : '0'); big.appendChild(wxFx(wgroup(w), hr2 < 6 || hr2 >= 19)); var ic = h('div'); ic.innerHTML = wicon(w.code, 76); big.appendChild(ic);
    big.appendChild(h('div', 't', (w.temp != null ? Math.round(w.temp) : '—') + '°')); big.appendChild(h('b', null, wcode(w.code)));
    var st = h('div', 'wxstats');
    [[w.hum != null ? w.hum + '%' : '—', 'الرطوبة'], [w.wind != null ? Math.round(w.wind) + ' كم/س' : '—', 'الرياح'], [w.feels != null ? Math.round(w.feels) + '°' : '—', 'الشعور']].forEach(function (x) { var d = h('div'); d.appendChild(h('b', null, x[0])); d.appendChild(h('span', null, x[1])); st.appendChild(d); });
    big.appendChild(st);
    if (visTxt(w.vis)) big.appendChild(h('p', 'meta', visTxt(w.vis)));
    if (w.al.length) { var tg = h('div', 'tags'); w.al.forEach(function (a) { tg.appendChild(h('span', 'tag warn', a.t)); }); big.appendChild(tg); }
    box.appendChild(big);
    box.appendChild(h('h2', null, 'توقعات الأيام القادمة')); box.lastChild.style.cssText = 'font-size:17px;margin:14px 0 8px';
    var ds = h('div', 'days');
    w.days.forEach(function (d, i) {
      var c = h('div', 'day'); var nm = i === 0 ? 'اليوم' : new Date(d.d + 'T12:00:00').toLocaleDateString(LANG === 'en' ? 'en' : 'ar', { weekday: 'long' });
      c.appendChild(h('span', null, nm)); var ic2 = h('div'); ic2.innerHTML = wicon(d.code, 30); c.appendChild(ic2);
      c.appendChild(h('b', null, Math.round(d.max) + '°')); c.appendChild(h('span', null, Math.round(d.min) + '°')); ds.appendChild(c);
    });
    box.appendChild(ds);
  }

  /* ===== بحث الخريطة: مرافق + محافظات + أي بلدة/قرية/شارع بسوريا (Nominatim) ===== */
  var mqT = null, mqSeq = 0;
  function searchLocal(q) {
    var out = [], ql = q.toLowerCase();
    GOV.forEach(function (g) { if (g.n.toLowerCase().indexOf(ql) > -1) out.push({ n: g.n, s: 'محافظة', lat: g.lat, lon: g.lon, z: 11 }); });
    facs.forEach(function (f) { if (facOk(f) && (f.name || '').toLowerCase().indexOf(ql) > -1) out.push({ n: f.name, s: F[f.kind].n + ' · ' + govOf(f), lat: f.lat, lon: f.lon, z: 17, t: 'facilities', id: f.id }); });
    Object.keys(osm).forEach(function (id) { var p = osm[id]; if (out.length < 12 && F[p.kind] && !oldO(p) && (p.name || '').toLowerCase().indexOf(ql) > -1) out.push({ n: p.name, s: F[p.kind].n + ' · ' + govOf(p), lat: p.lat, lon: p.lon, z: 17, t: 'osm', id: id }); });
    if (ql.length > 1 && PL.n) { var pc = 0; Object.keys(PL.grid).some(function (k) { return PL.grid[k].some(function (a) { var nm = (LANG === 'en' && a[4]) ? a[4] : a[2]; if (nm.toLowerCase().indexOf(ql) > -1) { out.unshift({ n: nm, s: ({ c: 'مدينة', t: 'بلدة', v: 'قرية', h: 'قرية' }[a[3]] || 'قرية') + ' · ' + govOf({ lat: a[0], lon: a[1] }), lat: a[0], lon: a[1], z: a[3] === 'c' ? 12 : 14 }); pc++; } return pc >= 5; }); }); }
    return out.slice(0, 8);
  }
  function showRes(list, loading) {
    var ul = $('mres'); ul.textContent = ''; ul.hidden = false;
    list.forEach(function (r) {
      var li = h('li'), b = h('button'); b.type = 'button'; b.appendChild(h('b', null, r.n)); b.appendChild(h('small', null, r.s));
      b.addEventListener('click', function () {
        ul.hidden = true; $('mq').blur(); go('map');
        if (r.t) openOnMap(r.lat, r.lon, r.t, r.id, r.z); else map.setView([r.lat, r.lon], r.z);
      });
      li.appendChild(b); ul.appendChild(li);
    });
    if (loading) ul.appendChild(h('li', 'sm', 'عم نبحث بسوريا…'));
    else if (!list.length) ul.appendChild(h('li', 'sm', 'ما لقينا نتيجة. جرّب اسم تاني.'));
  }
  function searchRemote(q, seq, base) {
    if (!online) return;
    var u = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&countrycodes=sy&accept-language=ar&bounded=1&viewbox=35.6,37.4,42.4,32.2&q=' + encodeURIComponent(q);
    fetch(u).then(function (r) { return r.json(); }).then(function (a) {
      if (seq !== mqSeq) return;
      var extra = (a || []).filter(function (x) { return inSyria({ lat: +x.lat, lng: +x.lon }); }).map(function (x) {
        var parts = String(x.display_name || '').split('،'); var nm = (x.name || parts[0] || '').trim();
        return { n: nm, s: (parts.slice(1, 3).join('،').trim()) || 'موقع', lat: +x.lat, lon: +x.lon, z: /city|town|village|suburb|neighbourhood|hamlet/.test(x.addresstype || x.type || '') ? 13 : 16 };
      });
      var seen = {}; base.forEach(function (b) { seen[b.n] = 1; });
      showRes(base.concat(extra.filter(function (e) { return e.n && !seen[e.n]; })).slice(0, 12), false);
    }).catch(function () { if (seq === mqSeq) showRes(base, false); });
  }
  $('mq').addEventListener('input', function () {
    var q = this.value.trim(); clearTimeout(mqT); mqSeq++;
    if (q.length < 2) { $('mres').hidden = true; return; }
    var seq = mqSeq, base = searchLocal(q); showRes(base, true);
    mqT = setTimeout(function () { searchRemote(q, seq, base); }, 450);
  });
  $('mq').addEventListener('focus', function () { if (this.value.trim().length >= 2) $('mres').hidden = false; });
  document.addEventListener('click', function (e) { if (!e.target.closest('#msearch')) $('mres').hidden = true; });

  /* ===== شاشة الخدمات ===== */
  var svcKind = null, svcNear = false, svcSrc = 'all';
  var SG = [['fuel', 'محروقات', ['fuel']], ['hospital', 'مشافي ومراكز طبية', ['hospital']], ['pharmacy', 'صيدليات', ['pharmacy']], ['restaurant', 'مطاعم ومقاهي', ['restaurant']], ['rest', 'استراحات الطرق', ['rest']], ['hotel', 'فنادق وإقامة', ['hotel']], ['police', 'شرطة وأمن طرق', ['police']], ['airport', 'مطارات مدنية', ['airport']], ['bakery', 'مخابز', ['bakery']], ['exchange', 'مكاتب صرافة', ['exchange']], ['emg', 'إسعاف وإطفاء', ['ambulance', 'fire']], ['municipality', 'بلديات', ['municipality']], ['registry', 'دوائر نفوس', ['registry']], ['crossing', 'معابر حدودية', ['crossing']]];
  function sgHas(kind) { for (var i = 0; i < SG.length; i++) if (SG[i][0] === svcKind) return SG[i][2].indexOf(kind) > -1; return true; }
  $('svcQ').addEventListener('input', function () { renderSvc(); });
  $('svcNear').addEventListener('click', function () {
    if (svcNear) { svcNear = false; renderSvc(); return; }
    function on() { svcNear = true; renderSvc(); }
    if (me) { on(); return; }
    if (!navigator.geolocation) { toast('المتصفح ما بيدعم تحديد الموقع'); return; }
    toast('عم نحدد موقعك…');
    navigator.geolocation.getCurrentPosition(function (p) { me = { lat: p.coords.latitude, lon: p.coords.longitude }; on(); }, function () { toast('فعّل صلاحية الموقع لترتيب الأقرب'); }, { enableHighAccuracy: true, timeout: 12000 });
  });
  function renderSvc() {
    $('svcGov').value = gov;
    var box = $('kinds'); box.textContent = '';
    var cur = null; SG.forEach(function (g) { if (g[0] === svcKind) cur = g; });
    box.className = 'kinds' + (cur ? ' col' : '');
    function tile(g, big) {
      var k0 = g[2][0], b = h('button', big ? 'kbar' : null); b.type = 'button';
      var ic = h('span', 'ki'); ic.style.background = F[k0].c; ic.innerHTML = svg(k0, '#fff', big ? 20 : 22); b.appendChild(ic);
      b.appendChild(h('span', 'kl', big ? 'النوع: ' + g[1] : g[1]));
      if (big) b.appendChild(h('span', 'kchg', 'تغيير ▾'));
      b.addEventListener('click', function () { svcKind = big ? null : g[0]; svcFA = ''; renderSvc(); });
      box.appendChild(b);
    }
    if (cur) tile(cur, true); else SG.forEach(function (g) { tile(g, false); });
    var sb = $('svcSrc'); sb.textContent = '';
    [['all', 'الكل'], ['user', 'أضافها المستخدمون'], ['osm', 'OpenStreetMap']].forEach(function (x) { var b = h('button', null, x[1]); b.type = 'button'; b.setAttribute('aria-pressed', svcSrc === x[0] ? 'true' : 'false'); b.addEventListener('click', function () { svcSrc = x[0]; renderSvc(); }); sb.appendChild(b); });
    var ul = $('svcList'); ul.textContent = '';
    if (svcKind === 'fuel' && remote) {
      var fr = h('li', 'fseg'), fs = h('div', 'seg'); fs.setAttribute('role', 'group'); fs.setAttribute('aria-label', 'فلتر المحروقات');
      [['', 'الكل'], ['petrol', 'بنزين متوفر'], ['diesel', 'مازوت متوفر'], ['gas', 'غاز متوفر']].forEach(function (x) {
        var b = h('button', null, x[1]); b.type = 'button'; b.setAttribute('aria-pressed', svcFA === x[0] ? 'true' : 'false');
        b.addEventListener('click', function () { svcFA = x[0]; renderSvc(); }); fs.appendChild(b);
      });
      fr.appendChild(fs); ul.appendChild(fr);
    }
    var rows = [], q = ($('svcQ').value || '').trim().toLowerCase();
    function qok(f) { return !q || ((f.name || '') + ' ' + (f.sub || '') + ' ' + F[f.kind].n + ' ' + placeLabel(f)).toLowerCase().indexOf(q) > -1; }
    if (svcSrc !== 'osm') facs.forEach(function (f) { if (facOk(f) && govOf(f) === gov && (!svcKind || sgHas(f.kind)) && qok(f)) rows.push({ t: 'facilities', it: f, user: 1 }); });
    if (svcSrc !== 'user') Object.keys(osm).forEach(function (id) { var p = osm[id]; if (!oldO(p) && (!svcKind || sgHas(p.kind)) && govOf(p) === gov && qok(p)) rows.push({ t: 'osm', it: p }); });
    $('svcNear').setAttribute('aria-pressed', svcNear && me ? 'true' : 'false');
    if (!rows.length) { ul.appendChild(h('li', 'empty', Object.keys(osm).length ? 'ما في خدمات بهاي المحافظة بالنوع المختار.' + (oldCount() ? ' (فيه ' + oldCount() + ' خدمة قديمة مخفية، بتقدر تظهرها من حسابي.)' : '') : (osmErr ? 'تعذّر تحميل بيانات OpenStreetMap، تأكد من النت.' : 'عم نحمّل البيانات من OpenStreetMap…'))); return; }
    if (svcKind === 'fuel' && remote && svcFA) {
      if (!fuelSkip) { fuelLoad(rows.map(function (r) { return r.it.id; }), function () { fuelSkip = true; renderSvc(); fuelSkip = false; }); ul.appendChild(h('li', 'empty', 'عم نجيب حالة المحروقات…')); return; }
      rows = rows.filter(function (r) { var s = fcache[r.it.id]; return s && s.d[svcFA] && s.d[svcFA].a; });
      if (!rows.length) { ul.appendChild(h('li', 'empty', 'ما في كازيات مبلَّغ إنها متوفرة بهاد النوع هلأ.')); return; }
    }
    if (svcNear && me) rows.forEach(function (rw) { rw.d = dist(me, rw.it); });
    rows.sort(function (a, b) { return (svcNear && me) ? a.d - b.d : ((b.user || 0) - (a.user || 0) || (a.it.name || '').localeCompare(b.it.name || '', 'ar')); });
    var total = rows.length; rows = rows.slice(0, 120);
    var fslots = [];
    rows.forEach(function (rw) {
      var f = rw.it, c = h('div', 'rcard');
      c.appendChild(circ(f.kind, F[f.kind].c));
      var t = h('div'); t.appendChild(h('h3', null, f.name || f.sub || F[f.kind].n)); var tg = h('div', 'tags'); tg.appendChild(h('span', 'tag', f.sub || F[f.kind].n)); if (rw.d != null) tg.appendChild(h('span', 'tag', rw.d < 1000 ? Math.round(rw.d / 10) * 10 + ' م' : (rw.d / 1000).toFixed(1) + ' كم')); tg.appendChild(h('span', 'tag pl', '📍 ' + placeLabel(f))); if (rw.t === 'osm' && f.cur) tg.appendChild(h('span', 'tag cst ' + (CST[f.st] || CST.open)[1], (CST[f.st] || CST.open)[0])); else if (rw.t === 'osm') tg.appendChild(h('span', 'tag osm', 'OSM')); t.appendChild(tg); c.appendChild(t);
      if (f.fuel) c.appendChild(h('p', 'more', (rw.t === 'osm' ? 'بيبيع: ' : 'متوفر: ') + f.fuel.replace(/,/g, '،')));
      if (hasStat(f.kind) && remote) { var fsl = h('div', 'fstat more'); c.appendChild(fsl); fslots.push([f.id, fsl, f.kind]); }
      if (f.kind === 'exchange') c.appendChild(h('p', 'warnbox', EXW));
      if (rw.t === 'osm' && !f.fallback) c.appendChild(osmInfo(f, true));
      if (f.note) c.appendChild(h('p', 'more meta', f.note));
      var row = h('div', 'row more'), go1 = h('button', 'btn', 'أظهر على الخريطة'), rt = h('button', 'btn blue', 'رسم المسار'); go1.type = rt.type = 'button';
      go1.addEventListener('click', function () { openOnMap(f.lat, f.lon, rw.t, f.id, 16); });
      rt.addEventListener('click', function () { go('map'); routeTo(f.lat, f.lon); });
      row.appendChild(go1); row.appendChild(rt); c.appendChild(row);
      var li = h('li'); li.appendChild(c); ul.appendChild(li);
    });
    if (fslots.length) fuelLoad(fslots.map(function (x) { return x[0]; }), function () { fslots.forEach(function (x) { x[1].textContent = ''; x[1].appendChild(fuelChips(x[0], false, x[2])); }); });
    if (total > rows.length) ul.appendChild(h('li', 'empty', 'عم نعرض أول ' + rows.length + ' من ' + total + '. اختار نوع محدد لتضيّق النتائج.'));
  }

  /* ===== المزيد + بلاغاتي ===== */
  var installEv = null;
  function standalone() { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream; }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEv = e; renderMore(); });
  window.addEventListener('appinstalled', function () { installEv = null; renderMore(); toast('تثبّت دربك'); });
  function renderMore() {
    var m = $('moreMenu'); m.textContent = '';
    var mine = reports.filter(isMine).length + facs.filter(isMine).length;
    function row(icon, title, sub, fn, pressed) {
      var b = h('button', 'mrow'); b.type = 'button'; var i = h('span', 'mi'); i.innerHTML = icon.charAt(0) === '<' ? icon : svg(icon, 'currentColor', 21); b.appendChild(i);
      b.appendChild(h('b', null, title)); if (sub) b.appendChild(h('small', null, sub)); if (fn) { b.appendChild(h('span', 'ch', '‹')); b.addEventListener('click', fn); }
      if (pressed != null) b.setAttribute('aria-pressed', pressed ? 'true' : 'false'); m.appendChild(b); return b;
    }
    if (!standalone() && (installEv || isIOS())) row('home', 'ثبّت دربك على هاتفك', isIOS() && !installEv ? 'شاركة ثم أضف للشاشة الرئيسية' : 'بيفتح مثل أي تطبيق', function () {
      if (installEv) { installEv.prompt(); installEv.userChoice.then(function () { installEv = null; renderMore(); }); }
      else toast('بسفاري: اضغط زر المشاركة ثم "إضافة إلى الشاشة الرئيسية"');
    });
    row('user', 'حسابي', session ? session.email : (profile.name || 'الملف الشخصي'), function () { go('acct'); });
    row('mine', 'بلاغاتي', mine ? mine + '' : '', function () { go('mine'); });
    row('bell', 'كل التنبيهات النشطة', reports.filter(live).length + '', function () { feedType = null; feedTab = 'all'; feedGov = ''; go('feed'); });
    row('wx', 'الطقس', '', function () { go('wx'); });
    row('drive', 'وضع القيادة', watchId == null ? 'متوقّف' : 'شغّال', function () { if (watchId == null) startDrive(); else stopDrive(); renderMore(); }, watchId != null);
    row(LANG === 'en' ? FLAG_EN : FLAG_SY, 'اللغة', LANG === 'en' ? 'English ⇄ العربية' : 'العربية · English', function () { setLang(LANG === 'en' ? 'ar' : 'en'); });
    row('info', 'الدعم والمعلومات', 'من نحن، الشروط، الخصوصية، تواصل', openInfo);
  }
  function renderMine() {
    var ul = $('mineList'); ul.textContent = '';
    var mr = reports.filter(function (r) { return isMine(r) && R[r.type]; }), mf = facs.filter(function (f) { return isMine(f) && F[f.kind]; });
    if (!mr.length && !mf.length) { ul.appendChild(h('li', 'empty', 'ما أضفت شي لسا. اضغط + تحت وأضف أول بلاغ.')); return; }
    function del(table, it, c) {
      var b = h('button', 'btn danger', 'احذف'); b.type = 'button'; var armed = false;
      b.addEventListener('click', function (e) { e.stopPropagation(); if (!armed) { armed = true; b.textContent = 'اضغط مرة تانية للحذف'; return; } deleteItem(table, it); });
      var row = h('div', 'row more'); row.appendChild(b); c.appendChild(row);
    }
    mr.sort(function (a, b) { return b.at - a.at; }).forEach(function (r) { var li = rcard(r), c = li.firstChild; del('reports', r, c); ul.appendChild(li); });
    mf.sort(function (a, b) { return b.at - a.at; }).forEach(function (f) {
      var c = h('div', 'rcard'); c.appendChild(circ(f.kind, F[f.kind].c)); var t = h('div'); t.appendChild(h('h3', null, f.name)); t.appendChild(h('p', 'meta', F[f.kind].n + ' · ' + placeLabel(f))); c.appendChild(t);
      del('facilities', f, c); var li = h('li'); li.appendChild(c); ul.appendChild(li);
    });
  }

  /* ===== بطاقة التفاصيل على الخريطة ===== */
  function voteRow(table, it) {
    var wrap = h('div', 'row'), mine = votes[it.id], isF = table === 'facilities';
    var y = h('button', 'btn', (isF ? 'معلومة صحيحة' : 'لسا موجود') + ' (' + it.yes + ')'), n = h('button', 'btn', (isF ? 'غير صحيحة' : 'ما عاد موجود') + ' (' + it.no + ')');
    y.type = n.type = 'button';
    if (mine) { y.disabled = n.disabled = true; (mine === 'y' ? y : n).classList.add('primary'); }
    y.addEventListener('click', function () { if (!votes[it.id] && canWrite()) { voteItem(table, it, true); toast('شكراً، تأكيدك بيساعد غيرك'); } });
    n.addEventListener('click', function () { if (!votes[it.id] && canWrite()) { voteItem(table, it, false); toast('شكراً'); } });
    wrap.appendChild(y); wrap.appendChild(n); return wrap;
  }
  function ownerRow(table, it) {
    var wrap = h('div', 'row');
    var ed = h('button', 'btn', 'عدّل التفاصيل'), del = h('button', 'btn danger', 'احذف'); ed.type = del.type = 'button'; var armed = false;
    ed.addEventListener('click', function () {
      var ta = h('textarea'); ta.maxLength = 140; ta.value = it.note || '';
      var ok = h('button', 'btn primary', 'احفظ'); ok.type = 'button';
      var row = h('div', 'row'); row.appendChild(ok); wrap.replaceWith(ta); ta.after(row);
      ok.addEventListener('click', function () { editNote(table, it, ta.value.trim().slice(0, 140)); toast('انحفظ التعديل'); });
    });
    del.addEventListener('click', function () { if (!armed) { armed = true; del.textContent = 'اضغط مرة تانية للحذف'; return; } deleteItem(table, it); toast('انحذف'); });
    wrap.appendChild(ed); wrap.appendChild(del); return wrap;
  }
  /* ===== حالة المحروقات: بنزين / مازوت / غاز (متوفر أو غير متوفر) ===== */
  var FT = [['petrol', 'بنزين'], ['diesel', 'مازوت'], ['gas', 'غاز']], FTS = { fuel: FT, bakery: [['bread', 'الخبز']] }, fcache = {}, fuelSkip = false, svcFA = '';
  function hasStat(k) { return k === 'fuel' || k === 'bakery'; }
  var EXW = '⚠ دربك بيعرض موقع المكان بس، ما بيعرض أسعار صرف. تأكد من الجهة قبل أي تعامل.';
  function fuelLoad(ids, cb) {
    if (!remote) { cb(); return; }
    var need = ids.filter(function (i) { return !fcache[i] || Date.now() - fcache[i].t > 60000; });
    if (!need.length) { cb(); return; }
    var chunks = []; for (var i = 0; i < need.length; i += 50) chunks.push(need.slice(i, i + 50));
    Promise.all(chunks.map(function (c) {
      return rpc('fuel_status', { p_ids: c }).then(function (rows) {
        c.forEach(function (id) { fcache[id] = { t: Date.now(), d: {} }; });
        (rows || []).forEach(function (r) { if (fcache[r.station]) fcache[r.station].d[r.ftype] = { a: r.avail, at: Number(r.at), n: r.n }; });
      });
    })).then(function () { cb(); }, function () { cb(); });
  }
  function fuelChips(id, withTime, kind) {
    var FX = FTS[kind || 'fuel'], box = h('div', 'fchips'), d = (fcache[id] && fcache[id].d) || {}, any = false;
    FX.forEach(function (f) {
      var s = d[f[0]], c = h('span', 'fchip ' + (s ? (s.a ? 'ok' : 'bad') : 'unk'));
      c.textContent = f[1] + ': ' + (s ? (s.a ? 'متوفر ✓' : 'غير متوفر ✕') : 'ما في معلومة');
      if (s) any = true; box.appendChild(c);
    });
    if (withTime && any) {
      var t = 0, n = 0; FX.forEach(function (f) { var s = d[f[0]]; if (s) { t = Math.max(t, s.at); n = Math.max(n, s.n); } });
      box.appendChild(h('span', 'fnote', 'آخر تحديث ' + ago(t) + (n > 1 ? ' · أكّده ' + n : '')));
    } else if (withTime) box.appendChild(h('span', 'fnote', kind === 'bakery' ? 'ما حدا حدّث حالة هاد الفرن بآخر 12 ساعة' : 'ما حدا حدّث حالة هاي الكازية بآخر 12 ساعة'));
    return box;
  }
  function fuelReportBox(it) {
    var bk = it.kind === 'bakery', FX = FTS[bk ? 'bakery' : 'fuel'], box = h('div', 'fbox'), sel = {}, btns = [];
    box.appendChild(h('h4', null, bk ? 'هل الخبز متوفر هلأ؟ حدّث الحالة' : 'شو الوضع هلأ؟ حدّث الحالة'));
    FX.forEach(function (f) {
      var row = h('div', 'frow'); row.appendChild(h('span', 'fl', f[1]));
      [[true, 'متوفر', 'ok'], [false, 'غير متوفر', 'bad']].forEach(function (o) {
        var b = h('button', 'fb ' + o[2], o[1]); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () { var was = sel[f[0]] === o[0]; delete sel[f[0]]; if (!was) sel[f[0]] = o[0]; btns.forEach(function (x) { x.b.setAttribute('aria-pressed', sel[x.f] === x.v ? 'true' : 'false'); }); });
        btns.push({ b: b, f: f[0], v: o[0] }); row.appendChild(b);
      });
      box.appendChild(row);
    });
    var send = h('button', 'btn blue', 'أرسل التحديث'); send.type = 'button';
    send.addEventListener('click', function () {
      if (!canWrite()) return;
      if (!Object.keys(sel).length) { toast('اختار حالة وحدة على الأقل'); return; }
      if (!navigator.geolocation) { toast('المتصفح ما بيدعم تحديد الموقع'); return; }
      toast(bk ? 'عم نتأكد إنك قريب من الفرن…' : 'عم نتأكد إنك قريب من الكازية…'); send.disabled = true;
      navigator.geolocation.getCurrentPosition(function (p) {
        function v(k) { return sel[k] == null ? null : sel[k]; }
        (bk ? rpc('report_bread', { p_station: it.id, p_lat: it.lat, p_lon: it.lon, p_ulat: p.coords.latitude, p_ulon: p.coords.longitude, p_avail: v('bread') })
          : rpc('report_fuel', { p_station: it.id, p_lat: it.lat, p_lon: it.lon, p_ulat: p.coords.latitude, p_ulon: p.coords.longitude, p_petrol: v('petrol'), p_diesel: v('diesel'), p_gas: v('gas') }))
          .then(function () { delete fcache[it.id]; toast('شكراً! انحفظت المعلومة'); if (selected && selected.id === it.id) renderDetail(); })
          .catch(function (e) { send.disabled = false; toast(errMsg(e)); });
      }, function () { send.disabled = false; toast(bk ? 'فعّل صلاحية الموقع لنتأكد إنك قريب من الفرن' : 'فعّل صلاحية الموقع لنتأكد إنك قريب من الكازية'); }, { enableHighAccuracy: true, timeout: 12000 });
    });
    box.appendChild(send);
    box.appendChild(h('p', 'meta', bk ? 'بس يلي بكون قريب من الفرن (أقل من 1.5 كم) بيقدر يحدّث حالته.' : 'بس يلي بكون قريب من الكازية (أقل من 1.5 كم) بيقدر يحدّث حالتها.'));
    return box;
  }

  /* ===== معلومات المكان من OSM + تاريخ آخر تعديل ===== */
  function osmInfo(it, compact) {
    if (it.cur) return curInfo(it);
    var box = h('div', 'oinfo');
    function row(k, label, val, href) {
      var d = h('div', 'orow'); d.innerHTML = svg(k, 'currentColor', 17);
      var sp = h('span'); if (label) sp.appendChild(document.createTextNode(label + ': '));
      if (href) { var a = h('a', null, val); a.href = href; if (/^tel:/.test(href)) { a.dir = 'ltr'; a.style.unicodeBidi = 'isolate'; } if (/^http/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } sp.appendChild(a); } else sp.appendChild(document.createTextNode(val));
      d.appendChild(sp); box.appendChild(d);
    }
    if (it.addr) row('map', 'العنوان', it.addr);
    if (it.ph) row('phone', 'الهاتف', it.ph, 'tel:' + it.ph);
    if (it.hrs) row('clock', 'الدوام', it.hrs);
    if (it.em && it.kind === 'hospital') row('hospital', '', 'قسم إسعاف متوفر');
    if (!compact && it.op) row('user', 'الجهة', it.op);
    if (!compact && it.web) row('globe', 'الموقع', it.web.replace(/^https?:\/\//, '').slice(0, 40), it.web);
    var src = h('p', 'osmsrc'); src.appendChild(document.createTextNode('المصدر: OpenStreetMap' + (it.ts ? ' · آخر تعديل على السجل: ' + fmtDate(it.ts) : '')));
    if (it.ts && Date.now() - it.ts > STALE_MS) src.appendChild(h('span', 'stale', 'معلومات قد تكون قديمة، تحقق قبل ما تروح'));
    box.appendChild(src);
    return box;
  }
  function renderDetail() {
    var box = $('detail'), it = findSel(), t = selected && selected.t;
    var okR = it && t === 'reports' && live(it), okF = it && t === 'facilities' && facOk(it), okO = it && t === 'osm';
    if (!okR && !okF && !okO) { box.hidden = true; return; }
    var isR = t === 'reports', key = isR ? it.type : it.kind;
    box.textContent = ''; box.hidden = false;
    var x = h('button', 'x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'إغلاق'); x.addEventListener('click', function () { selected = null; renderDetail(); });
    var title = h('h3'); title.innerHTML = svg(key, 'var(--c-' + key + ')', 26); title.appendChild(document.createTextNode(isR ? R[key].n + (it.road ? ' · ' + it.road : '') : (it.name || F[key].n)));
    box.appendChild(x); box.appendChild(title);
    var tags = h('div', 'tags');
    if (!isR) tags.appendChild(h('span', 'tag', it.sub || F[key].n));
    tags.appendChild(h('span', 'tag', '📍 ' + (it.city || placeLabel(it))));
    if (okO && it.cur) tags.appendChild(h('span', 'tag cst ' + (CST[it.st] || CST.open)[1], (CST[it.st] || CST.open)[0]));
    else if (okO) tags.appendChild(h('span', 'tag osm', 'من OpenStreetMap'));
    if (it.seed) tags.appendChild(h('span', 'tag warn', 'مثال للتجربة'));
    box.appendChild(tags);
    if (!isR && it.fuel) box.appendChild(h('p', null, (okO ? 'بيبيع (حسب OSM): ' : 'متوفر: ') + it.fuel.replace(/,/g, '،')));
    if (hasStat(key) && remote) { var fsb = h('div', 'fstat'); box.appendChild(fsb); fuelLoad([it.id], function () { if (selected && selected.id === it.id) { fsb.textContent = ''; fsb.appendChild(fuelChips(it.id, true, key)); } }); }
    var ph = isR ? getPhoto(it) : null;
    if (ph) { var im = h('img'); im.src = ph; im.alt = 'صورة'; box.appendChild(im); }
    else if (isR && it.has_photo) { loadPhoto(it, function () { if (selected && selected.id === it.id) renderDetail(); }); box.appendChild(h('p', 'meta', 'عم نحمّل الصورة…')); }
    if (it.note) box.appendChild(h('p', null, it.note));
    if (okO && it.cur) box.appendChild(osmInfo(it, false));
    else if (okO) { if (!it.fallback) box.appendChild(osmInfo(it, false)); box.appendChild(h('p', 'meta', 'ما في حالة لحظية (مفتوح/مسكّر) بهاي البيانات. إذا شفت المعلومة غلط، بلّغ عنها.')); }
    else box.appendChild(h('p', 'meta', isR ? ago(it.at) + ' · ' + left(it) : 'أضيف ' + ago(it.at)));
    var row = h('div', 'row'), g = h('button', 'btn blue', 'رسم المسار'); g.type = 'button'; g.addEventListener('click', function () { routeTo(it.lat, it.lon); });
    row.appendChild(g);
    if (okO && !it.fallback && !it.cur) { var a = h('a', 'btn', 'افتح على OSM'); a.href = 'https://www.openstreetmap.org/' + it.ot + '/' + it.oid; a.target = '_blank'; a.rel = 'noopener'; row.appendChild(a);
      var er = h('a', 'btn', 'بلّغ عن خطأ بالمعلومات'); er.href = 'https://www.openstreetmap.org/note/new#map=19/' + it.lat + '/' + it.lon; er.target = '_blank'; er.rel = 'noopener'; row.appendChild(er); }
    box.appendChild(row);
    if (hasStat(key) && remote) box.appendChild(fuelReportBox(it));
    if (key === 'exchange') box.appendChild(h('p', 'warnbox', EXW));
    if (!okO) {
      if (isMine(it)) { box.appendChild(h('p', 'meta', 'هاي إضافتك. غيرك بيأكّدها أو بينفيها.')); box.appendChild(ownerRow(t, it)); }
      else {
        box.appendChild(voteRow(t, it));
        if (!it.seed) { var fl = h('button', 'btn flag', 'بلّغ عن محتوى مسيء أو وهمي'); fl.type = 'button'; var fa = false;
          fl.addEventListener('click', function () { if (!canWrite()) return; if (!fa) { fa = true; fl.textContent = 'اضغط مرة تانية لتأكيد الإبلاغ'; return; } flagItem(t, it); }); box.appendChild(fl); }
      }
    }
  }

  /* ===== مسار حقيقي عبر الشوارع (OSRM) ===== */
  var me = null;
  function clearRoute() { if (routeLine) { map.removeLayer(routeLine); routeLine = null; } $('route').hidden = true; }
  function routeTo(lat, lon) {
    function run() {
      var url = 'https://router.project-osrm.org/route/v1/driving/' + me.lon + ',' + me.lat + ';' + lon + ',' + lat + '?overview=full&geometries=geojson';
      fetch(url).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.routes || !j.routes.length) throw 0;
        var rt = j.routes[0]; clearRoute();
        routeLine = L.polyline(rt.geometry.coordinates.map(function (c) { return [c[1], c[0]]; }), { color: '#1565c0', weight: 6, opacity: .88 }).addTo(map);
        map.fitBounds(routeLine.getBounds(), { paddingTopLeft: [30, 130], paddingBottomRight: [30, 190] });
        var km = (rt.distance / 1000).toFixed(1), min = Math.max(1, Math.round(rt.duration / 60));
        $('routeTxt').textContent = km + ' كم · حوالي ' + (min >= 60 ? Math.floor(min / 60) + ' س و ' + (min % 60) + ' د' : min + ' دقيقة');
        $('route').hidden = false; selected = null; renderDetail();
      }).catch(function () { toast('ما قدرنا نحسب المسار الحين، جرّب بعد شوي'); });
    }
    go('map');
    if (me) { run(); return; }
    if (!navigator.geolocation) { toast('المتصفح ما بيدعم تحديد الموقع'); return; }
    navigator.geolocation.getCurrentPosition(function (p) { me = { lat: p.coords.latitude, lon: p.coords.longitude }; drawMe(); run(); }, function () { toast('فعّل صلاحية الموقع لرسم المسار'); }, { enableHighAccuracy: true, timeout: 12000 });
  }
  $('routeX').addEventListener('click', clearRoute);
  function drawMe() {
    if (!me) return;
    if (!meMarker) meMarker = L.marker([me.lat, me.lon], { icon: L.divIcon({ className: '', iconSize: [18, 18], iconAnchor: [9, 9], html: '<div class="me"></div>' }), interactive: false, zIndexOffset: 900 }).addTo(map);
    else meMarker.setLatLng([me.lat, me.lon]);
  }

  /* ===== وضع القيادة: تنبيه صوتي على بعد 1 كم ===== */
  var watchId = null, wake = null, alerted = {}, abTimer;
  function speak(text) {
    try { if (!settings.voice || !('speechSynthesis' in window)) return; speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(trText(text)); u.lang = LANG === 'en' ? 'en-US' : 'ar-SA'; u.rate = 0.95; speechSynthesis.speak(u); } catch (e) {}
  }
  function fireAlert(r, d) {
    var d1 = d >= 950 ? '1 كم' : (Math.max(100, Math.round(d / 100) * 100)) + ' متر';
    var txt = R[r.type].say + ' أمامك على بعد ' + d1;
    $('alertTxt').textContent = txt; $('alertb').hidden = false;
    $('alertb').onclick = function () { $('alertb').hidden = true; openOnMap(r.lat, r.lon, 'reports', r.id, 16); };
    clearTimeout(abTimer); abTimer = setTimeout(function () { $('alertb').hidden = true; }, 12000);
    speak('انتبه! خطر أمامك. ' + txt);
    try { if (settings.vib && navigator.vibrate) navigator.vibrate([300, 120, 300, 120, 300]); } catch (e) {}
  }
  function checkHazards() {
    if (!me) return;
    var best = null;
    reports.forEach(function (r) {
      if (!R[r.type] || !R[r.type].alert || !live(r)) return;
      var d = dist(me, r); if (d > 1000) return;
      if (alerted[r.id] && Date.now() - alerted[r.id] < 600000) return;
      if (me.hd != null && !isNaN(me.hd) && (me.sp || 0) > 2) {
        var diff = Math.abs(((bearing(me, r) - me.hd + 540) % 360) - 180);
        if (diff > 75) return;
      }
      if (!best || d < best.d) best = { r: r, d: d };
    });
    if (best) { alerted[best.r.id] = Date.now(); fireAlert(best.r, best.d); }
  }
  function onPos(p) { me = { lat: p.coords.latitude, lon: p.coords.longitude, hd: p.coords.heading, sp: p.coords.speed }; drawMe(); checkHazards(); }
  function setDrive(on) { $('bDrive').setAttribute('aria-pressed', on ? 'true' : 'false'); $('driveTxt').textContent = on ? 'القيادة: شغّال' : 'وضع القيادة'; }
  function startDrive() {
    if (!navigator.geolocation) { toast('المتصفح ما بيدعم تحديد الموقع'); return; }
    speak(' ');
    watchId = navigator.geolocation.watchPosition(onPos, function () { toast('ما قدرنا نوصل لموقعك، فعّل الصلاحية'); stopDrive(); }, { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 });
    try { navigator.wakeLock.request('screen').then(function (l) { wake = l; }, function () {}); } catch (e) {}
    setDrive(true); toast('وضع القيادة شغّال. خلّي التطبيق مفتوح والشاشة مضوية');
  }
  function stopDrive() {
    if (watchId != null) navigator.geolocation.clearWatch(watchId); watchId = null;
    try { if (wake) wake.release(); } catch (e) {} wake = null; setDrive(false);
  }
  $('bDrive').addEventListener('click', function () { if (watchId == null) startDrive(); else stopDrive(); });
  $('testAlert').addEventListener('click', function () {
    hideSheets();
    var r = reports.filter(function (x) { return live(x) && R[x.type].alert; })[0];
    if (!r) { toast('ما في أخطار فعّالة لتجربتها'); return; }
    speak(' '); fireAlert(r, 1000);
  });
  $('clearSeed').addEventListener('click', function () { reports = reports.filter(function (r) { return !r.seed; }); persist(); selected = null; renderAll(); toast('انمسحت البلاغات التجريبية'); });

  /* ===== فلاتر الخريطة والطبقات ===== */
  function setMode(m) {
    mode = m;
    Object.keys(vis).forEach(function (k) { vis[k] = m === 'all' || (m === 'haz' ? !!((R[k] && R[k].alert) || k === 'wx') : m === 'fac' ? !!F[k] : vis[k]); });
    renderChips(); drawPins(); refreshO();
  }
  function renderChips() {
    var box = $('chips'); box.textContent = '';
    [['all', 'الكل'], ['haz', 'مخاطر الطريق'], ['fac', 'الخدمات']].forEach(function (c) {
      var b = h('button', 'chip', c[1]); b.type = 'button'; b.setAttribute('aria-pressed', mode === c[0] ? 'true' : 'false');
      b.addEventListener('click', function () { selected = null; renderDetail(); setMode(c[0]); }); box.appendChild(b);
    });
  }
  function countKind(k) { var n = 0; Object.keys(osm).forEach(function (id) { if (osm[id].kind === k && !oldO(osm[id])) n++; }); facs.forEach(function (f) { if (f.kind === k && facOk(f)) n++; }); return n; }
  function renderLayers() {
    var box = $('layList'); box.textContent = '';
    function group(title, obj, withCount) {
      box.appendChild(h('b', null, title));
      Object.keys(obj).forEach(function (k) {
        var l = h('label'), cb = h('input'); cb.type = 'checkbox'; cb.checked = !!vis[k];
        var sw = h('span', 'sw'); sw.style.background = obj[k].c;
        cb.addEventListener('change', function () { vis[k] = cb.checked; mode = 'custom'; renderChips(); drawPins(); refreshO(); });
        l.appendChild(cb); l.appendChild(sw); l.appendChild(document.createTextNode(obj[k].n));
        if (withCount) l.appendChild(h('span', 'cnt', String(countKind(k))));
        box.appendChild(l);
      });
    }
    group('بلاغات المستخدمين', R, false); group('الخدمات', F, true);
    box.appendChild(h('b', null, 'الطقس'));
    var l = h('label'), cb = h('input'); cb.type = 'checkbox'; cb.checked = !!vis.wx; var sw = h('span', 'sw'); sw.style.background = '#0b6e99';
    cb.addEventListener('change', function () { vis.wx = cb.checked; mode = 'custom'; renderChips(); drawWx(); });
    l.appendChild(cb); l.appendChild(sw); l.appendChild(document.createTextNode('تنبيهات الطقس (ضباب، مطر، جليد)')); box.appendChild(l);
  }
  $('bLay').addEventListener('click', function () { renderLayers(); showSheet('laySheet'); });

  /* ===== نافذة الإضافة: 1 النوع، 2 الموقع، 3 التفاصيل ===== */
  var addMode = 'report', autoKind = false, chosen = null, photoData = null, addLoc = null, picking = false;
  function inSyria(ll) { return ll.lat > 32 && ll.lat < 37.5 && ll.lng > 35.5 && ll.lng < 42.5 && inPoly(ll.lat, ll.lng); }
  function showSheet(id) { $('scrim').hidden = false; $(id).hidden = false; }
  function hideSheets() { ['scrim', 'sheet', 'laySheet', 'infoSheet'].forEach(function (id) { $(id).hidden = true; }); }
  function resetForm() {
    chosen = null; photoData = null; addLoc = null;
    $('fnote').value = ''; $('fname').value = ''; $('fphoto').value = ''; $('fprev').hidden = true; $('fpickLbl').textContent = 'إرفاق صورة (اختياري)';
    document.querySelectorAll('input[name="fuel"]').forEach(function (c) { c.checked = false; });
  }
  function cancelAdd() { hideSheets(); resetForm(); }
  function buildTypes() {
    var box = $('ftypes'); box.textContent = '';
    var obj = addMode === 'report' ? R : F;
    Object.keys(obj).forEach(function (k) {
      if (addMode === 'facility' && !F[k].add) return;
      var b = h('button'); b.type = 'button'; b.setAttribute('aria-pressed', chosen === k ? 'true' : 'false'); b.innerHTML = svg(k, obj[k].c, 26); b.appendChild(document.createTextNode(obj[k].n));
      b.addEventListener('click', function () { chosen = k; autoKind = false; buildTypes(); $('fuelWrap').hidden = !(addMode === 'facility' && k === 'fuel'); updateSend(); });
      box.appendChild(b);
    });
    var isR = addMode === 'report';
    $('typeLbl').textContent = isR ? '1. شو صاير؟' : '1. شو نوع المرفق؟';
    $('ftitle').textContent = isR ? 'إرسال بلاغ' : 'إضافة مرفق أو خدمة';
    $('fsub').textContent = isR ? 'شارك ما تراه على الطريق' : 'أضف مكان مفيد للناس';
    $('fnameLbl').firstChild.nodeValue = isR ? 'اسم الطريق (اختياري)' : 'اسم المرفق (مطلوب)';
    $('fname').placeholder = isR ? 'مثال: أوتوستراد المزة' : 'مثال: كازية المزة';
    $('photoWrap').hidden = !isR;
    $('fsend').textContent = isR ? 'أرسل البلاغ' : 'أضف المرفق';
    $('fhint').textContent = isR ? 'البلاغ مجهول. الموقع بينقرّب لحوالي 100 متر، والصورة بتنعاد كتابتها فبتنحذف منها بيانات الكاميرا والموقع.' : 'المرفق بيظهر للجميع فوراً بموقعه الدقيق. إذا المعلومة غلط، الناس بيقدروا يبلّغوا عنها.';
    $('fnote').placeholder = isR ? 'أضف تفاصيل تساعد الآخرين…' : 'ساعات الدوام أو أقرب معلم';
    updateSend();
  }
  function updateSend() {
    var why = !chosen ? 'اختر ' + (addMode === 'report' ? 'نوع البلاغ' : 'نوع المرفق') + ' أول شي' : !addLoc ? 'حدد الموقع (موقعي الحالي أو على الخريطة)' : (addMode === 'facility' && !$('fname').value.trim()) ? 'اكتب اسم المرفق' : '';
    $('fsend').disabled = !!why; $('fwhy').textContent = why;
  }
  function setLocUi(state, txt) { var s = $('locSt'); s.className = 'st ' + (state || ''); s.textContent = txt; }
  function setAddLoc(ll, how) {
    if (!inSyria(ll)) { addLoc = null; setLocUi('err', 'الموقع خارج سوريا. حدد موقع تاني.'); updateSend(); return; }
    addLoc = { lat: ll.lat, lng: ll.lng }; setLocUi('ok', '✓ ' + placeLabel({ lat: ll.lat, lon: ll.lng }) + (how === 'gps' ? ' · موقعك الحالي' : ' · محدد على الخريطة')); updateSend();
  }
  function tryGps() {
    setLocUi('', 'عم نحدد موقعك…');
    if (!navigator.geolocation) { setLocUi('err', 'المتصفح ما بيدعم تحديد الموقع. حدد على الخريطة.'); return; }
    navigator.geolocation.getCurrentPosition(function (p) { me = { lat: p.coords.latitude, lon: p.coords.longitude }; drawMe(); setAddLoc({ lat: p.coords.latitude, lng: p.coords.longitude }, 'gps'); },
      function () { addLoc = null; setLocUi('err', 'تعذّر تحديد موقعك. فعّل الصلاحية أو حدد على الخريطة.'); updateSend(); }, { enableHighAccuracy: true, timeout: 10000 });
  }
  function openAdd(ll, how) {
    if (!canWrite()) return;
    buildTypes(); showSheet('sheet');
    if (ll) setAddLoc(ll, how); else if (!addLoc) { setLocUi('', 'عم نحدد موقعك…'); tryGps(); } else setAddLoc(addLoc, 'map');
  }
  $('bAdd').addEventListener('click', function () { openAdd(); });
  $('fx').addEventListener('click', cancelAdd);
  $('scrim').addEventListener('click', function () { if (!$('sheet').hidden) cancelAdd(); else hideSheets(); });
  document.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', hideSheets); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (!$('sheet').hidden) cancelAdd(); else hideSheets(); } });
  $('locGps').addEventListener('click', tryGps);
  function guessKind(n) {   /* تصنيف تلقائي للمرفق من اسمه */
    n = String(n || '');
    var R2 = [[/صيدلي/, 'pharmacy'], [/مخبز|فرن|أفران|افران|معجنات|خبز/, 'bakery'], [/صراف|صرافة|حوالات|تحويل أموال/, 'exchange'], [/مستشفى|مشفى|مستوصف|عيادة|مركز طبي|مركز صحي/, 'hospital'], [/كازية|محطة وقود|محروقات|بنزين|مازوت|غاز/, 'fuel'], [/مطعم|مقهى|كافي|شاورما|فلافل|مأكولات|حلويات|برغر|بيتزا/, 'restaurant'], [/استراحة|إستراحة/, 'rest'], [/فندق|نزل|بيت ضيافة|شقق|موتيل/, 'hotel'], [/مخفر|شرطة|أمن|مرور/, 'police'], [/إطفاء|اطفاء/, 'fire'], [/إسعاف|اسعاف/, 'ambulance'], [/بلدية/, 'municipality'], [/نفوس|سجل مدني/, 'registry']];
    for (var i = 0; i < R2.length; i++) if (R2[i][0].test(n)) return R2[i][1];
    return null;
  }
  $('fname').addEventListener('input', function () {
    if (addMode === 'facility') { var g = guessKind($('fname').value); if (g && F[g] && F[g].add && (!chosen || autoKind) && chosen !== g) { chosen = g; autoKind = true; buildTypes(); $('fuelWrap').hidden = g !== 'fuel'; } }
    updateSend();
  });
  $('seg').querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () { addMode = b.dataset.m; chosen = null; $('fuelWrap').hidden = true; $('seg').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); buildTypes(); });
  });

  /* اختيار الموقع من الخريطة */
  function setPick(on) { picking = on; $('pickbar').hidden = !on; $('cross').hidden = !on; $('chips').hidden = on; if (on) { selected = null; $('detail').hidden = true; } }
  $('locMap').addEventListener('click', function () { hideSheets(); go('map'); setPick(true); });
  $('pickNo').addEventListener('click', function () { setPick(false); openAdd(); });
  $('pickOk').addEventListener('click', function () { var c = map.getCenter(); setPick(false); openAdd({ lat: c.lat, lng: c.lng }, 'map'); });
  $('pickMe').addEventListener('click', function () {
    if (!navigator.geolocation) { toast('المتصفح ما بيدعم تحديد الموقع'); return; }
    navigator.geolocation.getCurrentPosition(function (p) { map.setView([p.coords.latitude, p.coords.longitude], 17); }, function () { toast('ما قدرنا نحدد موقعك، حرّك الخريطة يدوياً'); });
  });
  map.on('click', function (e) {
    if (picking) return;
    var d = h('div'); d.style.cssText = 'display:grid;gap:8px;min-width:170px';
    d.appendChild(h('b', null, 'أضف بلاغ أو مرفق هون؟'));
    var b = h('button', 'btn primary', 'نعم، أضف هون'); b.type = 'button';
    b.addEventListener('click', function () { map.closePopup(); openAdd({ lat: e.latlng.lat, lng: e.latlng.lng }, 'map'); });
    var r = h('button', 'btn', 'رجوع'); r.type = 'button';
    r.addEventListener('click', function () { map.closePopup(); });
    d.appendChild(b); d.appendChild(r);
    L.popup({ closeButton: false }).setLatLng(e.latlng).setContent(d).openOn(map);
  });

  /* زر "موقعي": بيروح الخريطة لمكانك الحالي */
  $('bMe').addEventListener('click', function () {
    if (!navigator.geolocation) { toast('المتصفح ما بيدعم تحديد الموقع'); return; }
    toast('عم نحدد موقعك…');
    navigator.geolocation.getCurrentPosition(function (p) {
      me = { lat: p.coords.latitude, lon: p.coords.longitude, hd: p.coords.heading, sp: p.coords.speed };
      drawMe(); map.setView([me.lat, me.lon], 16); toast('هاد موقعك الحالي');
    }, function () { toast('تعذّر تحديد موقعك. فعّل صلاحية الموقع من إعدادات المتصفح'); }, { enableHighAccuracy: true, timeout: 12000 });
  });

  $('fphoto').addEventListener('change', function () {
    var f = this.files && this.files[0]; if (!f) return; var fr = new FileReader();
    fr.onload = function () {
      var im = new Image();
      im.onload = function () {
        var s = Math.min(1, 480 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        photoData = c.toDataURL('image/jpeg', 0.6); $('fprev').src = photoData; $('fprev').hidden = false; $('fpickLbl').textContent = 'غيّر الصورة';
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(f);
  });

  function nearDup(type, lat, lon) {   /* بلاغ مشابه قريب (220م، آخر 30 دقيقة)؟ */
    var best = null;
    reports.forEach(function (r) { if (r.type === type && live(r) && Date.now() - r.at < 1800000 && dist(r, { lat: lat, lon: lon }) < 220) best = r; });
    return best;
  }
  var sending = false;
  $('sheet').addEventListener('submit', function (e) {
    e.preventDefault(); if (!chosen || !addLoc || sending || !canWrite()) return;
    var note = $('fnote').value.trim().slice(0, 140), nm = $('fname').value.trim().slice(0, 80), sel, p, table;
    if (addMode === 'report') {
      var lat = Math.round(addLoc.lat * 100000) / 100000, lon = Math.round(addLoc.lng * 100000) / 100000, d = nearDup(chosen, lat, lon);
      if (d) { hideSheets(); resetForm(); toast('في بلاغ مشابه قريب. أكّده بدل ما تكرّره'); openOnMap(d.lat, d.lon, 'reports', d.id, 16); return; }
      var r = { id: uuid(), type: chosen, lat: lat, lon: lon, road: nm, note: note, photo: safePhoto(photoData), at: Date.now(), yes: 1, no: 0, owner: owner };
      table = 'reports'; p = addItem(table, r); sel = { t: table, id: r.id, lat: r.lat, lon: r.lon };
    } else {
      if (!nm) { toast('اكتب اسم المرفق'); $('fname').focus(); return; }
      var fuel = [].slice.call(document.querySelectorAll('input[name="fuel"]:checked')).map(function (c) { return c.value; }).join(',');
      var f = { id: uuid(), kind: chosen, name: nm, lat: Math.round(addLoc.lat * 100000) / 100000, lon: Math.round(addLoc.lng * 100000) / 100000, note: note, fuel: chosen === 'fuel' ? fuel : '', at: Date.now(), yes: 1, no: 0, owner: owner };
      table = 'facilities'; p = addItem(table, f); sel = { t: table, id: f.id, lat: f.lat, lon: f.lon };
    }
    sending = true; $('fsend').disabled = true;
    p.then(function () {
      vis[chosen] = true; hideSheets(); resetForm(); refreshO(); toast('انضاف وصار ظاهر للجميع' + (remote ? '' : ' (محلياً على جهازك)'));
      openOnMap(sel.lat, sel.lon, sel.t, sel.id, 16);
    }).catch(function (er) { toast(errMsg(er)); }).then(function () { sending = false; updateSend(); });
  });

  /* ===== حسابي: ملف شخصي + تسجيل دخول (Supabase Auth) + إعدادات ===== */
  function toggleRow(box, title, key) {
    var b = h('button', 'mrow'); b.type = 'button'; b.appendChild(h('b', null, title)); var s = h('small', null, settings[key] ? 'شغّال' : 'مطفي'); b.appendChild(s);
    b.setAttribute('aria-pressed', settings[key] ? 'true' : 'false');
    b.addEventListener('click', function () { settings[key] = !settings[key]; save(STK, settings); if (key === 'old') { refreshO(); setOsmStat(); } renderAcct(); renderScreen(cur); }); box.appendChild(b);
  }
  var authMsg = '';
  function renderAcct() {
    var box = $('acctBody'); box.textContent = '';
    var c = h('div', 'card acct');
    var av = h('div', 'avatar'); if (profile.name.trim()) av.textContent = profile.name.trim().charAt(0); else av.innerHTML = svg('user', 'currentColor', 36);
    c.appendChild(av);
    c.appendChild(h('b', null, profile.name.trim() || 'مستخدم دربك'));
    c.appendChild(h('p', 'meta', session ? session.email : (remote ? 'غير مسجّل دخول' : 'حساب مجهول على هذا الجهاز')));
    var st = h('div', 'pstats');
    [[reports.filter(isMine).length, 'بلاغاتي'], [facs.filter(isMine).length, 'مرافقي'], [Object.keys(votes).length, 'تأكيداتي']].forEach(function (x) { var d = h('div'); d.appendChild(h('b', null, String(x[0]))); d.appendChild(h('span', null, x[1])); st.appendChild(d); });
    c.appendChild(st);
    var l = h('label', null, 'اسمك (اختياري)'); l.setAttribute('for', 'pName'); var ni = h('input'); ni.type = 'text'; ni.id = 'pName'; ni.maxLength = 40; ni.value = profile.name; l.appendChild(ni); c.appendChild(l);
    var sv = h('button', 'btn primary', 'احفظ الاسم'); sv.type = 'button';
    sv.addEventListener('click', function () {
      profile.name = ni.value.trim().slice(0, 40); save(PK, profile);
      if (remote && session) authReq('PUT', 'user', { data: { name: profile.name } }, session.access).catch(function () {});
      toast('انحفظ'); renderAcct();
    });
    c.appendChild(sv);
    c.appendChild(h('p', 'meta', 'عضو منذ ' + new Date(profile.since).toLocaleDateString(LANG === 'en' ? 'en' : 'ar')));
    box.appendChild(c);

    var a = h('div', 'card acct');
    function lab(text, id, type, ac, min) { var lb = h('label', null, text); lb.setAttribute('for', id); var i = h('input'); i.type = type; i.id = id; i.required = true; i.autocomplete = ac; if (min) i.minLength = min; i.maxLength = 120; lb.appendChild(i); return { l: lb, i: i }; }
    function run(btn, p, ok) { btn.disabled = true; p.then(ok).catch(function (er) { toast(authErr(er.message, er.code)); }).then(function () { setTimeout(function () { btn.disabled = false; }, 1500); }); }
    var redir = encodeURIComponent(location.origin + location.pathname);
    if (!remote) {
      a.appendChild(h('b', null, 'الحسابات'));
      a.appendChild(h('p', 'meta', 'هاد وضع تجريبي: الحسابات بتشتغل بعد ربط الخادم (Supabase). هلأ ملفك وبلاغاتك محفوظين على هاد الجهاز بس.'));
    } else if (session && authTab === 'new') {
      a.appendChild(h('b', null, 'كلمة سر جديدة'));
      var fn = h('form', 'authform'); fn.style.width = '100%';
      var np = lab('كلمة السر الجديدة (8 أحرف على الأقل)', 'aNew', 'password', 'new-password', 8);
      var nb = h('button', 'btn primary big', 'حفظ'); nb.type = 'submit'; fn.appendChild(np.l); fn.appendChild(nb);
      fn.addEventListener('submit', function (ev) {
        ev.preventDefault(); if (np.i.value.length < 8) { toast('كلمة السر 8 أحرف على الأقل'); return; }
        run(nb, authReq('PUT', 'user', { password: np.i.value }, recoveryTok || session.access), function () { recoveryTok = null; authTab = 'in'; toast('تم تغيير كلمة السر'); afterLogin(); renderAcct(); });
      });
      a.appendChild(fn);
    } else if (session) {
      a.appendChild(h('b', null, 'مسجّل دخول'));
      a.appendChild(h('p', 'meta', 'بلاغاتك ومرافقك بتتبعك على أي جهاز بتسجّل منه.'));
      var out = h('button', 'btn', 'تسجيل الخروج'); out.type = 'button'; out.addEventListener('click', signOut); a.appendChild(out);
      var dl = h('button', 'btn danger', 'حذف حسابي نهائياً'); dl.type = 'button'; var armed = false;
      dl.addEventListener('click', function () { if (!armed) { armed = true; dl.textContent = 'بيحذف حسابك وكل إضافاتك. اضغط مرة تانية للتأكيد'; return; } deleteAccount(); });
      a.appendChild(dl);
    } else {
      var sg = h('div', 'seg'); sg.style.width = '100%';
      [['in', 'تسجيل الدخول'], ['up', 'إنشاء حساب']].forEach(function (x) { var b = h('button', null, x[1]); b.type = 'button'; b.setAttribute('aria-pressed', authTab === x[0] ? 'true' : 'false'); b.addEventListener('click', function () { authTab = x[0]; authMsg = ''; renderAcct(); }); sg.appendChild(b); });
      a.appendChild(h('p', 'meta', 'لازم حساب (إيميل مؤكَّد) لإضافة بلاغات أو تأكيدها. هيك منحمي التطبيق من البلاغات الوهمية. التصفح مفتوح للجميع.'));
      a.appendChild(sg);
      var f = h('form', 'authform'); f.style.width = '100%';
      if (authMsg) a.appendChild(h('p', 'meta ok', authMsg));
      if (authTab === 'forgot') {
        var fe = lab('الإيميل', 'aMail', 'email', 'email'); var fb = h('button', 'btn primary big', 'ابعتلي رابط تغيير كلمة السر'); fb.type = 'submit'; f.appendChild(fe.l); var fc = capBox(f); f.appendChild(fb);
        f.addEventListener('submit', function (ev) { ev.preventDefault(); if (!capOk(fc)) return; run(fb, authReq('POST', 'recover?redirect_to=' + redir, withCap({ email: fe.i.value.trim() }, fc)), function () { authMsg = 'إذا الإيميل مسجّل عنا، رح توصلك رسالة فيها رابط تغيير كلمة السر.'; authTab = 'in'; renderAcct(); }); });
      } else {
        var nm = authTab === 'up' ? lab('الاسم (اختياري)', 'aName', 'text', 'name') : null; if (nm) nm.i.required = false;
        var em = lab('الإيميل', 'aMail', 'email', 'email'), pw = lab(authTab === 'up' ? 'كلمة السر (8 أحرف على الأقل)' : 'كلمة السر', 'aPass', 'password', authTab === 'in' ? 'current-password' : 'new-password', authTab === 'up' ? 8 : 0);
        if (nm) f.appendChild(nm.l); f.appendChild(em.l); f.appendChild(pw.l);
        var tc = null;
        if (authTab === 'up') {
          var tl = h('label', 'chk'); tc = h('input'); tc.type = 'checkbox'; tc.required = true; tl.appendChild(tc);
          tl.appendChild(document.createTextNode(' بوافق على '));
          var tla = h('a', null, 'سياسة الاستخدام والخصوصية'); tla.href = '#'; tla.addEventListener('click', function (ev) { ev.preventDefault(); infoKey = 'terms'; openInfo(); }); tl.appendChild(tla);
          f.appendChild(tl);
        }
        var cp = capBox(f);
        var go1 = h('button', 'btn primary big', authTab === 'in' ? 'دخول' : 'إنشاء الحساب'); go1.type = 'submit'; f.appendChild(go1);
        if (authTab === 'in') { var fg = h('button', 'btn', 'نسيت كلمة السر؟'); fg.type = 'button'; fg.addEventListener('click', function () { authTab = 'forgot'; authMsg = ''; renderAcct(); }); f.appendChild(fg); }
        f.addEventListener('submit', function (ev) {
          ev.preventDefault();
          if (authTab === 'up') {
            if (pw.i.value.length < 8) { toast('كلمة السر 8 أحرف على الأقل'); return; }
            if (!/[0-9]/.test(pw.i.value) || !/[A-Za-z؀-ۿ]/.test(pw.i.value)) { toast('كلمة السر لازم تحتوي حروف وأرقام'); return; }
            if (!tc.checked) { toast('لازم توافق على سياسة الاستخدام'); return; }
            if (!capOk(cp)) return;
            run(go1, authReq('POST', 'signup?redirect_to=' + redir, withCap({ email: em.i.value.trim(), password: pw.i.value, data: { name: nm.i.value.trim().slice(0, 40) } }, cp)).then(function (j) { cp.reset(); return j; }, function (er) { cp.reset(); throw er; }), function (j) {
              if (j.access_token) { setTokens(j); afterLogin(); toast('أهلاً فيك'); renderAcct(); }
              else { authMsg = 'بعتنا رسالة تأكيد لإيميلك. افتح الرابط اللي فيها، وبعدين سجّل دخول. (شيّك رسائل السبام كمان)'; authTab = 'in'; renderAcct(); }
            });
          } else {
            if (!capOk(cp)) return;
            run(go1, authReq('POST', 'token?grant_type=password', withCap({ email: em.i.value.trim(), password: pw.i.value }, cp)).then(function (j) { cp.reset(); return j; }, function (er) { cp.reset(); throw er; }), function (j) { setTokens(j); afterLogin(); toast('أهلاً فيك'); renderAcct(); });
          }
        });
      }
      a.appendChild(f);
      if (authTab === 'forgot') { var bk = h('button', 'btn', 'رجوع'); bk.type = 'button'; bk.addEventListener('click', function () { authTab = 'in'; renderAcct(); }); a.appendChild(bk); }
    }
    box.appendChild(a);

    var s = h('div', 'card menu'); toggleRow(s, 'التنبيه الصوتي', 'voice'); toggleRow(s, 'الاهتزاز عند التنبيه', 'vib'); toggleRow(s, 'إظهار الخدمات القديمة (قبل 2024)', 'old'); box.appendChild(s);
    var inf = h('button', 'btn', 'الدعم والمعلومات'); inf.type = 'button'; inf.addEventListener('click', openInfo); box.appendChild(inf);
  }
  $('bProfile').addEventListener('click', function () { go('acct'); });

  /* ===== الدعم والمعلومات + عداد الزوار ===== */
  var INFO = {
    about: ['من نحن', ['p', 'دربك منصة مجتمعية لبلاغات الطرق والخدمات بسوريا: حوادث، طرق مقطوعة، حواجز، ظروف جوية، ومرافق مثل المشافي والصيدليات والكازيات.', 'p', 'الفكرة إن الناس بتساعد بعضها: كل مستخدم بيبلّغ عن اللي شافه، والباقي بيأكدوه أو بينفوه، فالبلاغات القديمة بتختفي لحالها.', 'p', 'بيانات المرافق الأساسية من OpenStreetMap، ومعلومات الطقس من Open-Meteo. دربك مو جهة رسمية، وما بيبعت إسعاف ولا بيحل محل الجهات المختصة.']],
    terms: ['سياسة الاستخدام', ['p', 'باستخدامك دربك بتوافق على التالي:', 'ul', ['بلّغ بس عن شي شفته فعلاً. البلاغات الكاذبة أو المضلّلة ممنوعة، وممكن تنحذف.', 'لا تنشر صور أو معلومات شخصية عن أي حدا، ولا صور وجوه أو لوحات سيارات.', 'لا تستخدم التطبيق أثناء القيادة بطريقة تشتّت انتباهك. التنبيهات الصوتية مساعدة بس، مو بديل عن انتباهك.', 'المعلومات اللي بالتطبيق مجتمعية وممكن تكون ناقصة أو قديمة أو غلط. تأكد منها قبل ما تعتمد عليها، خصوصاً بالطوارئ.', 'بحالة الطوارئ، اتصل بالجهات الرسمية مباشرة.']]],
    privacy: ['سياسة الخصوصية', ['p', 'شو بنجمع وكيف:', 'ul', ['موقعك (GPS): بيُستخدم داخل جهازك فقط لوضع القيادة والتنبيه ولرسم المسار. ما بنحفظه ولا بنرسله لخادمنا.', 'الحساب: الإيميل وكلمة السر (مشفّرة) بتنحفظ عند مزوّد المصادقة Supabase. اسمك وإيميلك ما بيظهروا لحدا على الخريطة؛ البلاغ بيظهر بدون اسم. موقع البلاغ بينقرّب لحوالي 100 متر. بتقدر تحذف حسابك مع كل إضافاتك من شاشة حسابي بأي وقت.', 'الصور: بتنعاد كتابتها بالمتصفح فبتنحذف منها بيانات الكاميرا والموقع، وبتنصغّر قبل الحفظ.', 'خدمات خارجية: لما بترسم مسار بيوصل موقعك وهدفك لخدمة OSRM، وخوادم الخرائط والطقس بيشوفوا عنوان الـIP تبع جهازك.', 'عداد الزوار: بيحسب أرقام إجمالية بدون أسماء أو مواقع.', 'رسائل "تواصل معنا": بتنحفظ مع الاسم والإيميل اللي بتكتبهم، وما بنشاركهم مع أي طرف.']]],
    contact: ['تواصل معنا', null]
  };
  var infoKey = 'about';
  function renderInfo() {
    var tabs = $('infoTabs'); tabs.textContent = '';
    Object.keys(INFO).forEach(function (k) {
      var b = h('button', null, INFO[k][0]); b.type = 'button'; b.setAttribute('aria-pressed', k === infoKey ? 'true' : 'false');
      b.addEventListener('click', function () { infoKey = k; renderInfo(); }); tabs.appendChild(b);
    });
    var body = $('infoBody'); body.textContent = '';
    if (infoKey !== 'contact') {
      var c = INFO[infoKey][1];
      for (var i = 0; i < c.length; i += 2) {
        if (c[i] === 'p') body.appendChild(h('p', null, c[i + 1]));
        else { var ul = h('ul'); c[i + 1].forEach(function (t) { ul.appendChild(h('li', null, t)); }); body.appendChild(ul); }
      }
      return;
    }
    var f = h('form'); f.style.cssText = 'display:grid;gap:10px';
    function field(id, label, tag, type) {
      var l = h('label', null, label); l.setAttribute('for', id);
      var e = h(tag); e.id = id; if (type) e.type = type; e.required = true; e.maxLength = tag === 'textarea' ? 1000 : 120; l.appendChild(e); f.appendChild(l); return e;
    }
    var n = field('cName', 'الاسم الكامل', 'input', 'text'), em = field('cMail', 'الإيميل', 'input', 'email'), sj = field('cSubj', 'الموضوع', 'input', 'text'), ms = field('cMsg', 'الرسالة', 'textarea');
    var send = h('button', 'btn primary big', 'إرسال'); send.type = 'submit'; f.appendChild(send);
    if (!remote) f.appendChild(h('p', 'meta', 'الإرسال بيحتاج ربط الخادم (Supabase). بدونه ما رح توصل الرسالة لحدا.'));
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!remote) { toast('ما في خادم مربوط لإرسال الرسائل'); return; }
      send.disabled = true;
      rpc('send_feedback', { p_name: n.value.trim(), p_email: em.value.trim(), p_subject: sj.value.trim(), p_message: ms.value.trim() })
        .then(function () { f.reset(); toast('وصلت رسالتك، شكراً'); }).catch(function (er) { toast(errMsg(er)); }).then(function () { send.disabled = false; });
    });
    body.appendChild(f);
  }
  function loadStats() {
    if (!remote) { $('stNow').textContent = '—'; $('stTot').textContent = '—'; $('stNote').textContent = 'عداد الزوار العام بيحتاج ربط الخادم.'; return; }
    api('rpc/visit_stats', { method: 'POST', body: '{}' }).then(function (s) {
      s = Array.isArray(s) ? s[0] : s; $('stNow').textContent = s.active_now; $('stTot').textContent = s.total; $('stNote').textContent = 'اليوم: ' + s.today + ' · هالشهر: ' + s.month;
    }).catch(function () { $('stNote').textContent = 'تعذّر تحميل العداد.'; });
  }
  function openInfo() { renderInfo(); loadStats(); showSheet('infoSheet'); }
  var sid = (function () { try { var s = sessionStorage.getItem('darbak.sid'); if (!s) { s = uid(); sessionStorage.setItem('darbak.sid', s); } return s; } catch (e) { return uid(); } })();
  function pingVisit(first) { if (remote) api('rpc/visit_ping', { method: 'POST', body: JSON.stringify({ p_sid: sid, p_new: !!first }) }).catch(function () {}); }
  if (remote) { pingVisit(true); setInterval(function () { if (!document.hidden) pingVisit(false); }, 60000); }

  /* ===== ربط الواجهة وتشغيل ===== */
  document.querySelectorAll('#nav .tab').forEach(function (b) {
    var k = b.dataset.go, lbl = { home: 'الرئيسية', map: 'الخريطة الحية', svc: 'الخدمات', more: 'المزيد' }[k];
    b.innerHTML = svg(k, 'currentColor', 24); b.appendChild(document.createTextNode(lbl));
    b.addEventListener('click', function () { go(k, { root: true }); });
  });
  $('bBack').addEventListener('click', back);
  $('bBell').addEventListener('click', function () { feedType = null; feedTab = 'all'; feedGov = ''; go('feed'); });
  $('homeWx').addEventListener('click', function () { go('wx'); });
  $('homeMapBtn').addEventListener('click', function () { go('map'); });
  $('homeAll').addEventListener('click', function () { feedType = null; feedTab = 'all'; feedGov = gov; go('feed'); });
  $('homeSvc').addEventListener('click', function () { svcKind = null; go('svc'); });
  ['homeGov', 'wxGov', 'svcGov', 'barGov'].forEach(function (id) {
    GOV.forEach(function (g) { var o = h('option', null, g.n); o.value = g.n; $(id).appendChild(o); });
    $(id).value = gov; $(id).addEventListener('change', function () { setGov(this.value); });
  });
  (function () { var s = $('feedGov'), o = h('option', null, 'كل سوريا'); o.value = ''; s.appendChild(o); GOV.forEach(function (g) { var x = h('option', null, g.n); x.value = g.n; s.appendChild(x); }); s.addEventListener('change', function () { feedGov = this.value; renderFeed(); }); })();

  /* زر اللغة بالشريط العلوي + تشغيل المترجم */
  (function () {
    var bl = $('bLang'); bl.innerHTML = (LANG === 'en' ? FLAG_SY : FLAG_EN) + '<span>' + (LANG === 'en' ? 'ع' : 'EN') + '</span>';
    bl.setAttribute('aria-label', LANG === 'en' ? 'العربية' : 'English'); bl.addEventListener('click', function () { setLang(LANG === 'en' ? 'ar' : 'en'); });
    if (LANG !== 'en') return;
    var d = document.documentElement; d.lang = 'en'; d.dir = 'ltr'; d.classList.add('en'); document.title = 'Darbak';
    new MutationObserver(function (ms) {
      ms.forEach(function (m) { if (m.type === 'characterData') trNode(m.target); else if (m.type === 'attributes') trNode(m.target); else m.addedNodes.forEach(function (n) { if (n.nodeType === 1) trTree(n); else trNode(n); }); });
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: TR_ATTR });
    trTree(document.body);
    d.classList.remove('trp');
  })();
  renderChips();
  if (remote) { handleAuthHash(); refresh(); syncMine(); setInterval(function () { if (!document.hidden) refresh(); }, 15000); document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); }); }
  else { initLocal(); }
  /* بدون نت: بنظهر تنبيه وبنمنع الإضافة (التطبيق بيشتغل أونلاين بس) */
  function setOnline(v) { online = v; $('offline').hidden = v; if (v) { refresh(); loadWx(); } }
  setOnline(navigator.onLine !== false);
  window.addEventListener('online', function () { setOnline(true); });
  window.addEventListener('offline', function () { setOnline(false); });
  drawPins(); go('home', { root: true });
  addCurated(); refreshO(); plLoad(); loadCountry(); loadWx(); setOsmStat();
  setTimeout(function () { $('splash').classList.add('out'); setTimeout(function () { $('splash').remove(); }, 400); }, 1100);
  $('splash').addEventListener('click', function () { this.classList.add('out'); });
  if ('serviceWorker' in navigator && location.protocol === 'https:') window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
})();

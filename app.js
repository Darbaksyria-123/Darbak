(function () {
  /* ===== إعداد الخادم: بيتعدّل من ملف config.js. إذا فاضي، التطبيق بيشتغل بوضع تجريبي على الجهاز فقط ===== */
  var CFG = window.DARBAK_CONFIG || { url: '', key: '' };
  var remote = !!(CFG.url && CFG.key && /^https:\/\//.test(CFG.url));

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
  var F = {   /* مرافق. add=1 يقدر المستخدم يضيفها. الباقي من OSM فقط */
    hospital:     { n: 'مشفى / مركز طبي',  c: '#00796b', add: 1 },
    ambulance:    { n: 'إسعاف',           c: '#d81b60', add: 1 },
    fire:         { n: 'إطفاء',           c: '#e64a19', add: 1 },
    pharmacy:     { n: 'صيدلية',          c: '#00897b', add: 1 },
    fuel:         { n: 'كازية',           c: '#2e7d32', add: 1 },
    police:       { n: 'مخفر شرطة / أمن طرق', c: '#1a237e', add: 1 },
    municipality: { n: 'بلدية',           c: '#455a64', add: 1 },
    registry:     { n: 'دائرة نفوس',      c: '#3949ab', add: 1 },
    hotel:        { n: 'فندق / مكان إقامة', c: '#6d4c41', add: 1 },
    airport:      { n: 'مطار',            c: '#0d47a1', add: 1 },
    crossing:     { n: 'معبر حدودي',      c: '#b71c1c' }
  };
  var ROOT = document.documentElement.style;
  Object.keys(R).forEach(function (k) { ROOT.setProperty('--c-' + k, R[k].c); });
  Object.keys(F).forEach(function (k) { ROOT.setProperty('--c-' + k, F[k].c); });
  function svg(k, color, size) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; }
  function tint(c) { return c + '1f'; }
  function circ(k, c) { var d = h('span', 'ci'); d.style.background = tint(c); d.innerHTML = svg(k, c, 24); return d; }

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
  var settings = Object.assign({ voice: true, vib: true }, load(STK, {}));
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

  function pinR(type) { return L.divIcon({ className: '', iconSize: [40, 40], iconAnchor: [20, 40], html: '<div class="pin" style="background:var(--c-' + type + ')">' + svg(type, '#fff', 20) + '</div>' }); }
  function pinF(kind) { return L.divIcon({ className: '', iconSize: [38, 38], iconAnchor: [19, 19], html: '<div class="fpin" style="background:var(--c-' + kind + ')">' + svg(kind, '#fff', 20) + '</div>' }); }
  function pinO(kind) { return L.divIcon({ className: '', iconSize: [30, 30], iconAnchor: [15, 15], html: '<div class="opin" style="background:var(--c-' + kind + ')">' + svg(kind, '#fff', 17) + '</div>' }); }

  function refreshO() {
    layerO.clearLayers(); var arr = [];
    Object.keys(osm).forEach(function (id) {
      var p = osm[id]; if (!vis[p.kind]) return;
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
  function ovp(q) {
    var i = 0;
    function next() {
      if (i >= OVP.length) return Promise.reject(new Error('overpass'));
      var u = OVP[i++], ctl = new AbortController(), to = setTimeout(function () { ctl.abort(); }, 50000);
      return fetch(u, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ctl.signal })
        .then(function (r) { clearTimeout(to); if (!r.ok) throw new Error('http'); return r.json(); })
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
  function areaBody(bb, parts) { var b = '(' + bb.join(',') + ')'; return '[out:json][timeout:60];area["ISO3166-1"="SY"][admin_level=2]->.sy;(' + parts.map(function (p) { return 'nwr' + p + '(area.sy)' + b + ';'; }).join('') + ');out center tags;'; }
  function getPois(bb, parts) {
    function bboxMode() { return ovp(qBody(bb, parts)).then(function (j) { return { elements: (j.elements || []).filter(function (e) { var p = elPt(e); return p[0] != null && inPoly(p[0], p[1]); }) }; }); }
    if (!useArea) return bboxMode();
    return ovp(areaBody(bb, parts)).then(function (j) {
      if (j.elements && j.elements.length) return j;
      if (bb === SYR) { useArea = false; return bboxMode(); }
      return j;
    });
  }
  function qBody(bb, parts) { var b = '(' + bb.join(',') + ')'; return '[out:json][timeout:45];(' + parts.map(function (p) { return 'nwr' + p + b + ';'; }).join('') + ');out center tags;'; }
  var P_COUNTRY = ['["amenity"="hospital"]', '["amenity"="police"]', '["amenity"="fire_station"]', '["emergency"="ambulance_station"]', '["amenity"="townhall"]', '["aeroway"="aerodrome"]', '["barrier"="border_control"]'];
  var P_CELL = ['["amenity"="pharmacy"]', '["amenity"="fuel"]', '["amenity"="clinic"]', '["tourism"~"^(hotel|guest_house|hostel|motel|apartment)$"]', '["office"="government"]["name"~"نفوس"]'];
  var SYR = [32.2, 35.6, 37.4, 42.4];

  var STAY = { hotel: 'فندق', guest_house: 'بيت ضيافة', hostel: 'نزل', motel: 'موتيل', apartment: 'شقق مفروشة' };
  function classify(t) {   /* بيرجّع [الفئة، التسمية الفرعية] */
    if (t.aeroway === 'aerodrome') return ['airport', 'مطار'];
    if (t.barrier === 'border_control') return ['crossing', 'معبر حدودي'];
    if (t.amenity === 'hospital') return ['hospital', 'مشفى'];
    if (t.amenity === 'clinic') return ['hospital', 'مركز طبي / عيادة'];
    if (t.amenity === 'pharmacy') return ['pharmacy', 'صيدلية'];
    if (t.amenity === 'fuel') return ['fuel', 'كازية'];
    if (t.amenity === 'fire_station') return ['fire', 'إطفاء'];
    if (t.emergency === 'ambulance_station') return ['ambulance', 'إسعاف'];
    if (t.amenity === 'townhall') return ['municipality', 'بلدية'];
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
  function toPoi(e) {
    var t = e.tags || {}, cl = classify(t); if (!cl) return null; var kind = cl[0];
    var lat = e.lat != null ? e.lat : (e.center && e.center.lat), lon = e.lon != null ? e.lon : (e.center && e.center.lon);
    if (lat == null || lon == null) return null;
    var note = [t.operator, t.phone || t['contact:phone'], t.opening_hours, t.iata || t.icao ? ('رمز ' + (t.iata || t.icao)) : ''].filter(Boolean).join(' · ');
    return { id: e.type[0] + e.id, kind: kind, sub: cl[1], lat: lat, lon: lon, name: t['name:ar'] || t.name || t['name:en'] || '', note: note, fuel: kind === 'fuel' ? fuelOf(t) : '', ot: e.type, oid: e.id };
  }
  function addOsm(els) { var n = 0; els.forEach(function (e) { var p = toPoi(e); if (p && !osm[p.id]) { osm[p.id] = p; n++; } }); return n; }

  var chain = Promise.resolve(), cellState = {}, osmErr = false, countryState = 'idle';
  function setOsmStat() {
    var n = Object.keys(osm).length, busy = countryState === 'loading' || Object.keys(cellState).some(function (k) { return cellState[k] === 'loading'; });
    var s = busy ? 'عم نحمّل بيانات OSM…' : (osmErr && !n ? 'تعذّر تحميل OSM، تأكد من النت وحرّك الخريطة' : 'مرافق OSM: ' + n);
    if (!busy && map.getZoom() < 10) s += ' · قرّب لتظهر الصيدليات والكازيات';
    $('mapStat').textContent = s;
  }
  function loadCountry() {
    var c = load('darbak.osm.country.v3', null);
    if (c && c.items && Date.now() - c.ts < 12 * 3600 * 1000) { c.items.forEach(function (p) { osm[p.id] = p; }); countryState = 'done'; refreshO(); setOsmStat(); return; }
    countryState = 'loading'; setOsmStat();
    chain = chain.then(function () {
      return getPois(SYR, P_COUNTRY).then(function (j) {
        addOsm(j.elements || []); countryState = 'done'; osmErr = false;
        save('darbak.osm.country.v3', { ts: Date.now(), items: Object.keys(osm).map(function (k) { var p = osm[k]; return { id: p.id, kind: p.kind, sub: p.sub, lat: p.lat, lon: p.lon, name: p.name, note: p.note, fuel: p.fuel, ot: p.ot, oid: p.oid }; }) });
        refreshO(); setOsmStat(); renderScreen(cur);
      }).catch(function () {
        countryState = 'idle'; osmErr = true;
        if (!Object.keys(osm).length) {   /* احتياطي: مطارات رئيسية بمواقع تقريبية لما OSM ما يوصل */
          [['مطار دمشق الدولي', 33.4114, 36.5156], ['مطار حلب الدولي', 36.1807, 37.2244], ['مطار اللاذقية (باسل الأسد)', 35.4009, 35.9487], ['مطار القامشلي', 37.0206, 41.1914], ['مطار دير الزور', 35.2854, 40.1759]].forEach(function (a, i) {
            osm['fb' + i] = { id: 'fb' + i, kind: 'airport', lat: a[1], lon: a[2], name: a[0], note: 'موقع تقريبي (احتياطي). بيانات OSM ما انحمّلت.', fuel: '', ot: 'node', oid: 0, fallback: 1 };
          });
          refreshO(); renderScreen(cur);
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
  function inGov(r) { return govOf(r) === gov; }
  function liveIn(type) { return reports.filter(function (r) { return live(r) && inGov(r) && (!type || r.type === type); }); }
  function renderHome() {
    var hr = new Date().getHours();
    $('greet').textContent = (hr < 12 ? 'صباح الخير' : hr < 18 ? 'مساء الخير' : 'مساء النور') + (profile.name ? ' يا ' + profile.name : '') + '، ' + gov;
    var w = wxOf(gov), box = $('homeWx'); box.textContent = '';
    if (!w) { box.appendChild(h('span', 'c', wxFail ? 'تعذّر تحميل الطقس' : 'عم نحمّل الطقس…')); box.appendChild(h('span', 's', wxFail ? 'تأكد من النت وجرّب مرة تانية' : '')); }
    else {
      var l = h('div'); l.appendChild(h('div', 't', (w.temp != null ? Math.round(w.temp) : '—') + '°')); l.appendChild(h('div', 'c', wcode(w.code))); box.appendChild(l);
      var r = h('div'); r.innerHTML = wicon(w.code, 64); box.appendChild(r);
      box.appendChild(h('span', 's', gov + (visTxt(w.vis) ? ' · ' + visTxt(w.vis) : '') + ' · اضغط للتفاصيل'));
      if (w.al.length) { var al = h('div', 'al'); w.al.forEach(function (a) { al.appendChild(h('span', null, a.t)); }); box.appendChild(al); }
    }
    var nr = reports.filter(live).length, ns = Object.keys(osm).length + facs.filter(facOk).length;
    $('homeCounts').textContent = nr + ' بلاغ نشط بكل سوريا · ' + ns + ' نقطة خدمة';
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
    ['hospital', 'pharmacy', 'fuel', 'police', 'airport'].forEach(function (k) {
      var b = h('button', 'qchip'); b.type = 'button'; b.innerHTML = svg(k, F[k].c, 20); b.appendChild(document.createTextNode(F[k].n));
      b.addEventListener('click', function () { svcKind = k; go('svc'); }); q.appendChild(b);
    });
    updateBell();
  }
  function updateBell() { $('bellDot').hidden = !reports.some(function (r) { return live(r) && R[r.type].alert; }); }

  /* ===== بطاقة بلاغ + شاشة البلاغات ===== */
  function rcard(r) {
    var b = h('button', 'rcard'); b.type = 'button';
    b.appendChild(circ(r.type, R[r.type].c));
    var t = h('div'); t.appendChild(h('h3', null, R[r.type].n + (r.road ? ' · ' + r.road : ''))); t.appendChild(h('p', 'meta', r.city || govOf(r))); b.appendChild(t);
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
    var big = h('div', 'wxbig'); var ic = h('div'); ic.innerHTML = wicon(w.code, 76); big.appendChild(ic);
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
      var c = h('div', 'day'); var nm = i === 0 ? 'اليوم' : new Date(d.d + 'T12:00:00').toLocaleDateString('ar', { weekday: 'long' });
      c.appendChild(h('span', null, nm)); var ic2 = h('div'); ic2.innerHTML = wicon(d.code, 30); c.appendChild(ic2);
      c.appendChild(h('b', null, Math.round(d.max) + '°')); c.appendChild(h('span', null, Math.round(d.min) + '°')); ds.appendChild(c);
    });
    box.appendChild(ds);
  }

  /* ===== شاشة الخدمات ===== */
  var svcKind = null, svcNear = false;
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
    function chip(label, k) { var b = h('button', null, label); b.type = 'button'; b.setAttribute('aria-pressed', svcKind === k ? 'true' : 'false'); b.addEventListener('click', function () { svcKind = k; renderSvc(); }); box.appendChild(b); }
    chip('الكل', null); Object.keys(F).forEach(function (k) { chip(F[k].n, k); });
    var ul = $('svcList'); ul.textContent = '';
    var rows = [], q = ($('svcQ').value || '').trim().toLowerCase();
    function qok(f) { return !q || ((f.name || '') + ' ' + (f.sub || '') + ' ' + F[f.kind].n).toLowerCase().indexOf(q) > -1; }
    facs.forEach(function (f) { if (facOk(f) && govOf(f) === gov && (!svcKind || f.kind === svcKind) && qok(f)) rows.push({ t: 'facilities', it: f, user: 1 }); });
    Object.keys(osm).forEach(function (id) { var p = osm[id]; if ((!svcKind || p.kind === svcKind) && govOf(p) === gov && qok(p)) rows.push({ t: 'osm', it: p }); });
    $('svcNear').setAttribute('aria-pressed', svcNear && me ? 'true' : 'false');
    if (!rows.length) { ul.appendChild(h('li', 'empty', Object.keys(osm).length ? 'ما في خدمات بهاي المحافظة بالنوع المختار.' : (osmErr ? 'تعذّر تحميل بيانات OpenStreetMap، تأكد من النت.' : 'عم نحمّل البيانات من OpenStreetMap…'))); return; }
    if (svcNear && me) rows.forEach(function (rw) { rw.d = dist(me, rw.it); });
    rows.sort(function (a, b) { return (svcNear && me) ? a.d - b.d : ((b.user || 0) - (a.user || 0) || (a.it.name || '').localeCompare(b.it.name || '', 'ar')); });
    var total = rows.length; rows = rows.slice(0, 120);
    rows.forEach(function (rw) {
      var f = rw.it, c = h('div', 'rcard');
      c.appendChild(circ(f.kind, F[f.kind].c));
      var t = h('div'); t.appendChild(h('h3', null, f.name || f.sub || F[f.kind].n)); var tg = h('div', 'tags'); tg.appendChild(h('span', 'tag', f.sub || F[f.kind].n)); if (rw.d != null) tg.appendChild(h('span', 'tag', rw.d < 1000 ? Math.round(rw.d / 10) * 10 + ' م' : (rw.d / 1000).toFixed(1) + ' كم')); if (rw.t === 'osm') tg.appendChild(h('span', 'tag osm', 'OSM')); t.appendChild(tg); c.appendChild(t);
      if (f.fuel) c.appendChild(h('p', 'more', (rw.t === 'osm' ? 'بيبيع: ' : 'متوفر: ') + f.fuel.replace(/,/g, '،')));
      if (f.note) c.appendChild(h('p', 'more meta', f.note));
      var row = h('div', 'row more'), go1 = h('button', 'btn', 'أظهر على الخريطة'), rt = h('button', 'btn blue', 'رسم المسار'); go1.type = rt.type = 'button';
      go1.addEventListener('click', function () { openOnMap(f.lat, f.lon, rw.t, f.id, 16); });
      rt.addEventListener('click', function () { go('map'); routeTo(f.lat, f.lon); });
      row.appendChild(go1); row.appendChild(rt); c.appendChild(row);
      var li = h('li'); li.appendChild(c); ul.appendChild(li);
    });
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
      var b = h('button', 'mrow'); b.type = 'button'; var i = h('span', 'mi'); i.innerHTML = svg(icon, 'currentColor', 21); b.appendChild(i);
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
    row('globe', 'اللغة', 'العربية', function () { toast('الإنجليزية قريباً'); });
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
      var c = h('div', 'rcard'); c.appendChild(circ(f.kind, F[f.kind].c)); var t = h('div'); t.appendChild(h('h3', null, f.name)); t.appendChild(h('p', 'meta', F[f.kind].n + ' · ' + govOf(f))); c.appendChild(t);
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
    tags.appendChild(h('span', 'tag', govOf(it)));
    if (okO) tags.appendChild(h('span', 'tag osm', 'من OpenStreetMap'));
    if (it.seed) tags.appendChild(h('span', 'tag warn', 'مثال للتجربة'));
    box.appendChild(tags);
    if (!isR && it.fuel) box.appendChild(h('p', null, (okO ? 'بيبيع (حسب OSM): ' : 'متوفر: ') + it.fuel.replace(/,/g, '،')));
    var ph = isR ? getPhoto(it) : null;
    if (ph) { var im = h('img'); im.src = ph; im.alt = 'صورة'; box.appendChild(im); }
    else if (isR && it.has_photo) { loadPhoto(it, function () { if (selected && selected.id === it.id) renderDetail(); }); box.appendChild(h('p', 'meta', 'عم نحمّل الصورة…')); }
    if (it.note) box.appendChild(h('p', null, it.note));
    if (okO) box.appendChild(h('p', 'meta', 'ما في حالة لحظية (مفتوح/مسكّر أو توفر المواد) بهاي البيانات. إذا شفت المعلومة غلط، صحّحها على OpenStreetMap.'));
    else box.appendChild(h('p', 'meta', isR ? ago(it.at) + ' · ' + left(it) : 'أضيف ' + ago(it.at)));
    var row = h('div', 'row'), g = h('button', 'btn blue', 'رسم المسار'); g.type = 'button'; g.addEventListener('click', function () { routeTo(it.lat, it.lon); });
    row.appendChild(g);
    if (okO && !it.fallback) { var a = h('a', 'btn', 'افتح على OSM'); a.href = 'https://www.openstreetmap.org/' + it.ot + '/' + it.oid; a.target = '_blank'; a.rel = 'noopener'; row.appendChild(a); }
    box.appendChild(row);
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
    try { if (!settings.voice || !('speechSynthesis' in window)) return; speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text); u.lang = 'ar-SA'; u.rate = 0.95; speechSynthesis.speak(u); } catch (e) {}
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
  function countKind(k) { var n = 0; Object.keys(osm).forEach(function (id) { if (osm[id].kind === k) n++; }); facs.forEach(function (f) { if (f.kind === k && facOk(f)) n++; }); return n; }
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
  var addMode = 'report', chosen = null, photoData = null, addLoc = null, picking = false;
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
      b.addEventListener('click', function () { chosen = k; buildTypes(); $('fuelWrap').hidden = !(addMode === 'facility' && k === 'fuel'); updateSend(); });
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
    addLoc = { lat: ll.lat, lng: ll.lng }; setLocUi('ok', '✓ ' + govOf({ lat: ll.lat, lon: ll.lng }) + (how === 'gps' ? ' · موقعك الحالي' : ' · محدد على الخريطة')); updateSend();
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
  $('fname').addEventListener('input', updateSend);
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
      var lat = Math.round(addLoc.lat * 1000) / 1000, lon = Math.round(addLoc.lng * 1000) / 1000, d = nearDup(chosen, lat, lon);
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
    b.addEventListener('click', function () { settings[key] = !settings[key]; save(STK, settings); renderAcct(); }); box.appendChild(b);
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
    c.appendChild(h('p', 'meta', 'عضو منذ ' + new Date(profile.since).toLocaleDateString('ar')));
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
        var fe = lab('الإيميل', 'aMail', 'email', 'email'); var fb = h('button', 'btn primary big', 'ابعتلي رابط تغيير كلمة السر'); fb.type = 'submit'; f.appendChild(fe.l); f.appendChild(fb);
        f.addEventListener('submit', function (ev) { ev.preventDefault(); run(fb, authReq('POST', 'recover?redirect_to=' + redir, { email: fe.i.value.trim() }), function () { authMsg = 'إذا الإيميل مسجّل عنا، رح توصلك رسالة فيها رابط تغيير كلمة السر.'; authTab = 'in'; renderAcct(); }); });
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
        var go1 = h('button', 'btn primary big', authTab === 'in' ? 'دخول' : 'إنشاء الحساب'); go1.type = 'submit'; f.appendChild(go1);
        if (authTab === 'in') { var fg = h('button', 'btn', 'نسيت كلمة السر؟'); fg.type = 'button'; fg.addEventListener('click', function () { authTab = 'forgot'; authMsg = ''; renderAcct(); }); f.appendChild(fg); }
        f.addEventListener('submit', function (ev) {
          ev.preventDefault();
          if (authTab === 'up') {
            if (pw.i.value.length < 8) { toast('كلمة السر 8 أحرف على الأقل'); return; }
            if (!/[0-9]/.test(pw.i.value) || !/[A-Za-z؀-ۿ]/.test(pw.i.value)) { toast('كلمة السر لازم تحتوي حروف وأرقام'); return; }
            if (!tc.checked) { toast('لازم توافق على سياسة الاستخدام'); return; }
            run(go1, authReq('POST', 'signup?redirect_to=' + redir, { email: em.i.value.trim(), password: pw.i.value, data: { name: nm.i.value.trim().slice(0, 40) } }), function (j) {
              if (j.access_token) { setTokens(j); afterLogin(); toast('أهلاً فيك'); renderAcct(); }
              else { authMsg = 'بعتنا رسالة تأكيد لإيميلك. افتح الرابط اللي فيها، وبعدين سجّل دخول. (شيّك رسائل السبام كمان)'; authTab = 'in'; renderAcct(); }
            });
          } else {
            run(go1, authReq('POST', 'token?grant_type=password', { email: em.i.value.trim(), password: pw.i.value }), function (j) { setTokens(j); afterLogin(); toast('أهلاً فيك'); renderAcct(); });
          }
        });
      }
      a.appendChild(f);
      if (authTab === 'forgot') { var bk = h('button', 'btn', 'رجوع'); bk.type = 'button'; bk.addEventListener('click', function () { authTab = 'in'; renderAcct(); }); a.appendChild(bk); }
    }
    box.appendChild(a);

    var s = h('div', 'card menu'); toggleRow(s, 'التنبيه الصوتي', 'voice'); toggleRow(s, 'الاهتزاز عند التنبيه', 'vib'); box.appendChild(s);
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
    var k = b.dataset.go, lbl = { home: 'الرئيسية', map: 'الخريطة', svc: 'الخدمات', more: 'المزيد' }[k];
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

  renderChips();
  if (remote) { handleAuthHash(); refresh(); syncMine(); setInterval(function () { if (!document.hidden) refresh(); }, 15000); document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); }); }
  else { initLocal(); }
  /* بدون نت: بنظهر تنبيه وبنمنع الإضافة (التطبيق بيشتغل أونلاين بس) */
  function setOnline(v) { online = v; $('offline').hidden = v; if (v) { refresh(); loadWx(); } }
  setOnline(navigator.onLine !== false);
  window.addEventListener('online', function () { setOnline(true); });
  window.addEventListener('offline', function () { setOnline(false); });
  drawPins(); go('home', { root: true });
  loadCountry(); loadWx(); setOsmStat();
  setTimeout(function () { $('splash').classList.add('out'); setTimeout(function () { $('splash').remove(); }, 400); }, 1100);
  $('splash').addEventListener('click', function () { this.classList.add('out'); });
  if ('serviceWorker' in navigator && location.protocol === 'https:') window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
})();

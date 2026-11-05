/* يتنفذ قبل أول رسم للصفحة: بيضبط لغة واتجاه الصفحة بدون وميض أو قفزة بالتخطيط */
(function () {
  try {
    if (localStorage.getItem('darbak.lang') === 'en') {
      var d = document.documentElement;
      d.lang = 'en'; d.dir = 'ltr'; d.className += ' en trp';
      setTimeout(function () { d.classList.remove('trp'); }, 2500);
    }
  } catch (e) {}
})();

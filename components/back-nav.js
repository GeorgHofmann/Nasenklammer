/* ─────────────────────────────────────────────────────────
   NKBackNav – Zurück-Schaltfläche
   Nutzt history.back(); fällt auf fallbackHref zurück,
   wenn kein Browser-Verlauf vorhanden ist.

   Verwendung:
     new NKBackNav(document.getElementById('siteBackNav'), {
       label:        'Zurück',        // optional, Standard: 'Zurück'
       fallbackHref: 'index.html',    // optional, Standard: 'index.html'
       color:        '#225a93',       // optional, überschreibt --nk-back-nav-color
     });
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  function NKBackNav(el, options) {
    if (!el) return;
    this._el = el;
    this._opts = Object.assign({
      label:        'Zurück',
      fallbackHref: 'index.html',
      color:        null,
    }, options || {});
    this._render();
  }

  NKBackNav.prototype._render = function () {
    var opts = this._opts;

    this._el.classList.add('nk-back-nav');

    if (opts.color) {
      this._el.style.setProperty('--nk-back-nav-color', opts.color);
    }

    var btn = document.createElement('button');
    btn.className = 'nk-back-nav__btn';
    btn.setAttribute('aria-label', opts.label + ' zur vorherigen Seite');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M11 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
      '<span>' + opts.label + '</span>';

    btn.addEventListener('click', function () {
      if (history.length > 1) {
        history.back();
      } else {
        window.location.href = opts.fallbackHref;
      }
    });

    this._el.appendChild(btn);
  };

  window.NKBackNav = NKBackNav;
})();
